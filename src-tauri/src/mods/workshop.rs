use super::WorkshopItem;
use crate::fsx;
use crate::paths::{GamePaths, APP_ID};
use std::path::PathBuf;

pub fn workshop_content_dir(gp: &GamePaths) -> Option<PathBuf> {
    let steamapps = gp.root.parent()?.parent()?;
    Some(
        steamapps
            .join("workshop")
            .join("content")
            .join(APP_ID),
    )
}

pub fn scan_workshop(gp: &GamePaths) -> Vec<WorkshopItem> {
    let Some(content) = workshop_content_dir(gp) else {
        return Vec::new();
    };
    let Ok(rd) = std::fs::read_dir(&content) else {
        return Vec::new();
    };

    let mut out = Vec::new();
    for entry in rd.flatten() {
        let item_dir = entry.path();
        if !item_dir.is_dir() {
            continue;
        }
        let item_id = entry.file_name().to_string_lossy().to_string();

        let Ok(files_rd) = std::fs::read_dir(&item_dir) else {
            continue;
        };
        let files: Vec<PathBuf> = files_rd
            .flatten()
            .map(|e| e.path())
            .filter(|p| p.is_file())
            .collect();

        let is_dll = |p: &PathBuf| super::is_dll_path(p);
        let mut dlls: Vec<&PathBuf> = files.iter().filter(|p| is_dll(p)).collect();
        dlls.sort_by_key(|p| {
            p.file_name()
                .map(|n| n.to_string_lossy().to_lowercase())
                .unwrap_or_default()
        });
        let Some(&dll) = dlls.first() else {
            continue;
        };
        if dlls.len() > 1 {
            log::warn!(
                "workshop item {}: {} dlls found, managing '{}' only (alphabetical); the others are never installed",
                item_id,
                dlls.len(),
                dll.file_name().unwrap_or_default().to_string_lossy()
            );
        }

        let dll_name = dll.file_name().unwrap().to_string_lossy().to_string();
        let extra_files = files
            .iter()
            .filter(|p| !is_dll(p))
            .map(|p| p.file_name().unwrap().to_string_lossy().to_string())
            .collect();

        out.push(WorkshopItem {
            item_id,
            dll_name,
            version: None,
            hash: fsx::sha256_file_cached(dll).unwrap_or_default(),
            mtime: fsx::mtime(dll).unwrap_or(0),
            extra_files,
        });
    }
    out
}
