use crate::error::{AppError, AppResult};
use std::path::PathBuf;
use winreg::enums::*;
use winreg::RegKey;

pub fn steam_path() -> AppResult<PathBuf> {
    let hkcu = RegKey::predef(HKEY_CURRENT_USER);
    if let Ok(key) = hkcu.open_subkey("Software\\Valve\\Steam") {
        if let Ok(p) = key.get_value::<String, _>("SteamPath") {
            let pb = PathBuf::from(p);
            if pb.exists() {
                return Ok(pb);
            }
        }
    }

    let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);
    for sub in [
        "SOFTWARE\\WOW6432Node\\Valve\\Steam",
        "SOFTWARE\\Valve\\Steam",
    ] {
        if let Ok(key) = hklm.open_subkey(sub) {
            if let Ok(p) = key.get_value::<String, _>("InstallPath") {
                let pb = PathBuf::from(p);
                if pb.exists() {
                    return Ok(pb);
                }
            }
        }
    }

    Err(AppError::SteamNotFound(
        "registry SteamPath / InstallPath not found".into(),
    ))
}
