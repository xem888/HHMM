pub mod managed;
pub mod scan;
pub mod steam_api;
pub mod sync;
pub mod toggle;
pub mod workshop;

use crate::paths::GamePaths;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ModEntry {
    pub id: String,
    pub dll_name: String,
    pub enabled: bool,
    pub version: Option<String>,
    pub hash: String,
    pub mtime: i64,
    pub size: u64,
    pub extra_files: Vec<String>,
    pub workshop_item_id: Option<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct WorkshopItem {
    pub item_id: String,
    pub dll_name: String,
    pub version: Option<String>,
    pub hash: String,
    pub mtime: i64,
    pub extra_files: Vec<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(tag = "kind", rename_all = "camelCase")]
pub enum ManagedSource {
    Workshop {
        #[serde(rename = "itemId")]
        item_id: String,
    },
    Local,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum ManagedState {
    NotInstalled,
    Enabled,
    Disabled,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ManagedMod {
    pub key: String,
    pub id: String,
    pub dll_name: String,
    pub display_name: String,
    pub source: ManagedSource,
    pub state: ManagedState,
    pub updatable: bool,
    pub size: u64,
    pub mtime: i64,
    pub title: Option<String>,
    pub author: Option<String>,
    pub preview_url: Option<String>,
    pub time_created: Option<i64>,
    pub time_updated: Option<i64>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(tag = "action", rename_all = "camelCase")]
pub enum SyncAction {
    Add { item: WorkshopItem },
    Update { item: WorkshopItem, current: ModEntry },
    UpToDate { item: WorkshopItem },
}

#[derive(Serialize, Deserialize, Clone, Debug, Default)]
#[serde(rename_all = "camelCase")]
pub struct SyncResult {
    pub succeeded: Vec<String>,
    pub failed: Vec<FailedItem>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct FailedItem {
    pub dll_name: String,
    pub reason: String,
}

pub fn is_extra_file(name: &str, id: &str, dll: &str) -> bool {
    if name.eq_ignore_ascii_case(dll) || name.to_ascii_lowercase().ends_with(".dll") {
        return false;
    }
    match name.to_ascii_lowercase().strip_prefix(&id.to_ascii_lowercase()) {
        Some(rest) => matches!(rest.as_bytes().first(), Some(b'.' | b'_' | b'-')),
        None => false,
    }
}

pub fn is_extra_file_of(name: &str, id: &str, dll: &str, all_dll_stems: &[String]) -> bool {
    if !is_extra_file(name, id, dll) {
        return false;
    }
    !all_dll_stems.iter().any(|other| {
        other.len() > id.len()
            && !other.eq_ignore_ascii_case(id)
            && is_extra_file(name, other, &format!("{}.dll", other))
    })
}

pub fn dll_stems_of(names: &[String]) -> Vec<String> {
    names
        .iter()
        .filter(|n| is_dll_path(std::path::Path::new(n)))
        .map(|n| {
            std::path::Path::new(n)
                .file_stem()
                .map(|s| s.to_string_lossy().to_string())
                .unwrap_or_else(|| n.to_string())
        })
        .collect()
}

pub fn is_dll_path(p: &std::path::Path) -> bool {
    p.extension()
        .and_then(|s| s.to_str())
        .is_some_and(|e| e.eq_ignore_ascii_case("dll"))
}

pub fn find_dll_ci(dir: &std::path::Path, dll_name: &str) -> Option<String> {
    let rd = std::fs::read_dir(dir).ok()?;
    for e in rd.flatten() {
        if !e.path().is_file() {
            continue;
        }
        let n = e.file_name().to_string_lossy().to_string();
        if n.eq_ignore_ascii_case(dll_name) {
            return Some(n);
        }
    }
    None
}

pub fn resolve_install_side(gp: &GamePaths, dll_name: &str, intent_disabled: bool) -> bool {
    let in_plugins = find_dll_ci(&gp.plugins(), dll_name).is_some();
    let in_disabled = find_dll_ci(&gp.disabled(), dll_name).is_some();
    match (in_plugins, in_disabled) {
        (true, _) => false,
        (false, true) => true,
        (false, false) => intent_disabled,
    }
}

pub fn cleanup_other_side(gp: &GamePaths, dll_name: &str, installed_disabled: bool) {
    let other = if installed_disabled {
        gp.plugins()
    } else {
        gp.disabled()
    };
    let Some(actual) = find_dll_ci(&other, dll_name) else {
        return;
    };
    let stem = actual.rsplit_once('.').map(|(s, _)| s).unwrap_or(&actual);
    log::warn!(
        "duplicate '{}' found on both sides; removing the {} copy to keep the single-side invariant",
        actual,
        if installed_disabled { "plugins" } else { "disabled" }
    );
    if let Err(e) = std::fs::remove_file(other.join(&actual)) {
        log::warn!("cleanup duplicate dll '{}' failed: {}", actual, e);
        return;
    }
    if let Ok(rd) = std::fs::read_dir(&other) {
        let all_names: Vec<String> = rd
            .flatten()
            .filter(|e| e.path().is_file())
            .map(|e| e.file_name().to_string_lossy().to_string())
            .collect();
        let mut stems = dll_stems_of(&all_names);
        stems.push(stem.to_string());
        for n in all_names {
            if is_extra_file_of(&n, stem, &actual, &stems) {
                if let Err(err) = std::fs::remove_file(other.join(&n)) {
                    log::warn!("cleanup duplicate extra '{}' failed: {}", n, err);
                }
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::is_extra_file;

    #[test]
    fn extra_file_requires_separator_after_id() {
        assert!(is_extra_file("Stack_items.csv", "Stack", "Stack.dll"));
        assert!(is_extra_file("Stack.cfg", "Stack", "Stack.dll"));
        assert!(is_extra_file("Stack-data.bin", "Stack", "Stack.dll"));
    }

    #[test]
    fn extra_file_rejects_prefix_sibling() {
        assert!(!is_extra_file("StackCustomizer.cfg", "Stack", "Stack.dll"));
        assert!(!is_extra_file("StackCustomizer_data.csv", "Stack", "Stack.dll"));
    }

    #[test]
    fn extra_file_excludes_dll_and_self() {
        assert!(!is_extra_file("Stack.dll", "Stack", "Stack.dll"));
        assert!(!is_extra_file("Other.dll", "Stack", "Stack.dll"));
        assert!(!is_extra_file("STACK.DLL", "Stack", "Stack.dll"));
    }

    #[test]
    fn extra_file_handles_longer_id() {
        assert!(is_extra_file(
            "StackCustomizer_data.bin",
            "StackCustomizer",
            "StackCustomizer.dll"
        ));
    }

    #[test]
    fn extra_file_prefix_match_is_case_insensitive() {
        assert!(is_extra_file(
            "stackcustomizer_items.csv",
            "StackCustomizer",
            "StackCustomizer.dll"
        ));
        assert!(is_extra_file("STACK.cfg", "Stack", "Stack.dll"));
        assert!(!is_extra_file("stackcustomizer.cfg", "Stack", "Stack.dll"));
    }

    use super::{dll_stems_of, is_extra_file_of};

    #[test]
    fn extra_file_of_prefers_longest_stem() {
        let stems = vec!["QuickLoot".to_string(), "QuickLoot_Plus".to_string()];
        assert!(!is_extra_file_of(
            "QuickLoot_Plus_data.csv",
            "QuickLoot",
            "QuickLoot.dll",
            &stems
        ));
        assert!(is_extra_file_of(
            "QuickLoot_Plus_data.csv",
            "QuickLoot_Plus",
            "QuickLoot_Plus.dll",
            &stems
        ));
        assert!(is_extra_file_of(
            "QuickLoot.cfg",
            "QuickLoot",
            "QuickLoot.dll",
            &stems
        ));
        let solo = vec!["QuickLoot".to_string()];
        assert!(is_extra_file_of(
            "QuickLoot_Plus_data.csv",
            "QuickLoot",
            "QuickLoot.dll",
            &solo
        ));
    }

    #[test]
    fn dll_stems_extracts_case_insensitively() {
        let names = vec![
            "A.dll".to_string(),
            "B.DLL".to_string(),
            "c.cfg".to_string(),
        ];
        let stems = dll_stems_of(&names);
        assert_eq!(stems, vec!["A".to_string(), "B".to_string()]);
    }

    use super::{cleanup_other_side, find_dll_ci, is_dll_path, resolve_install_side};
    use crate::paths::GamePaths;

    fn temp_gp() -> (tempfile::TempDir, GamePaths) {
        let tmp = tempfile::tempdir().unwrap();
        let gp = GamePaths::new(tmp.path());
        std::fs::create_dir_all(gp.plugins()).unwrap();
        std::fs::create_dir_all(gp.disabled()).unwrap();
        (tmp, gp)
    }

    #[test]
    fn is_dll_path_ignores_case() {
        assert!(is_dll_path(std::path::Path::new("MOD.DLL")));
        assert!(is_dll_path(std::path::Path::new("mod.dll")));
        assert!(!is_dll_path(std::path::Path::new("mod.cfg")));
        assert!(!is_dll_path(std::path::Path::new("mod")));
    }

    #[test]
    fn find_dll_is_case_insensitive() {
        let (_t, gp) = temp_gp();
        std::fs::write(gp.plugins().join("Foo.DLL"), b"x").unwrap();
        assert_eq!(
            find_dll_ci(&gp.plugins(), "foo.dll").as_deref(),
            Some("Foo.DLL")
        );
        assert!(find_dll_ci(&gp.disabled(), "foo.dll").is_none());
    }

    #[test]
    fn install_side_follows_disk_not_intent() {
        let (_t, gp) = temp_gp();
        assert!(!resolve_install_side(&gp, "A.dll", false));
        assert!(resolve_install_side(&gp, "A.dll", true));
        std::fs::write(gp.disabled().join("A.dll"), b"old").unwrap();
        assert!(resolve_install_side(&gp, "A.dll", false));
        std::fs::write(gp.plugins().join("A.dll"), b"new").unwrap();
        assert!(!resolve_install_side(&gp, "A.dll", false));
    }

    #[test]
    fn cleanup_removes_duplicate_and_its_extras_from_other_side() {
        let (_t, gp) = temp_gp();
        std::fs::write(gp.plugins().join("A.dll"), b"new").unwrap();
        std::fs::write(gp.disabled().join("a.DLL"), b"old").unwrap();
        std::fs::write(gp.disabled().join("a_data.csv"), b"old").unwrap();
        std::fs::write(gp.disabled().join("Other.dll"), b"keep").unwrap();
        cleanup_other_side(&gp, "A.dll", false);
        assert!(!gp.disabled().join("a.DLL").exists());
        assert!(!gp.disabled().join("a_data.csv").exists());
        assert!(gp.disabled().join("Other.dll").exists(), "unrelated mod must not be removed");
        assert!(gp.plugins().join("A.dll").exists());
    }
}
