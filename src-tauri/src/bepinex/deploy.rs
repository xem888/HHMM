use crate::error::{AppError, AppResult};
use crate::paths::{validate_within, GamePaths};
use futures_util::StreamExt;
use std::io::Cursor;
use std::path::Path;
use tauri::{AppHandle, Emitter};

const BEPINEX_URL: &str =
    "https://github.com/BepInEx/BepInEx/releases/download/v5.4.23.2/BepInEx_win_x64_5.4.23.2.zip";
const BEPINEX_SHA256: &str = "f752ce4e838f4c305b9da1404b6745f2cff23b8bfd494f79f0c84d0a01f59b46";

fn emit(app: &AppHandle, phase: &str, percent: f64) {
    let _ = app.emit(
        "bepinex://deploy-progress",
        serde_json::json!({ "phase": phase, "percent": percent }),
    );
}

static DEPLOY_IN_FLIGHT: std::sync::atomic::AtomicBool = std::sync::atomic::AtomicBool::new(false);

pub async fn deploy(gp: &GamePaths, app: &AppHandle) -> AppResult<()> {
    use std::sync::atomic::Ordering;
    if DEPLOY_IN_FLIGHT
        .compare_exchange(false, true, Ordering::SeqCst, Ordering::SeqCst)
        .is_err()
    {
        return Err(AppError::Other("a BepInEx deployment is already in progress".into()));
    }
    struct Reset;
    impl Drop for Reset {
        fn drop(&mut self) {
            DEPLOY_IN_FLIGHT.store(false, std::sync::atomic::Ordering::SeqCst);
        }
    }
    let _reset = Reset;

    emit(app, "download", 0.0);

    let client = reqwest::Client::builder()
        .connect_timeout(std::time::Duration::from_secs(10))
        .timeout(std::time::Duration::from_secs(120))
        .build()
        .map_err(|e| AppError::Network(e.to_string()))?;
    let resp = client
        .get(BEPINEX_URL)
        .send()
        .await
        .map_err(|e| AppError::Network(e.to_string()))?;
    if !resp.status().is_success() {
        return Err(AppError::Network(format!("HTTP {}", resp.status())));
    }
    let total = resp.content_length().unwrap_or(0);
    let mut downloaded = 0u64;
    let mut buf: Vec<u8> = Vec::new();
    let mut stream = resp.bytes_stream();
    while let Some(chunk) = stream.next().await {
        let chunk = chunk.map_err(|e| AppError::Network(e.to_string()))?;
        buf.extend_from_slice(&chunk);
        downloaded += chunk.len() as u64;
        if total > 0 {
            emit(app, "download", downloaded as f64 / total as f64);
        }
    }

    let digest = crate::fsx::sha256_bytes(&buf);
    if digest != BEPINEX_SHA256 {
        return Err(AppError::Other(format!(
            "BepInEx download integrity check failed: expected sha256 {}, got {}",
            BEPINEX_SHA256, digest
        )));
    }

    let config_dir = gp.config();
    let backup = std::env::temp_dir().join("hhmm-bepinex-config-backup");
    if backup.exists() {
        let _ = std::fs::remove_dir_all(&backup);
    }
    if config_dir.exists() {
        copy_dir(&config_dir, &backup)?;
    }

    emit(app, "extract", 0.0);
    let staging = gp.root.join(".hhmm-bepinex-staging");
    if staging.exists() {
        std::fs::remove_dir_all(&staging)?;
    }
    std::fs::create_dir_all(&staging)?;

    let extract = (|| -> AppResult<()> {
        let mut zip = zip::ZipArchive::new(Cursor::new(buf))
            .map_err(|e| AppError::Other(format!("zip open: {}", e)))?;
        let count = zip.len();
        for i in 0..count {
            let mut f = zip
                .by_index(i)
                .map_err(|e| AppError::Other(format!("zip entry: {}", e)))?;
            let name = f.name().to_string();
            let dest = staging.join(&name);
            let safe = validate_within(&staging, &dest)?;
            if name.ends_with('/') {
                std::fs::create_dir_all(&safe)?;
            } else {
                if let Some(parent) = safe.parent() {
                    std::fs::create_dir_all(parent)?;
                }
                let mut out = std::fs::File::create(&safe)?;
                std::io::copy(&mut f, &mut out)?;
            }
            emit(app, "extract", (i + 1) as f64 / count as f64);
        }
        Ok(())
    })();
    if let Err(e) = extract {
        let _ = std::fs::remove_dir_all(&staging);
        return Err(e);
    }

    let swap = (|| -> AppResult<()> {
        let _op = crate::fsx::op_lock();
        if crate::game::process::is_game_running() {
            return Err(AppError::GameRunning);
        }
        move_tree(&staging, &gp.root)
    })();
    match swap {
        Ok(()) => {
            let _ = std::fs::remove_dir_all(&staging);
        }
        Err(e) => {
            log::warn!(
                "BepInEx swap failed mid-way, staging kept for retry at {}: {}",
                staging.display(),
                e
            );
            return Err(AppError::Other(format!(
                "deploy interrupted while swapping files in (game folder may be partially updated); \
                 re-run deploy to repair. cause: {}",
                e
            )));
        }
    }

    if backup.exists() {
        copy_dir(&backup, &config_dir)?;
        let _ = std::fs::remove_dir_all(&backup);
    }

    {
        let _op = crate::fsx::op_lock();
        if let Err(e) = crate::cfg::writer::ensure_file_value(
            &config_dir.join("BepInEx.cfg"),
            super::HIDE_MANAGER_SECTION,
            super::HIDE_MANAGER_KEY,
            super::HIDE_MANAGER_ON,
        ) {
            log::warn!("HideManagerGameObject preset after deploy failed: {}", e);
        }
    }

    emit(app, "done", 1.0);
    Ok(())
}

fn move_tree(from: &Path, to: &Path) -> AppResult<()> {
    std::fs::create_dir_all(to)?;
    for entry in std::fs::read_dir(from)?.flatten() {
        let path = entry.path();
        let dest = to.join(entry.file_name());
        if path.is_dir() {
            move_tree(&path, &dest)?;
        } else {
            crate::fsx::move_file(&path, &dest)?;
        }
    }
    Ok(())
}

fn copy_dir(from: &Path, to: &Path) -> AppResult<()> {
    std::fs::create_dir_all(to)?;
    for entry in std::fs::read_dir(from)?.flatten() {
        let path = entry.path();
        let dest = to.join(entry.file_name());
        if path.is_dir() {
            copy_dir(&path, &dest)?;
        } else {
            std::fs::copy(&path, &dest)?;
        }
    }
    Ok(())
}
