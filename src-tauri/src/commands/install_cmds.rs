use crate::error::{AppError, AppResult};
use crate::install;
use crate::state::AppState;
use std::path::PathBuf;
use tauri::State;

#[tauri::command(async)]
pub fn install_from_path(state: State<AppState>, path: String) -> AppResult<Vec<String>> {
    let path = PathBuf::from(path);
    let name = path.file_name().unwrap_or_default().to_string_lossy().into_owned();
    log::info!("install_from_path: {}", name);
    let run = || {
        let gp = state.game_paths()?;
        let _op = crate::fsx::op_lock();
        if crate::game::process::is_game_running() {
            return Err(AppError::GameRunning);
        }
        install::manual::install_from_path(&gp, &path)
    };
    run()
        .inspect(|dlls| log::info!("install_from_path: {} installed {}", name, dlls.join(", ")))
        .inspect_err(|e| log::warn!("install_from_path failed {}: {}", name, e))
}
