pub mod registry;
pub mod vdf;

use crate::error::{AppError, AppResult};
use crate::paths::{GamePaths, GAME_EXE, APP_ID};
use serde::Serialize;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GameInfo {
    pub root: Option<String>,
    pub installed: bool,
    pub library: Option<String>,
}

fn manual_path_file() -> std::path::PathBuf {
    let base = dirs::data_local_dir().unwrap_or_else(std::env::temp_dir);
    base.join("HHMM").join("manual_game_path.txt")
}

pub fn save_manual_path(root: &std::path::Path) {
    if let Err(e) = crate::fsx::atomic_write(
        &manual_path_file(),
        root.display().to_string().as_bytes(),
    ) {
        log::warn!("persist manual game path failed: {}", e);
    }
}

pub fn load_manual_path() -> Option<GamePaths> {
    let s = std::fs::read_to_string(manual_path_file()).ok()?;
    let s = s.trim();
    if s.is_empty() {
        return None;
    }
    let gp = GamePaths::new(std::path::PathBuf::from(s));
    if gp.exe().exists() {
        Some(gp)
    } else {
        log::info!("persisted manual game path no longer valid, ignoring");
        None
    }
}

pub fn detect_game() -> AppResult<(GamePaths, String)> {
    if let Ok(root) = std::env::var("HHMM_GAME_ROOT") {
        let gp = GamePaths::new(std::path::PathBuf::from(&root));
        if gp.exe().exists() {
            log::warn!("HHMM_GAME_ROOT override active: {}", root);
            return Ok((gp, "HHMM_GAME_ROOT".to_string()));
        }
        log::warn!("HHMM_GAME_ROOT is set but {} is missing there; ignoring", GAME_EXE);
    }
    let sp = registry::steam_path()?;
    let libs = vdf::library_steamapps_dirs(&sp)?;
    for sa in &libs {
        let dir = vdf::installdir_from_manifest(sa, APP_ID)
            .unwrap_or_else(|| "Human Host".to_string());
        let root = sa.join("common").join(&dir);
        if root.join(GAME_EXE).exists() {
            let library = sa.display().to_string();
            return Ok((GamePaths::new(root), library));
        }
    }
    Err(AppError::GameNotFound(format!(
        "Human Host not found across {} Steam libraries",
        libs.len()
    )))
}
