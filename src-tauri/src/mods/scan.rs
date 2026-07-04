use super::ModEntry;
use crate::fsx;
use crate::paths::GamePaths;
use std::path::{Path, PathBuf};

pub fn scan_installed(gp: &GamePaths) -> Vec<ModEntry> {
    let mut out = Vec::new();
    scan_dir(&gp.plugins(), true, &mut out);
    scan_dir(&gp.disabled(), false, &mut out);
    out
}

static MIGRATED: std::sync::Once = std::sync::Once::new();

pub fn migrate_once(gp: &GamePaths) {
    MIGRATED.call_once(|| {
        let _op = crate::fsx::op_lock();
        migrate_legacy_disabled(gp);
    });
}

fn migrate_legacy_disabled(gp: &GamePaths) {
    let legacy = gp.legacy_disabled();
    if !legacy.is_dir() {
        return;
    }
    let target = gp.disabled();
    let _ = std::fs::create_dir_all(&target);
    if let Ok(rd) = std::fs::read_dir(&legacy) {
        for e in rd.flatten() {
            let p = e.path();
            if p.is_file() {
                if let Some(name) = p.file_name() {
                    let _ = fsx::move_file(&p, &target.join(name));
                }
            }
        }
    }
    let _ = std::fs::remove_dir(&legacy);
}

fn scan_dir(dir: &Path, enabled: bool, out: &mut Vec<ModEntry>) {
    let Ok(rd) = std::fs::read_dir(dir) else {
        return;
    };
    let files: Vec<PathBuf> = rd
        .flatten()
        .map(|e| e.path())
        .filter(|p| p.is_file())
        .collect();

    let names: Vec<String> = files
        .iter()
        .filter_map(|p| p.file_name().map(|s| s.to_string_lossy().to_string()))
        .collect();
    let stems = super::dll_stems_of(&names);

    for p in &files {
        if !super::is_dll_path(p) {
            continue;
        }
        let dll_name = p.file_name().unwrap().to_string_lossy().to_string();
        let id = p.file_stem().unwrap().to_string_lossy().to_string();

        let extra_files: Vec<String> = names
            .iter()
            .filter(|n| super::is_extra_file_of(n, &id, &dll_name, &stems))
            .cloned()
            .collect();

        out.push(ModEntry {
            id,
            dll_name,
            enabled,
            version: None,
            hash: fsx::sha256_file_cached(p).unwrap_or_default(),
            mtime: fsx::mtime(p).unwrap_or(0),
            size: fsx::file_size(p).unwrap_or(0),
            extra_files,
            workshop_item_id: None,
        });
    }
}
