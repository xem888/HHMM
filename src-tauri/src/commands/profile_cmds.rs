use crate::error::{AppError, AppResult};
use crate::profile::{self, ApplyResult, ProfileMeta};
use crate::state::AppState;
use tauri::State;

#[tauri::command]
pub fn list_profiles() -> AppResult<Vec<ProfileMeta>> {
    Ok(profile::snapshot::list())
}

#[tauri::command]
pub fn create_profile(state: State<AppState>, name: String) -> AppResult<ProfileMeta> {
    let gp = state.game_paths()?;
    let _op = crate::fsx::op_lock();
    profile::snapshot::create(&gp, &name, false)
}

#[tauri::command]
pub fn apply_profile(state: State<AppState>, id: String) -> AppResult<ApplyResult> {
    let gp = state.game_paths()?;
    let _op = crate::fsx::op_lock();
    if crate::game::process::is_game_running() {
        return Err(AppError::GameRunning);
    }
    let backup_err = profile::snapshot::create_backup(&gp)
        .err()
        .map(|e| e.to_string());
    if let Some(ref reason) = backup_err {
        log::warn!("auto-backup before apply failed: {}", reason);
    }
    let prof = profile::snapshot::load(&id)?;
    let mut res = profile::apply::apply(&gp, &prof)?;
    if let Some(reason) = backup_err {
        res.failed.push(crate::mods::FailedItem {
            dll_name: "auto-backup (__backup__)".into(),
            reason,
        });
    }
    log::info!(
        "apply_profile {}: {} applied, {} failed",
        id,
        res.applied.len(),
        res.failed.len()
    );
    for f in &res.failed {
        log::warn!("apply_profile {} failed {}: {}", id, f.dll_name, f.reason);
    }
    Ok(res)
}

#[tauri::command]
pub fn delete_profile(id: String) -> AppResult<()> {
    profile::snapshot::delete(&id)
}
