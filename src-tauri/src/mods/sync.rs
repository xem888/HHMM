use super::manifest::{self, ManifestEntry};
use super::{tree, workshop, FailedItem, ModEntry, SyncAction, SyncResult, WorkshopItem};
use crate::error::{AppError, AppResult};
use crate::fsx;
use crate::paths::{self, GamePaths};
use std::collections::BTreeMap;
use std::path::Path;

pub fn compute_plan(
    installed: &[ModEntry],
    workshop: &[WorkshopItem],
    updatable: impl Fn(&WorkshopItem, &ModEntry) -> bool,
) -> Vec<SyncAction> {
    workshop
        .iter()
        .map(|w| {
            match installed
                .iter()
                .find(|m| m.dll_name.eq_ignore_ascii_case(&w.dll_name))
            {
                None => SyncAction::Add { item: w.clone() },
                Some(m) if updatable(w, m) => SyncAction::Update {
                    item: w.clone(),
                    current: m.clone(),
                },
                Some(_) => SyncAction::UpToDate { item: w.clone() },
            }
        })
        .collect()
}

pub fn is_updatable(gp: &GamePaths, ctx: &tree::Ctx, item: &WorkshopItem, inst: &ModEntry) -> bool {
    if inst.hash != item.hash {
        return true;
    }
    if !inst.dll_rel.eq_ignore_ascii_case(&item.dll_rel) {
        return false;
    }
    let Some(content) = workshop::workshop_content_dir(gp) else {
        return false;
    };
    let src_dir = content.join(&item.item_id);
    let side = if inst.enabled { gp.plugins() } else { gp.disabled() };
    let recorded = ctx.manifest.mods.get(&item.dll_name.to_lowercase());
    for rel in &item.extra_files {
        let (Ok(src), Ok(dst)) = (tree::rel_join(&src_dir, rel), tree::rel_join(&side, rel)) else {
            continue;
        };
        if !dst.is_file() {
            return true;
        }
        let src_hash = fsx::sha256_file_cached(&src).unwrap_or_default();
        if tree::is_dll_rel(rel) {
            if fsx::sha256_file_cached(&dst).unwrap_or_default() != src_hash {
                return true;
            }
        } else if let Some(rec) = recorded.and_then(|e| e.files.get(rel)) {
            if *rec != src_hash {
                return true;
            }
        }
    }
    false
}

pub fn apply(gp: &GamePaths, actions: &[SyncAction]) -> AppResult<SyncResult> {
    let mut ctx = tree::Ctx::load(gp);
    let mut result = SyncResult::default();

    for action in actions {
        let requested = match action {
            SyncAction::Add { item } | SyncAction::Update { item, .. } => item,
            SyncAction::UpToDate { .. } => continue,
        };
        match install_item(gp, &mut ctx, &requested.item_id, false) {
            Ok(()) => result.succeeded.push(requested.dll_name.clone()),
            Err(e) => result.failed.push(FailedItem {
                dll_name: requested.dll_name.clone(),
                reason: e.to_string(),
            }),
        }
    }
    Ok(result)
}

pub fn install_one(gp: &GamePaths, item_id: &str, to_disabled: bool) -> AppResult<()> {
    let mut ctx = tree::Ctx::load(gp);
    install_item(gp, &mut ctx, item_id, to_disabled)
}

fn install_item(
    gp: &GamePaths,
    ctx: &mut tree::Ctx,
    item_id: &str,
    to_disabled: bool,
) -> AppResult<()> {
    if !workshop::is_valid_item_id(item_id) {
        return Err(AppError::Other(format!("invalid workshop item id '{}'", item_id)));
    }
    let content = workshop::workshop_content_dir(gp)
        .ok_or_else(|| AppError::NotFound("workshop content dir not found".into()))?;
    let item = ctx
        .ws
        .iter()
        .find(|w| w.item_id == item_id)
        .cloned()
        .ok_or_else(|| AppError::NotFound(format!("workshop item {} not found", item_id)))?;
    sync_one(&content, gp, ctx, &item, to_disabled)
}

pub fn uninstall_one(gp: &GamePaths, mod_id: &str) -> AppResult<()> {
    let dll = format!("{}.dll", mod_id);
    paths::resolve_within(&gp.plugins(), &[&dll])?;

    let mut ctx = tree::Ctx::load(gp);
    for side in [gp.plugins(), gp.disabled()] {
        let files = tree::walk_files(&side);
        let owned = ctx.owned_by_name(&files, &dll);
        remove_tree(&side, &owned, &dll)?;
    }
    if ctx.manifest.mods.remove(&dll.to_lowercase()).is_some() {
        manifest::save(gp, &ctx.manifest)?;
    }
    Ok(())
}

