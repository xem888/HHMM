use crate::error::{AppError, AppResult};
use crate::game;
use crate::paths::{GamePaths, GAME_EXE};
use crate::state::AppState;
use crate::steam::{self, GameInfo};
use std::path::PathBuf;
use tauri::State;

#[tauri::command(async)]
pub fn detect_game(state: State<AppState>) -> AppResult<GameInfo> {
    match steam::detect_game() {
        Ok((gp, library)) => {
            let info = GameInfo {
                root: Some(gp.root.display().to_string()),
                installed: true,
                library: Some(library),
            };
            crate::mods::scan::migrate_once(&gp);
            *state.game.lock().unwrap_or_else(|e| e.into_inner()) = Some(gp);
            Ok(info)
        }
        Err(e) => {
            if let Some(gp) = steam::load_manual_path() {
                log::info!(
                    "game auto-detection negative ({}), using persisted manual path",
                    e
                );
                let info = GameInfo {
                    root: Some(gp.root.display().to_string()),
                    installed: true,
                    library: None,
                };
                crate::mods::scan::migrate_once(&gp);
                *state.game.lock().unwrap_or_else(|p| p.into_inner()) = Some(gp);
                return Ok(info);
            }
            log::info!("game auto-detection negative: {}", e);
            *state.game.lock().unwrap_or_else(|p| p.into_inner()) = None;
            Ok(GameInfo {
                root: None,
                installed: false,
                library: None,
            })
        }
    }
}

#[tauri::command(async)]
pub fn set_game_path_manual(state: State<AppState>, root: String) -> AppResult<GameInfo> {
    let gp = GamePaths::new(PathBuf::from(&root));
    if !gp.exe().exists() {
        return Err(AppError::GameNotFound(format!(
            "{} not found under {}",
            GAME_EXE, root
        )));
    }
    steam::save_manual_path(&gp.root);
    let info = GameInfo {
        root: Some(root),
        installed: true,
        library: None,
    };
    crate::mods::scan::migrate_once(&gp);
    *state.game.lock().unwrap_or_else(|e| e.into_inner()) = Some(gp);
    Ok(info)
}

#[tauri::command(async)]
pub fn is_game_running() -> bool {
    game::process::is_game_running()
}

#[tauri::command(async)]
pub fn launch_game() -> AppResult<()> {
    let _op = crate::fsx::op_lock();
    use std::os::windows::process::CommandExt;
    const CREATE_NO_WINDOW: u32 = 0x0800_0000;
    std::process::Command::new("cmd")
        .args(["/C", "start", "", "steam://rungameid/2393970"])
        .creation_flags(CREATE_NO_WINDOW)
        .spawn()
        .map_err(|e| AppError::Other(e.to_string()))?;
    Ok(())
}

#[tauri::command]
pub fn quit_app(app: tauri::AppHandle) {
    app.exit(0);
}
