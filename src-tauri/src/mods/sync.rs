use super::{workshop, FailedItem, ModEntry, SyncAction, SyncResult, WorkshopItem};
use crate::error::{AppError, AppResult};
use crate::fsx;
use crate::paths::{self, GamePaths};
use std::path::Path;

pub fn compute_plan(installed: &[ModEntry], workshop: &[WorkshopItem]) -> Vec<SyncAction> {
    workshop
        .iter()
        .map(|w| {
            match installed
                .iter()
                .find(|m| m.dll_name.eq_ignore_ascii_case(&w.dll_name))
            {
                None => SyncAction::Add { item: w.clone() },
                Some(m) if m.hash != w.hash => SyncAction::Update {
                    item: w.clone(),
                    current: m.clone(),
                },
                Some(_) => SyncAction::UpToDate { item: w.clone() },
            }
        })
        .collect()
}

pub fn apply(gp: &GamePaths, actions: &[SyncAction]) -> AppResult<SyncResult> {
    let content = workshop::workshop_content_dir(gp);
    let mut result = SyncResult::default();

    for action in actions {
        let (item, to_disabled) = match action {
            SyncAction::Add { item } => (item, false),
            SyncAction::Update { item, current } => (item, !current.enabled),
            SyncAction::UpToDate { .. } => continue,
        };

        let Some(content_dir) = &content else {
            result.failed.push(FailedItem {
                dll_name: item.dll_name.clone(),
                reason: "workshop content dir not found".into(),
            });
            continue;
        };

        match sync_one(content_dir, gp, item, to_disabled) {
            Ok(()) => result.succeeded.push(item.dll_name.clone()),
            Err(e) => result.failed.push(FailedItem {
                dll_name: item.dll_name.clone(),
                reason: e.to_string(),
            }),
        }
    }
    Ok(result)
}

pub fn install_one(gp: &GamePaths, item_id: &str, to_disabled: bool) -> AppResult<()> {
    let content = workshop::workshop_content_dir(gp)
        .ok_or_else(|| AppError::NotFound("workshop content dir not found".into()))?;
    let item = workshop::scan_workshop(gp)
        .into_iter()
        .find(|w| w.item_id == item_id)
        .ok_or_else(|| AppError::NotFound(format!("workshop item {} not found", item_id)))?;
    sync_one(&content, gp, &item, to_disabled)
}

pub fn uninstall_one(gp: &GamePaths, mod_id: &str) -> AppResult<()> {
    let dll = format!("{}.dll", mod_id);
    let source_extras: Option<Vec<String>> = workshop::scan_workshop(gp)
        .into_iter()
        .find(|w| w.dll_name.eq_ignore_ascii_case(&dll))
        .map(|w| w.extra_files);
    for dir in [gp.plugins(), gp.disabled()] {
        remove_with_extras(&dir, mod_id, &dll, source_extras.as_deref())?;
    }
    Ok(())
}

fn should_remove_on_uninstall(
    name: &str,
    id: &str,
    dll: &str,
    source_extras: Option<&[String]>,
    all_dll_stems: &[String],
) -> bool {
    if name.to_ascii_lowercase().ends_with(".dll") {
        return false;
    }
    if super::is_extra_file_of(name, id, dll, all_dll_stems) {
        return true;
    }
    source_extras
        .map(|list| list.iter().any(|s| s.eq_ignore_ascii_case(name)))
        .unwrap_or(false)
}

fn remove_with_extras(
    dir: &Path,
    id: &str,
    dll: &str,
    source_extras: Option<&[String]>,
) -> AppResult<()> {
    let dll_path = paths::resolve_within(dir, &[dll])?;
    if dll_path.exists() {
        std::fs::remove_file(&dll_path)?;
    }
    if let Ok(rd) = std::fs::read_dir(dir) {
        let all_names: Vec<String> = rd
            .flatten()
            .filter(|e| e.path().is_file())
            .map(|e| e.file_name().to_string_lossy().to_string())
            .collect();
        let mut stems = super::dll_stems_of(&all_names);
        stems.push(id.to_string());
        for n in all_names {
            if should_remove_on_uninstall(&n, id, dll, source_extras, &stems) {
                if let Err(err) = std::fs::remove_file(dir.join(&n)) {
                    log::warn!("uninstall: extra file '{}' remove failed: {}", n, err);
                }
            }
        }
    }
    Ok(())
}