fn remove_tree(side: &Path, owned: &[String], dll_name: &str) -> AppResult<()> {
    for rel in owned {
        let p = tree::rel_join(side, rel)?;
        if let Err(e) = std::fs::remove_file(&p) {
            if tree::rel_file_name(rel).eq_ignore_ascii_case(dll_name) {
                return Err(e.into());
            }
            log::warn!("uninstall: file '{}' remove failed: {}", rel, e);
        }
    }
    tree::prune_empty_dirs(side, owned);
    Ok(())
}

pub(crate) struct TreeSource<'a> {
    pub dir: &'a Path,
    pub dll_rel: &'a str,
    pub extra_files: &'a [String],
    pub item_id: Option<&'a str>,
}

fn sync_one(
    content_dir: &Path,
    gp: &GamePaths,
    ctx: &mut tree::Ctx,
    item: &WorkshopItem,
    to_disabled: bool,
) -> AppResult<()> {
    let src_dir = content_dir.join(&item.item_id);
    install_tree(
        gp,
        ctx,
        &TreeSource {
            dir: &src_dir,
            dll_rel: &item.dll_rel,
            extra_files: &item.extra_files,
            item_id: Some(&item.item_id),
        },
        to_disabled,
    )
}

pub(crate) fn install_tree(
    gp: &GamePaths,
    ctx: &mut tree::Ctx,
    source: &TreeSource,
    to_disabled: bool,
) -> AppResult<()> {
    let src_dir = source.dir;
    let dll_rel = source.dll_rel.to_string();
    let dll_name = tree::rel_file_name(&dll_rel).to_string();
    let to_disabled = super::resolve_install_side(gp, &dll_name, to_disabled);
    let dst_dir = if to_disabled {
        gp.disabled()
    } else {
        gp.plugins()
    };
    std::fs::create_dir_all(&dst_dir)?;

    let key = dll_name.to_lowercase();
    let dst_files = tree::walk_files(&dst_dir);
    let rels: Vec<&String> = std::iter::once(&dll_rel)
        .chain(source.extra_files.iter())
        .collect();

    let others = ctx.claimed_by_others(&key, &dst_files);
    let mut new_files: BTreeMap<String, String> = BTreeMap::new();
    let mut shared: Vec<&String> = Vec::new();
    for rel in &rels {
        let src = tree::rel_join(src_dir, rel)?;
        let src_hash = fsx::sha256_file_cached(&src)?;
        if others.contains(&rel.to_lowercase()) {
            let dst = tree::rel_join(&dst_dir, rel)?;
            if fsx::sha256_file_cached(&dst).unwrap_or_default() != src_hash {
                let owner = ctx
                    .owner_of(&key, &dst_files, rel)
                    .unwrap_or_else(|| "another installed mod".to_string());
                return Err(AppError::Other(format!(
                    "file conflict: '{}' is already used by {} with different content - these two mods cannot be installed together",
                    rel, owner
                )));
            }
            shared.push(rel);
        }
        new_files.insert((*rel).clone(), src_hash);
    }

    if let Some(old_rel) = tree::find_dll_rel(&dst_files, &dll_name) {
        if !old_rel.eq_ignore_ascii_case(&dll_rel) {
            let old = ctx.owned(&dst_files, old_rel);
            remove_tree(&dst_dir, &old, &dll_name)?;
        }
    }

    let old_entry = ctx.manifest.mods.get(&key).cloned();
    let mut union = old_entry.as_ref().map(|e| e.files.clone()).unwrap_or_default();
    union.extend(new_files.clone());
    ctx.manifest.mods.insert(
        key.clone(),
        ManifestEntry {
            item_id: source.item_id.map(str::to_string),
            dll_rel: dll_rel.clone(),
            files: union,
        },
    );
    manifest::save(gp, &ctx.manifest)?;

    for rel in &rels {
        if shared.contains(rel) {
            continue;
        }
        let src = tree::rel_join(src_dir, rel)?;
        let dst = tree::rel_join(&dst_dir, rel)?;
        let src_hash = &new_files[*rel];
        let unchanged = dst.is_file()
            && if tree::is_dll_rel(rel) {
                fsx::sha256_file_cached(&dst).is_ok_and(|h| h == *src_hash)
            } else {
                old_entry
                    .as_ref()
                    .and_then(|e| e.files.get(*rel))
                    .is_some_and(|rec| rec == src_hash)
            };
        if !unchanged {
            fsx::copy_file(&src, &dst)?;
        }
    }

    if let Some(old) = &old_entry {
        let stale: Vec<String> = old
            .files
            .keys()
            .filter(|f| !new_files.keys().any(|n| n.eq_ignore_ascii_case(f)))
            .filter(|f| !others.contains(&f.to_lowercase()))
            .cloned()
            .collect();
        for rel in &stale {
            if let Ok(p) = tree::rel_join(&dst_dir, rel) {
                let _ = std::fs::remove_file(p);
            }
        }
        tree::prune_empty_dirs(&dst_dir, &stale);
    }

    if let Some(e) = ctx.manifest.mods.get_mut(&key) {
        e.files = new_files;
    }
    manifest::save(gp, &ctx.manifest)?;
    super::cleanup_other_side(gp, ctx, &dll_name, to_disabled);
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    fn wi(dll: &str, hash: &str) -> WorkshopItem {
        WorkshopItem {
            item_id: "1".into(),
            dll_name: dll.into(),
            dll_rel: dll.into(),
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
            dll_rel: dll.into(),
            enabled,
            version: None,
            hash: hash.into(),
            mtime: 0,
            size: 0,
            extra_files: vec![],
            workshop_item_id: None,
        }
    }
    fn by_hash(w: &WorkshopItem, m: &ModEntry) -> bool {
        w.hash != m.hash
    }

    #[test]
    fn plan_adds_when_not_installed() {
        let plan = compute_plan(&[], &[wi("A.dll", "h1")], by_hash);
        assert!(matches!(plan.as_slice(), [SyncAction::Add { .. }]));
    }

    #[test]
    fn plan_updates_on_hash_diff() {
        let plan = compute_plan(&[me("A.dll", "old", true)], &[wi("A.dll", "new")], by_hash);
        assert!(matches!(plan.as_slice(), [SyncAction::Update { .. }]));
    }

    #[test]
    fn plan_uptodate_on_same_hash() {
        let plan = compute_plan(&[me("A.dll", "h", true)], &[wi("A.dll", "h")], by_hash);
        assert!(matches!(plan.as_slice(), [SyncAction::UpToDate { .. }]));
    }

    #[test]
    fn plan_matches_dll_case_insensitively() {
        let plan = compute_plan(&[me("Mod.dll", "h", true)], &[wi("mod.dll", "h")], by_hash);
        assert!(matches!(plan.as_slice(), [SyncAction::UpToDate { .. }]));
    }

    fn browser_sees_installed(item_dir: &Path, plugins: &Path) -> bool {
        let files = tree::walk_files(item_dir);
        let dlls: Vec<&String> = files.iter().filter(|f| tree::is_dll_rel(f)).collect();
        let probe: Vec<&String> = if dlls.is_empty() { files.iter().collect() } else { dlls };
        !files.is_empty() && probe.iter().all(|r| tree::rel_join(plugins, r).unwrap().is_file())
    }

    fn browser_would_conflict(item_dir: &Path, plugins: &Path) -> bool {
        tree::walk_files(item_dir)
            .iter()
            .any(|r| tree::rel_join(plugins, r).unwrap().is_file())
    }

    struct Env {
        _tmp: tempfile::TempDir,
        gp: GamePaths,
        content: std::path::PathBuf,
    }

    fn env() -> Env {
        let tmp = tempfile::tempdir().unwrap();
        let gp = GamePaths::new(tmp.path().join("steamapps").join("common").join("Human Host"));
        std::fs::create_dir_all(gp.plugins()).unwrap();
        std::fs::create_dir_all(gp.disabled()).unwrap();
        let content = workshop::workshop_content_dir(&gp).unwrap();
        std::fs::create_dir_all(&content).unwrap();
        Env { _tmp: tmp, gp, content }
    }

    fn put(root: &Path, rel: &str, body: &str) {
        let p = tree::rel_join(root, rel).unwrap();
        std::fs::create_dir_all(p.parent().unwrap()).unwrap();
        std::fs::write(p, body).unwrap();
    }

    fn make_tree_item(e: &Env, id: &str) -> std::path::PathBuf {
        let dir = e.content.join(id);
        put(&dir, "Sup.dll", "dll-v1");
        put(&dir, "Silhouette.png", "png");
        put(&dir, "Hunting/pistol.wav", "wav-h");
        put(&dir, "Military/pistol.wav", "wav-m");
        put(&dir, "lib/Helper.dll", "helper-v1");
        dir
    }

    #[test]
    fn install_mirrors_the_whole_tree_exactly_like_the_browser() {
        let e = env();
        let dir = make_tree_item(&e, "100");
        install_one(&e.gp, "100", false).unwrap();

        assert_eq!(tree::walk_files(&e.gp.plugins()), tree::walk_files(&dir));
        assert!(browser_sees_installed(&dir, &e.gp.plugins()));
        let rows = super::super::scan::scan_installed_with(&e.gp, &tree::Ctx::load(&e.gp));
        assert_eq!(rows.len(), 1);
        assert_eq!(rows[0].dll_name, "Sup.dll");
        assert_eq!(rows[0].extra_files.len(), 4);
    }

    #[test]
    fn disable_and_uninstall_leave_nothing_in_plugins() {
        let e = env();
        let dir = make_tree_item(&e, "100");
        install_one(&e.gp, "100", false).unwrap();

        super::super::toggle::toggle(&e.gp, "Sup", false).unwrap();
        assert!(tree::walk_files(&e.gp.plugins()).is_empty(), "nothing may stay in plugins after disabling");
        assert!(!e.gp.plugins().join("Hunting").exists(), "emptied sub-folder should be pruned");
        assert!(!browser_would_conflict(&dir, &e.gp.plugins()));
        assert_eq!(tree::walk_files(&e.gp.disabled()), tree::walk_files(&dir));

        super::super::toggle::toggle(&e.gp, "Sup", true).unwrap();
        assert_eq!(tree::walk_files(&e.gp.plugins()), tree::walk_files(&dir), "the whole tree comes back on enable");
        assert!(tree::walk_files(&e.gp.disabled()).is_empty());

        uninstall_one(&e.gp, "Sup").unwrap();
        assert!(tree::walk_files(&e.gp.plugins()).is_empty());
        assert!(!browser_would_conflict(&dir, &e.gp.plugins()));
        assert!(manifest::load(&e.gp).mods.is_empty());
    }

    #[test]
    fn half_installed_legacy_mod_is_updatable_and_heals() {
        let e = env();
        make_tree_item(&e, "100");
        put(&e.gp.plugins(), "Sup.dll", "dll-v1");
        put(&e.gp.plugins(), "Silhouette.png", "png");

        let ctx = tree::Ctx::load(&e.gp);
        let rows = super::super::scan::scan_installed_with(&e.gp, &ctx);
        assert!(is_updatable(&e.gp, &ctx, &ctx.ws[0], &rows[0]), "missing files should count as updatable");

        install_one(&e.gp, "100", false).unwrap();
        let ctx = tree::Ctx::load(&e.gp);
        let rows = super::super::scan::scan_installed_with(&e.gp, &ctx);
        assert!(!is_updatable(&e.gp, &ctx, &ctx.ws[0], &rows[0]));
        assert!(e.gp.plugins().join("Hunting").join("pistol.wav").is_file());
    }

    #[test]
    fn user_edited_data_file_is_not_an_update_and_survives_updates() {
        let e = env();
        let dir = make_tree_item(&e, "100");
        put(&dir, "settings.json", "defaults");
        install_one(&e.gp, "100", false).unwrap();
        put(&e.gp.plugins(), "settings.json", "edited by player");

        let ctx = tree::Ctx::load(&e.gp);
        let rows = super::super::scan::scan_installed_with(&e.gp, &ctx);
        assert!(!is_updatable(&e.gp, &ctx, &ctx.ws[0], &rows[0]), "a file edited by the player is not an update");

        put(&dir, "Hunting/pistol.wav", "wav-h-v2-longer");
        let ctx = tree::Ctx::load(&e.gp);
        assert!(is_updatable(&e.gp, &ctx, &ctx.ws[0], &rows[0]), "a changed source asset should count as updatable");
        install_one(&e.gp, "100", false).unwrap();
        let read = |rel: &str| std::fs::read_to_string(tree::rel_join(&e.gp.plugins(), rel).unwrap()).unwrap();
        assert_eq!(read("Hunting/pistol.wav"), "wav-h-v2-longer");
        assert_eq!(read("settings.json"), "edited by player");
    }

    #[test]
    fn update_removes_files_the_new_version_dropped() {
        let e = env();
        let dir = make_tree_item(&e, "100");
        install_one(&e.gp, "100", false).unwrap();

        std::fs::remove_dir_all(dir.join("Military")).unwrap();
        put(&dir, "Sup.dll", "dll-v2-longer");
        install_one(&e.gp, "100", false).unwrap();
        assert_eq!(tree::walk_files(&e.gp.plugins()), tree::walk_files(&dir));
        assert!(!e.gp.plugins().join("Military").exists());
    }

    #[test]
    fn shared_file_conflict_is_refused_and_identical_share_is_kept() {
        let e = env();
        let a = e.content.join("100");
        put(&a, "A.dll", "a");
        put(&a, "Shared.dll", "same");
        let b = e.content.join("200");
        put(&b, "B.dll", "b");
        put(&b, "Shared.dll", "same");
        install_one(&e.gp, "100", false).unwrap();
        install_one(&e.gp, "200", false).unwrap();

        uninstall_one(&e.gp, "A").unwrap();
        assert!(e.gp.plugins().join("Shared.dll").is_file(), "a file still used by another installed mod must be kept");
        assert!(e.gp.plugins().join("B.dll").is_file());

        let c = e.content.join("300");
        put(&c, "C.dll", "c");
        put(&c, "Shared.dll", "DIFFERENT");
        assert!(install_one(&e.gp, "300", false).is_err());
        assert!(!e.gp.plugins().join("C.dll").exists());
    }

    #[test]
    fn install_rejects_non_numeric_item_id() {
        let e = env();
        assert!(install_one(&e.gp, "..\\..\\evil", false).is_err());
        assert!(install_one(&e.gp, "", false).is_err());
    }

    #[test]
    fn workshop_update_converts_manual_subfolder_layout() {
        let e = env();
        let dir = make_tree_item(&e, "100");
        put(&e.gp.plugins(), "Sup/Sup.dll", "dll-OLD");
        put(&e.gp.plugins(), "Sup/Hunting/pistol.wav", "old");
        install_one(&e.gp, "100", false).unwrap();
        assert_eq!(tree::walk_files(&e.gp.plugins()), tree::walk_files(&dir));
    }

    #[test]
    fn legacy_install_without_manifest_behaves_exactly_like_before() {
        let e = env();
        let dir = e.content.join("100");
        put(&dir, "Mod.dll", "dll");
        put(&dir, "Mod.hhmm-i18n.json", "{}");
        put(&dir, "readme.txt", "hi");
        for f in ["Mod.dll", "Mod.hhmm-i18n.json", "readme.txt"] {
            std::fs::copy(dir.join(f), e.gp.plugins().join(f)).unwrap();
        }
        put(&e.gp.plugins(), "Mod_items.csv", "generated by the mod at runtime");
        put(&e.gp.plugins(), "Other.dll", "another mod");
        put(&e.gp.plugins(), "Other_data.csv", "its data");
        put(&e.gp.plugins(), "notes.txt", "player's own file");

        let ctx = tree::Ctx::load(&e.gp);
        let rows = super::super::scan::scan_installed_with(&e.gp, &ctx);
        let me = rows.iter().find(|m| m.dll_name == "Mod.dll").unwrap();
        assert!(!is_updatable(&e.gp, &ctx, &ctx.ws[0], me), "a mod installed by an older version must not become updatable after upgrading");
        assert_eq!(rows.len(), 2);

        super::super::toggle::toggle(&e.gp, "Mod", false).unwrap();
        assert_eq!(
            tree::walk_files(&e.gp.disabled()),
            vec!["Mod.dll", "Mod.hhmm-i18n.json", "Mod_items.csv", "readme.txt"]
        );
        assert_eq!(
            tree::walk_files(&e.gp.plugins()),
            vec!["notes.txt", "Other.dll", "Other_data.csv"]
        );
        assert!(!e.gp.manifest().exists());

        super::super::toggle::toggle(&e.gp, "Mod", true).unwrap();
        assert!(tree::walk_files(&e.gp.disabled()).is_empty());
        uninstall_one(&e.gp, "Mod").unwrap();
        assert_eq!(
            tree::walk_files(&e.gp.plugins()),
            vec!["notes.txt", "Other.dll", "Other_data.csv"]
        );
    }

    #[test]
    fn legacy_install_update_keeps_working_and_gains_a_manifest() {
        let e = env();
        let dir = e.content.join("100");
        put(&dir, "Mod.dll", "dll-v2-new-build");
        put(&dir, "Mod.hhmm-i18n.json", "{}");
        put(&e.gp.disabled(), "Mod.dll", "dll-v1");
        put(&e.gp.disabled(), "Mod.hhmm-i18n.json", "{}");

        install_one(&e.gp, "100", false).unwrap();
        assert_eq!(std::fs::read_to_string(e.gp.disabled().join("Mod.dll")).unwrap(), "dll-v2-new-build");
        assert!(tree::walk_files(&e.gp.plugins()).is_empty());
        assert_eq!(manifest::load(&e.gp).mods["mod.dll"].files.len(), 2);
    }
}
