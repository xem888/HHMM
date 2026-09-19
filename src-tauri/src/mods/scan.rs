use super::{tree, ModEntry};
use crate::fsx;
use crate::paths::GamePaths;
use std::collections::HashSet;
use std::path::Path;

pub fn scan_installed_with(gp: &GamePaths, ctx: &tree::Ctx) -> Vec<ModEntry> {
    let mut out = Vec::new();
    scan_side(&gp.plugins(), true, ctx, &mut out);
    scan_side(&gp.disabled(), false, ctx, &mut out);
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

fn scan_side(root: &Path, enabled: bool, ctx: &tree::Ctx, out: &mut Vec<ModEntry>) {
    let files = tree::walk_files(root);
    let present: HashSet<String> = files.iter().map(|f| f.to_lowercase()).collect();

    let mut secondary: HashSet<String> = HashSet::new();
    for e in ctx.manifest.mods.values() {
        if present.contains(&e.dll_rel.to_lowercase()) {
            secondary.extend(
                e.files
                    .keys()
                    .filter(|f| tree::is_dll_rel(f) && !f.eq_ignore_ascii_case(&e.dll_rel))
                    .map(|f| f.to_lowercase()),
            );
        }
    }
    for w in &ctx.ws {
        if present.contains(&w.dll_rel.to_lowercase()) {
            secondary.extend(
                w.extra_files
                    .iter()
                    .filter(|f| tree::is_dll_rel(f))
                    .map(|f| f.to_lowercase()),
            );
        }
    }

    let mut seen: HashSet<String> = HashSet::new();
    let mut dlls: Vec<&String> = files
        .iter()
        .filter(|f| tree::is_dll_rel(f) && !secondary.contains(&f.to_lowercase()))
        .collect();
    dlls.sort_by_key(|f| (f.matches('/').count(), f.to_lowercase()));

    for dll_rel in dlls {
        let dll_name = tree::rel_file_name(dll_rel).to_string();
        if !seen.insert(dll_name.to_lowercase()) {
            log::warn!(
                "dll '{}' exists at more than one path under {}; managing the shallowest copy only",
                dll_name,
                root.display()
            );
            continue;
        }
        let Ok(p) = tree::rel_join(root, dll_rel) else {
            continue;
        };
        let id = p.file_stem().unwrap().to_string_lossy().to_string();
        let extra_files: Vec<String> = ctx
            .owned(&files, dll_rel)
            .into_iter()
            .filter(|f| f != dll_rel)
            .collect();

        out.push(ModEntry {
            id,
            dll_name,
            dll_rel: dll_rel.clone(),
            enabled,
            version: None,
            hash: fsx::sha256_file_cached(&p).unwrap_or_default(),
            mtime: fsx::mtime(&p).unwrap_or(0),
            size: fsx::file_size(&p).unwrap_or(0),
            extra_files,
            workshop_item_id: None,
        });
    }
}
