use crate::cfg::{self, CfgChange, CfgFile, CfgFileMeta};
use crate::error::{AppError, AppResult};
use crate::paths::resolve_within;
use crate::state::AppState;
use tauri::{AppHandle, State};

#[tauri::command(async)]
pub fn list_cfg_files(state: State<AppState>) -> AppResult<Vec<CfgFileMeta>> {
    let gp = state.game_paths()?;
    let dir = gp.config();
    let mut out = Vec::new();
    if let Ok(rd) = std::fs::read_dir(&dir) {
        for e in rd.flatten() {
            let p = e.path();
            let is_cfg = p
                .extension()
                .and_then(|s| s.to_str())
                .is_some_and(|e| e.eq_ignore_ascii_case("cfg"));
            if is_cfg {
                match cfg::read_meta(&p) {
                    Ok(meta) => out.push(meta),
                    Err(e) => log::warn!("cfg '{}' unreadable, hidden from list: {}", p.display(), e),
                }
            }
        }
    }
    Ok(out)
}

#[tauri::command(async)]
pub fn read_cfg(state: State<AppState>, file_name: String) -> AppResult<CfgFile> {
    let gp = state.game_paths()?;
    let path = resolve_within(&gp.config(), &[&file_name])?;
    cfg::read_file(&path)
}

#[tauri::command(async)]
pub fn write_cfg_values(
    state: State<AppState>,
    file_name: String,
    changes: Vec<CfgChange>,
) -> AppResult<()> {
    let gp = state.game_paths()?;
    let _op = crate::fsx::op_lock();
    if crate::game::process::is_game_running() {
        return Err(AppError::GameRunning);
    }
    let path = resolve_within(&gp.config(), &[&file_name])?;
    cfg::writer::write_values(&path, &changes)
}

#[tauri::command(async)]
pub fn read_mod_cfg_i18n(state: State<AppState>) -> AppResult<cfg::mod_i18n::ModCfgI18n> {
    let gp = state.game_paths()?;
    Ok(cfg::mod_i18n::scan(&gp))
}

#[tauri::command]
pub fn open_cfg_file(app: AppHandle, state: State<AppState>, file_name: String) -> AppResult<()> {
    use tauri_plugin_opener::OpenerExt;
    let gp = state.game_paths()?;
    let path = resolve_within(&gp.config(), &[&file_name])?;
    let p = path.to_string_lossy().to_string();
    app.opener()
        .open_path(p.clone(), Some("notepad"))
        .or_else(|_| app.opener().open_path(p, None::<&str>))
        .map_err(|e| AppError::Other(e.to_string()))
}
