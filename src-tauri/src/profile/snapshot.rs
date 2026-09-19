use super::{Profile, ProfileMeta};
use crate::error::{AppError, AppResult};
use crate::fsx;
use crate::mods;
use crate::paths::GamePaths;
use std::collections::BTreeMap;
use std::path::PathBuf;

pub fn profiles_dir() -> PathBuf {
    let base = dirs::data_local_dir().unwrap_or_else(std::env::temp_dir);
    base.join("HHMM").join("profiles")
}

fn profile_path(id: &str) -> AppResult<PathBuf> {
    crate::paths::resolve_within(&profiles_dir(), &[&format!("{}.json", id)])
}

pub fn create(gp: &GamePaths, name: &str, overwrite: bool) -> AppResult<ProfileMeta> {
    create_with_id(gp, &super::sanitize_id(name), name, overwrite)
}

pub fn create_backup(gp: &GamePaths) -> AppResult<ProfileMeta> {
    if let Ok(legacy) = profile_path("backup") {
        if let Ok(content) = std::fs::read_to_string(&legacy) {
            if let Ok(p) = serde_json::from_str::<Profile>(&content) {
                if p.name == super::BACKUP_NAME {
                    let _ = std::fs::remove_file(&legacy);
                }
            }
        }
    }
    create_with_id(gp, super::BACKUP_ID, super::BACKUP_NAME, true)
}

fn create_with_id(gp: &GamePaths, id: &str, name: &str, overwrite: bool) -> AppResult<ProfileMeta> {
    let id = id.to_string();
    if !overwrite && profile_path(&id)?.exists() {
        return Err(AppError::Other(format!(
            "A profile with the same ID '{}' already exists (names are sanitized for storage; delete it first or pick another name)",
            id
        )));
    }

    let mut cfgs = BTreeMap::new();
    if let Ok(rd) = std::fs::read_dir(gp.config()) {
        for e in rd.flatten() {
            let p = e.path();
            let is_cfg = p
                .extension()
                .and_then(|s| s.to_str())
                .is_some_and(|e| e.eq_ignore_ascii_case("cfg"));
            if is_cfg {
                let read = std::fs::read_to_string(&p);
                if let Err(ref e) = read {
                    log::warn!(
                        "cfg '{}' unreadable, excluded from profile snapshot: {}",
                        p.display(),
                        e
                    );
                }
                if let Ok(content) = read {
                    let fname = p.file_name().unwrap().to_string_lossy().to_string();
                    let content = if fname.eq_ignore_ascii_case("BepInEx.cfg") {
                        crate::cfg::writer::ensure_value(
                            &content,
                            crate::bepinex::HIDE_MANAGER_SECTION,
                            crate::bepinex::HIDE_MANAGER_KEY,
                            crate::bepinex::HIDE_MANAGER_ON,
                        )
                        .0
                    } else {
                        content
                    };
                    cfgs.insert(fname, content);
                }
            }
        }
    }

    let managed = mods::managed::list_managed(gp);
    let mut profile_mods = Vec::new();
    for m in &managed {
        if m.state == mods::ManagedState::NotInstalled {
            continue;
        }
        let item_id = match &m.source {
            mods::ManagedSource::Workshop { item_id } => Some(item_id.clone()),
            mods::ManagedSource::Local => None,
        };
        profile_mods.push(super::ProfileMod {
            id: m.id.clone(),
            dll_name: m.dll_name.clone(),
            item_id,
            enabled: m.state == mods::ManagedState::Enabled,
        });
    }
    let enabled_count = profile_mods.iter().filter(|m| m.enabled).count();
    let mod_count = profile_mods.len();

    let profile = Profile {
        id: id.clone(),
        name: name.to_string(),
        cfgs,
        mods: profile_mods,
        format: super::PROFILE_FORMAT,
    };

    let dir = profiles_dir();
    std::fs::create_dir_all(&dir)?;
    let json = serde_json::to_vec_pretty(&profile)
        .map_err(|e| AppError::Other(e.to_string()))?;
    fsx::atomic_write(&profile_path(&id)?, &json)?;

    Ok(ProfileMeta {
        id,
        name: name.to_string(),
        mod_count,
        enabled_count,
    })
}

pub fn list() -> Vec<ProfileMeta> {
    let mut out = Vec::new();
    if let Ok(rd) = std::fs::read_dir(profiles_dir()) {
        for e in rd.flatten() {
            let p = e.path();
            if p.extension().and_then(|s| s.to_str()) == Some("json") {
                if let Ok(content) = std::fs::read_to_string(&p) {
                    if let Ok(prof) = serde_json::from_str::<Profile>(&content) {
                        out.push(ProfileMeta {
                            id: prof.id.clone(),
                            name: prof.name.clone(),
                            mod_count: prof.mods.len(),
                            enabled_count: prof.mods.iter().filter(|m| m.enabled).count(),
                        });
                    }
                }
            }
        }
    }
    out
}

pub fn load(id: &str) -> AppResult<Profile> {
    let content = std::fs::read_to_string(profile_path(id)?)
        .map_err(|_| AppError::NotFound(format!("profile {}", id)))?;
    serde_json::from_str(&content).map_err(|e| AppError::Parse(e.to_string()))
}

pub fn delete(id: &str) -> AppResult<()> {
    let p = profile_path(id)?;
    if p.exists() {
        std::fs::remove_file(p)?;
    }
    Ok(())
}
