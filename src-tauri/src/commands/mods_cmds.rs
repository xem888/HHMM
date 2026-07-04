use crate::error::{AppError, AppResult};
use crate::mods::{self, ManagedMod, SyncAction, SyncResult};
use crate::state::AppState;
use tauri::State;

#[tauri::command]
pub fn list_managed_mods(state: State<AppState>) -> AppResult<Vec<ManagedMod>> {
    let gp = state.game_paths()?;
    Ok(mods::managed::list_managed(&gp))
}

#[tauri::command]
pub async fn refresh_workshop_meta(
    state: State<'_, AppState>,
    item_ids: Vec<String>,
) -> AppResult<Vec<ManagedMod>> {
    let gp = state.game_paths()?;
    mods::steam_api::fetch_meta(&item_ids).await;
    Ok(mods::managed::list_managed(&gp))
}

#[tauri::command]
pub fn install_one(state: State<AppState>, item_id: String, to_disabled: bool) -> AppResult<()> {
    let gp = state.game_paths()?;
    let _op = crate::fsx::op_lock();
    if crate::game::process::is_game_running() {
        return Err(AppError::GameRunning);
    }
    log::info!("install_one: item={} disabled={}", item_id, to_disabled);
    mods::sync::install_one(&gp, &item_id, to_disabled)
        .inspect_err(|e| log::warn!("install_one failed item={}: {}", item_id, e))
}

#[tauri::command]
pub fn uninstall_one(state: State<AppState>, mod_id: String) -> AppResult<()> {
    let gp = state.game_paths()?;
    let _op = crate::fsx::op_lock();
    if crate::game::process::is_game_running() {
        return Err(AppError::GameRunning);
    }
    log::info!("uninstall_one: mod={}", mod_id);
    mods::sync::uninstall_one(&gp, &mod_id)
        .inspect_err(|e| log::warn!("uninstall_one failed mod={}: {}", mod_id, e))
}

#[tauri::command]
pub fn compute_sync_plan(state: State<AppState>) -> AppResult<Vec<SyncAction>> {
    let gp = state.game_paths()?;
    let installed = mods::scan::scan_installed(&gp);
    let workshop = mods::workshop::scan_workshop(&gp);
    Ok(mods::sync::compute_plan(&installed, &workshop))
}

#[tauri::command]
pub fn apply_sync(state: State<AppState>, actions: Vec<SyncAction>) -> AppResult<SyncResult> {
    let gp = state.game_paths()?;
    let _op = crate::fsx::op_lock();
    if crate::game::process::is_game_running() {
        return Err(AppError::GameRunning);
    }
    let r = mods::sync::apply(&gp, &actions)?;
    log::info!("apply_sync: {} succeeded, {} failed", r.succeeded.len(), r.failed.len());
    for f in &r.failed {
        log::warn!("apply_sync failed {}: {}", f.dll_name, f.reason);
    }
    Ok(r)
}

#[tauri::command]
pub fn toggle_mod(state: State<AppState>, mod_id: String, enable: bool) -> AppResult<()> {
    let gp = state.game_paths()?;
    let _op = crate::fsx::op_lock();
    if crate::game::process::is_game_running() {
        return Err(AppError::GameRunning);
    }
    log::info!("toggle_mod: mod={} enable={}", mod_id, enable);
    mods::toggle::toggle(&gp, &mod_id, enable)
        .inspect_err(|e| log::warn!("toggle_mod failed mod={}: {}", mod_id, e))
}
