use crate::bepinex::{self, BepInExStatus};
use crate::error::{AppError, AppResult};
use crate::state::AppState;
use tauri::{AppHandle, State};

#[tauri::command(async)]
pub fn detect_bepinex(state: State<AppState>) -> AppResult<BepInExStatus> {
    let gp = state.game_paths()?;
    Ok(bepinex::detect::detect(&gp))
}

#[tauri::command]
pub async fn deploy_bepinex(state: State<'_, AppState>, app: AppHandle) -> AppResult<()> {
    let gp = state.game_paths()?;
    if crate::game::process::is_game_running() {
        return Err(AppError::GameRunning);
    }
    log::info!("deploy_bepinex: start");
    bepinex::deploy::deploy(&gp, &app)
        .await
        .inspect(|_| log::info!("deploy_bepinex: done"))
        .inspect_err(|e| log::warn!("deploy_bepinex failed: {}", e))
}

#[tauri::command(async)]
pub fn fix_hide_manager(state: State<AppState>) -> AppResult<bool> {
    let gp = state.game_paths()?;
    let _op = crate::fsx::op_lock();
    if crate::game::process::is_game_running() {
        return Err(AppError::GameRunning);
    }
    let changed = crate::cfg::writer::ensure_file_value(
        &gp.config().join("BepInEx.cfg"),
        bepinex::HIDE_MANAGER_SECTION,
        bepinex::HIDE_MANAGER_KEY,
        bepinex::HIDE_MANAGER_ON,
    )?;
    log::info!("fix_hide_manager: done (changed={})", changed);
    Ok(changed)
}
