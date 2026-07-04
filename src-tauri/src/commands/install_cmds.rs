use crate::error::{AppError, AppResult};
use crate::install;
use crate::state::AppState;
use std::path::PathBuf;
use tauri::State;

#[tauri::command]
pub fn install_from_path(state: State<AppState>, path: String) -> AppResult<Vec<String>> {
    let gp = state.game_paths()?;
    let _op = crate::fsx::op_lock();
    if crate::game::process::is_game_running() {
        return Err(AppError::GameRunning);
    }
    install::manual::install_from_path(&gp, &PathBuf::from(path))
}
