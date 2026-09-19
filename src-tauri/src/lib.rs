
mod bepinex;
mod cfg;
mod commands;
mod error;
mod fsx;
mod game;
mod install;
mod mods;
mod paths;
mod profile;
mod state;
mod steam;

use error::{AppError, AppResult};
use state::AppState;
use tauri::menu::{Menu, MenuItem};
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
use tauri::{Emitter, Manager};

fn show_main_window(app: &tauri::AppHandle) {
    if let Some(w) = app.get_webview_window("main") {
        let _ = w.show();
        let _ = w.unminimize();
        let _ = w.set_focus();
    }
}

#[tauri::command]
fn open_log_dir(app: tauri::AppHandle) -> AppResult<()> {
    use tauri_plugin_opener::OpenerExt;
    let dir = app
        .path()
        .app_log_dir()
        .map_err(|e| AppError::Io(e.to_string()))?;
    std::fs::create_dir_all(&dir)?;
    app.opener()
        .open_path(dir.to_string_lossy().to_string(), None::<&str>)
        .map_err(|e| AppError::Other(e.to_string()))
}

#[tauri::command]
fn read_log(app: tauri::AppHandle) -> AppResult<String> {
    let dir = app
        .path()
        .app_log_dir()
        .map_err(|e| AppError::Io(e.to_string()))?;
    let path = dir.join("hhmm.log");
    if !path.exists() {
        return Ok(String::new());
    }
    let content = std::fs::read_to_string(&path)?;
    const MAX: usize = 256_000;
    if content.len() <= MAX {
        return Ok(content);
    }
    let mut cut = content.len() - MAX;
    while cut < content.len() && !content.is_char_boundary(cut) {
        cut += 1;
    }
    let start = content[cut..]
        .find('\n')
        .map(|i| cut + i + 1)
        .unwrap_or(cut);
    Ok(content[start..].to_string())
}

#[tauri::command]
fn clear_log(app: tauri::AppHandle) -> AppResult<()> {
    let dir = app
        .path()
        .app_log_dir()
        .map_err(|e| AppError::Io(e.to_string()))?;
    let path = dir.join("hhmm.log");
    if path.exists() {
        std::fs::write(&path, b"")?;
    }
    Ok(())
}

#[tauri::command]
fn update_tray_lang(app: tauri::AppHandle, show: String, quit: String) {
    if let Some(tray) = app.tray_by_id("main-tray") {
        if let (Ok(show_i), Ok(quit_i)) = (
            MenuItem::with_id(&app, "show", &show, true, None::<&str>),
            MenuItem::with_id(&app, "quit", &quit, true, None::<&str>),
        ) {
            if let Ok(menu) = Menu::with_items(&app, &[&show_i, &quit_i]) {
                let _ = tray.set_menu(Some(menu));
            }
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _argv, _cwd| {
            show_main_window(app);
        }))
        .plugin(
            tauri_plugin_log::Builder::new()
                .clear_targets()
                .level(log::LevelFilter::Info)
                .level_for("tauri_plugin_updater", log::LevelFilter::Off)
                .max_file_size(5_000_000)
                .target(tauri_plugin_log::Target::new(
                    tauri_plugin_log::TargetKind::LogDir {
                        file_name: Some("hhmm".into()),
                    },
                ))
                .target(tauri_plugin_log::Target::new(
                    tauri_plugin_log::TargetKind::Stdout,
                ))
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .manage(AppState::default())
        .setup(|app| {
            log::info!("HHMM v{} started", env!("CARGO_PKG_VERSION"));
            let show_i = MenuItem::with_id(app, "show", "Show HHMM", true, None::<&str>)?;
            let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show_i, &quit_i])?;
            let mut tray = TrayIconBuilder::with_id("main-tray");
            if let Some(icon) = app.default_window_icon() {
                tray = tray.icon(icon.clone());
            } else {
                log::warn!("default window icon missing, tray will use no icon");
            }
            tray.tooltip("HHMM — Human Host Mod Manager")
                .menu(&menu)
                .show_menu_on_left_click(false)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "show" => show_main_window(app),
                    "quit" => {
                        let _ = app.emit("app://quit-requested", ());
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        show_main_window(tray.app_handle());
                    }
                })
                .build(app)?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::game_cmds::detect_game,
            commands::game_cmds::set_game_path_manual,
            commands::game_cmds::is_game_running,
            commands::game_cmds::launch_game,
            commands::game_cmds::quit_app,
            update_tray_lang,
            open_log_dir,
            read_log,
            clear_log,
            commands::cfg_cmds::list_cfg_files,
            commands::cfg_cmds::read_cfg,
            commands::cfg_cmds::write_cfg_values,
            commands::cfg_cmds::open_cfg_file,
            commands::cfg_cmds::read_mod_cfg_i18n,
            commands::mods_cmds::list_managed_mods,
            commands::mods_cmds::refresh_workshop_meta,
            commands::mods_cmds::install_one,
            commands::mods_cmds::uninstall_one,
            commands::mods_cmds::compute_sync_plan,
            commands::mods_cmds::apply_sync,
            commands::mods_cmds::toggle_mod,
            commands::bepinex_cmds::detect_bepinex,
            commands::bepinex_cmds::deploy_bepinex,
            commands::bepinex_cmds::fix_hide_manager,
            commands::profile_cmds::list_profiles,
            commands::profile_cmds::create_profile,
            commands::profile_cmds::apply_profile,
            commands::profile_cmds::delete_profile,
            commands::install_cmds::install_from_path,
        ])
        .run(tauri::generate_context!())
        .expect("error while running HHMM");
}
