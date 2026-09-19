use super::{tree, WorkshopItem};
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

pub fn is_valid_item_id(id: &str) -> bool {
    !id.is_empty() && id.bytes().all(|b| b.is_ascii_digit())
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
        if !is_valid_item_id(&item_id) {
            continue;
        }

        let files = tree::walk_files(&item_dir);
        let Some(dll_rel) = tree::pick_main_dll(&files).cloned() else {
            continue;
        };
        let dll = item_dir.join(dll_rel.replace('/', std::path::MAIN_SEPARATOR_STR));

        out.push(WorkshopItem {
            item_id,
            dll_name: tree::rel_file_name(&dll_rel).to_string(),
            version: None,
            hash: fsx::sha256_file_cached(&dll).unwrap_or_default(),
            mtime: fsx::mtime(&dll).unwrap_or(0),
            extra_files: files.into_iter().filter(|f| *f != dll_rel).collect(),
            dll_rel,
        });
    }
    out.sort_by(|a, b| a.item_id.cmp(&b.item_id));
    let mut seen = std::collections::HashSet::new();
    out.retain(|w| {
        let first = seen.insert(w.dll_name.to_lowercase());
        if !first {
            log::warn!(
                "workshop items collide on dll '{}'; only the first (by item id) is managed",
                w.dll_name
            );
        }
        first
    });
    out
}