fn sync_one(
    content_dir: &Path,
    gp: &GamePaths,
    item: &WorkshopItem,
    to_disabled: bool,
) -> AppResult<()> {
    let src_dir = content_dir.join(&item.item_id);
    let to_disabled = super::resolve_install_side(gp, &item.dll_name, to_disabled);
    let dst_dir = if to_disabled {
        gp.disabled()
    } else {
        gp.plugins()
    };
    std::fs::create_dir_all(&dst_dir)?;

    let dll_dst = paths::resolve_within(&dst_dir, &[&item.dll_name])?;
    fsx::copy_file(&src_dir.join(&item.dll_name), &dll_dst)?;
    for ex in &item.extra_files {
        let s = src_dir.join(ex);
        if s.exists() {
            let ex_dst = paths::resolve_within(&dst_dir, &[ex])?;
            fsx::copy_file(&s, &ex_dst)?;
        }
    }
    super::cleanup_other_side(gp, &item.dll_name, to_disabled);
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    fn wi(dll: &str, hash: &str) -> WorkshopItem {
        WorkshopItem {
            item_id: "1".into(),
            dll_name: dll.into(),
            version: None,
            hash: hash.into(),
            mtime: 0,
            extra_files: vec![],
        }
    }
    fn me(dll: &str, hash: &str, enabled: bool) -> ModEntry {
        ModEntry {
            id: dll.trim_end_matches(".dll").into(),
            dll_name: dll.into(),
            enabled,
            version: None,
            hash: hash.into(),
            mtime: 0,
            size: 0,
            extra_files: vec![],
            workshop_item_id: None,
        }
    }

    #[test]
    fn plan_adds_when_not_installed() {
        let plan = compute_plan(&[], &[wi("A.dll", "h1")]);
        assert!(matches!(plan.as_slice(), [SyncAction::Add { .. }]));
    }

    #[test]
    fn plan_updates_on_hash_diff() {
        let plan = compute_plan(&[me("A.dll", "old", true)], &[wi("A.dll", "new")]);
        assert!(matches!(plan.as_slice(), [SyncAction::Update { .. }]));
    }

    #[test]
    fn plan_uptodate_on_same_hash() {
        let plan = compute_plan(&[me("A.dll", "h", true)], &[wi("A.dll", "h")]);
        assert!(matches!(plan.as_slice(), [SyncAction::UpToDate { .. }]));
    }

    #[test]
    fn plan_matches_dll_case_insensitively() {
        let plan = compute_plan(&[me("Mod.dll", "h", true)], &[wi("mod.dll", "h")]);
        assert!(matches!(plan.as_slice(), [SyncAction::UpToDate { .. }]));
    }

    fn st(list: &[&str]) -> Vec<String> {
        list.iter().map(|s| s.to_string()).collect()
    }

    #[test]
    fn uninstall_removes_source_listed_file_without_prefix() {
        let src = vec!["readme.txt".to_string(), "icon.png".to_string()];
        let s = st(&["Mod"]);
        assert!(should_remove_on_uninstall("readme.txt", "Mod", "Mod.dll", Some(&src), &s));
        assert!(should_remove_on_uninstall("icon.png", "Mod", "Mod.dll", Some(&src), &s));
    }

    #[test]
    fn uninstall_source_match_is_case_insensitive() {
        let src = vec!["Readme.TXT".to_string()];
        let s = st(&["Mod"]);
        assert!(should_remove_on_uninstall("readme.txt", "Mod", "Mod.dll", Some(&src), &s));
    }

    #[test]
    fn uninstall_falls_back_to_prefix_when_unsubscribed() {
        let s = st(&["Mod"]);
        assert!(should_remove_on_uninstall("Mod_items.csv", "Mod", "Mod.dll", None, &s));
        assert!(!should_remove_on_uninstall("readme.txt", "Mod", "Mod.dll", None, &s));
    }

    #[test]
    fn uninstall_never_touches_unrelated_or_dll() {
        let src = vec!["readme.txt".to_string(), "Helper.dll".to_string()];
        let s = st(&["Mod"]);
        assert!(!should_remove_on_uninstall("OtherMod_data.csv", "Mod", "Mod.dll", Some(&src), &s));
        assert!(!should_remove_on_uninstall("Helper.dll", "Mod", "Mod.dll", Some(&src), &s));
        assert!(!should_remove_on_uninstall("ModPack.cfg", "Mod", "Mod.dll", Some(&src), &s));
    }

    #[test]
    fn uninstall_respects_longest_stem_ownership() {
        let s = st(&["Mod", "Mod_Plus"]);
        assert!(!should_remove_on_uninstall("Mod_Plus_data.csv", "Mod", "Mod.dll", None, &s));
        assert!(should_remove_on_uninstall("Mod_Plus_data.csv", "Mod_Plus", "Mod_Plus.dll", None, &s));
    }
}
