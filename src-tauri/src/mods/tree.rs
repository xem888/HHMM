
use super::manifest::{Manifest, ManifestEntry};
use super::WorkshopItem;
use crate::error::{AppError, AppResult};
use crate::paths;
use std::collections::HashSet;
use std::path::{Path, PathBuf};

pub fn rel_join(base: &Path, rel: &str) -> AppResult<PathBuf> {
    let segs: Vec<&str> = rel.split('/').collect();
    if segs.iter().any(|s| s.is_empty()) {
        return Err(AppError::PathEscape(rel.to_string()));
    }
    paths::resolve_within(base, &segs)
}

pub fn walk_files(root: &Path) -> Vec<String> {
    let mut out = Vec::new();
    walk_into(root, "", &mut out);
    out.sort_by_key(|s| s.to_lowercase());
    out
}

fn walk_into(dir: &Path, prefix: &str, out: &mut Vec<String>) {
    let Ok(rd) = std::fs::read_dir(dir) else {
        return;
    };
    for e in rd.flatten() {
        let Ok(ft) = e.file_type() else {
            continue;
        };
        if ft.is_symlink() {
            continue;
        }
        let name = e.file_name().to_string_lossy().to_string();
        let rel = if prefix.is_empty() {
            name
        } else {
            format!("{}/{}", prefix, name)
        };
        if ft.is_dir() {
            walk_into(&e.path(), &rel, out);
        } else if ft.is_file() {
            out.push(rel);
        }
    }
}

pub fn rel_file_name(rel: &str) -> &str {
    rel.rsplit('/').next().unwrap_or(rel)
}

pub fn rel_parent(rel: &str) -> &str {
    rel.rsplit_once('/').map(|(p, _)| p).unwrap_or("")
}

fn rel_depth(rel: &str) -> usize {
    rel.matches('/').count()
}

pub fn is_dll_rel(rel: &str) -> bool {
    super::is_dll_path(Path::new(rel_file_name(rel)))
}

pub fn pick_main_dll(files: &[String]) -> Option<&String> {
    files
        .iter()
        .filter(|f| is_dll_rel(f))
        .min_by_key(|f| (rel_depth(f), f.to_lowercase()))
}

pub fn find_dll_rel<'a>(files: &'a [String], dll_name: &str) -> Option<&'a String> {
    files
        .iter()
        .filter(|f| rel_file_name(f).eq_ignore_ascii_case(dll_name))
        .min_by_key(|f| (rel_depth(f), f.to_lowercase()))
}

pub fn prune_empty_dirs(root: &Path, rels: &[String]) {
    let mut dirs: Vec<&str> = rels.iter().map(|r| rel_parent(r)).filter(|d| !d.is_empty()).collect();
    dirs.sort_by_key(|d| std::cmp::Reverse(rel_depth(d)));
    dirs.dedup();
    for d in dirs {
        let mut cur = d;
        while !cur.is_empty() {
            let Ok(p) = rel_join(root, cur) else {
                break;
            };
            if p.is_dir() && std::fs::remove_dir(&p).is_err() {
                break;
            }
            cur = rel_parent(cur);
        }
    }
}

pub struct Ctx {
    pub manifest: Manifest,
    pub ws: Vec<WorkshopItem>,
}

impl Ctx {
    pub fn load(gp: &crate::paths::GamePaths) -> Self {
        Self {
            manifest: super::manifest::load(gp),
            ws: super::workshop::scan_workshop(gp),
        }
    }

    pub fn ws_item_for(&self, dll_name: &str) -> Option<&WorkshopItem> {
        self.ws.iter().find(|w| w.dll_name.eq_ignore_ascii_case(dll_name))
    }

    pub fn owned(&self, side_files: &[String], dll_rel: &str) -> Vec<String> {
        let key = rel_file_name(dll_rel).to_lowercase();
        let others = self.claimed_by_others(&key, side_files);
        owned_rels(
            side_files,
            dll_rel,
            self.manifest.mods.get(&key),
            self.ws_item_for(rel_file_name(dll_rel)),
            &others,
        )
    }

    pub fn owned_by_name(&self, side_files: &[String], dll_name: &str) -> Vec<String> {
        if let Some(rel) = find_dll_rel(side_files, dll_name) {
            return self.owned(side_files, rel);
        }
        let key = dll_name.to_lowercase();
        let Some(e) = self.manifest.mods.get(&key) else {
            return Vec::new();
        };
        let others = self.claimed_by_others(&key, side_files);
        side_files
            .iter()
            .filter(|f| {
                e.files.keys().any(|k| k.eq_ignore_ascii_case(f))
                    && !others.contains(&f.to_lowercase())
            })
            .cloned()
            .collect()
    }

    pub fn owner_of(&self, my_key: &str, side_files: &[String], rel: &str) -> Option<String> {
        let present: HashSet<String> = side_files.iter().map(|f| f.to_lowercase()).collect();
        for (k, e) in &self.manifest.mods {
            if k != my_key
                && present.contains(&e.dll_rel.to_lowercase())
                && e.files.keys().any(|f| f.eq_ignore_ascii_case(rel))
            {
                return Some(rel_file_name(&e.dll_rel).to_string());
            }
        }
        self.ws
            .iter()
            .find(|w| {
                w.dll_name.to_lowercase() != my_key
                    && present.contains(&w.dll_rel.to_lowercase())
                    && (w.dll_rel.eq_ignore_ascii_case(rel)
                        || w.extra_files.iter().any(|f| f.eq_ignore_ascii_case(rel)))
            })
            .map(|w| w.dll_name.clone())
    }

    pub fn claimed_by_others(&self, my_key: &str, side_files: &[String]) -> HashSet<String> {
        let present: HashSet<String> = side_files.iter().map(|f| f.to_lowercase()).collect();
        let mut out = HashSet::new();
        for (k, e) in &self.manifest.mods {
            if k != my_key && present.contains(&e.dll_rel.to_lowercase()) {
                out.extend(e.files.keys().map(|f| f.to_lowercase()));
            }
        }
        for w in &self.ws {
            if w.dll_name.to_lowercase() != my_key && present.contains(&w.dll_rel.to_lowercase()) {
                out.insert(w.dll_rel.to_lowercase());
                out.extend(w.extra_files.iter().map(|f| f.to_lowercase()));
            }
        }
        out
    }
}

pub fn owned_rels(
    side_files: &[String],
    dll_rel: &str,
    entry: Option<&ManifestEntry>,
    ws_item: Option<&WorkshopItem>,
    claimed_by_others: &HashSet<String>,
) -> Vec<String> {
    let mut want: HashSet<String> = HashSet::new();

    let dir = rel_parent(dll_rel);
    let dll_name = rel_file_name(dll_rel);
    let id = dll_name.rsplit_once('.').map(|(s, _)| s).unwrap_or(dll_name);
    let siblings: Vec<String> = side_files
        .iter()
        .filter(|f| rel_parent(f).eq_ignore_ascii_case(dir))
        .map(|f| rel_file_name(f).to_string())
        .collect();
    let mut stems = super::dll_stems_of(&siblings);
    stems.push(id.to_string());
    for f in side_files {
        if rel_parent(f).eq_ignore_ascii_case(dir)
            && super::is_extra_file_of(rel_file_name(f), id, dll_name, &stems)
        {
            want.insert(f.to_lowercase());
        }
    }

    let manifest_hit = entry.filter(|e| e.dll_rel.eq_ignore_ascii_case(dll_rel));
    if let Some(e) = manifest_hit {
        want.extend(e.files.keys().map(|f| f.to_lowercase()));
    } else {
        if let Some(w) = ws_item.filter(|w| w.dll_rel.eq_ignore_ascii_case(dll_rel)) {
            want.extend(w.extra_files.iter().map(|f| f.to_lowercase()));
        }
        if let Some((top, _)) = dll_rel.split_once('/') {
            let prefix = format!("{}/", top.to_lowercase());
            let foreign_dll = side_files.iter().any(|f| {
                let l = f.to_lowercase();
                l.starts_with(&prefix)
                    && is_dll_rel(f)
                    && !f.eq_ignore_ascii_case(dll_rel)
                    && !want.contains(&l)
            });
            if !foreign_dll {
                want.extend(
                    side_files
                        .iter()
                        .map(|f| f.to_lowercase())
                        .filter(|l| l.starts_with(&prefix)),
                );
            }
        }
    }

    side_files
        .iter()
        .filter(|f| {
            let l = f.to_lowercase();
            f.eq_ignore_ascii_case(dll_rel) || (want.contains(&l) && !claimed_by_others.contains(&l))
        })
        .cloned()
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::BTreeMap;

    fn st(list: &[&str]) -> Vec<String> {
        list.iter().map(|s| s.to_string()).collect()
    }
    fn wi(dll_rel: &str, extras: &[&str]) -> WorkshopItem {
        WorkshopItem {
            item_id: "1".into(),
            dll_name: rel_file_name(dll_rel).into(),
            dll_rel: dll_rel.into(),
            version: None,
            hash: String::new(),
            mtime: 0,
            extra_files: st(extras),
        }
    }
    fn none() -> HashSet<String> {
        HashSet::new()
    }

    #[test]
    fn rel_join_rejects_untrusted_segments() {
        let base = Path::new("root");
        assert!(rel_join(base, "a/b.png").is_ok());
        assert!(rel_join(base, "../x").is_err());
        assert!(rel_join(base, "a//b").is_err());
        assert!(rel_join(base, "a\\b").is_err());
        assert!(rel_join(base, "").is_err());
        assert!(rel_join(base, "C:/x").is_err());
    }

    #[test]
    fn main_dll_prefers_shallowest_then_alphabetical() {
        let f = st(&["lib/Aaa.dll", "Zed.dll", "Bee.dll", "x.png"]);
        assert_eq!(pick_main_dll(&f).unwrap(), "Bee.dll");
        let nested = st(&["Pack/sub/A.dll", "Pack/B.dll"]);
        assert_eq!(pick_main_dll(&nested).unwrap(), "Pack/B.dll");
        assert!(pick_main_dll(&st(&["a.png"])).is_none());
    }

    #[test]
    fn owned_uses_source_list_including_subfolders_and_secondary_dlls() {
        let side = st(&["Mod.dll", "Helper.dll", "Hunting/a.png", "readme.txt", "Other.dll", "Other_data.csv"]);
        let w = wi("Mod.dll", &["Helper.dll", "hunting/A.PNG", "readme.txt"]);
        let got = owned_rels(&side, "Mod.dll", None, Some(&w), &none());
        assert_eq!(got, st(&["Mod.dll", "Helper.dll", "Hunting/a.png", "readme.txt"]));
    }

    #[test]
    fn owned_falls_back_to_prefix_when_unsubscribed() {
        let side = st(&["Mod.dll", "Mod_items.csv", "readme.txt", "ModPack.cfg"]);
        let got = owned_rels(&side, "Mod.dll", None, None, &none());
        assert_eq!(got, st(&["Mod.dll", "Mod_items.csv"]));
    }

    #[test]
    fn owned_respects_longest_stem_ownership() {
        let side = st(&["Mod.dll", "Mod_Plus.dll", "Mod_Plus_data.csv"]);
        assert_eq!(owned_rels(&side, "Mod.dll", None, None, &none()), st(&["Mod.dll"]));
        assert_eq!(
            owned_rels(&side, "Mod_Plus.dll", None, None, &none()),
            st(&["Mod_Plus.dll", "Mod_Plus_data.csv"])
        );
    }

    #[test]
    fn owned_with_manifest_is_manifest_plus_runtime_prefix_files() {
        let side = st(&["Mod.dll", "Mod_items.csv", "Art/x.png", "readme.txt", "Art/other.png"]);
        let mut files = BTreeMap::new();
        files.insert("Mod.dll".to_string(), "h".to_string());
        files.insert("Art/x.png".to_string(), "h".to_string());
        let e = ManifestEntry { item_id: None, dll_rel: "Mod.dll".into(), files };
        let w = wi("Mod.dll", &["readme.txt"]);
        let got = owned_rels(&side, "Mod.dll", Some(&e), Some(&w), &none());
        assert_eq!(got, st(&["Mod.dll", "Mod_items.csv", "Art/x.png"]));
    }

    #[test]
    fn owned_never_takes_files_claimed_by_another_installed_mod() {
        let side = st(&["Mod.dll", "Shared.dll"]);
        let w = wi("Mod.dll", &["Shared.dll"]);
        let mut others = HashSet::new();
        others.insert("shared.dll".to_string());
        assert_eq!(owned_rels(&side, "Mod.dll", None, Some(&w), &others), st(&["Mod.dll"]));
    }

    #[test]
    fn owned_takes_whole_exclusive_folder_for_manual_layout() {
        let side = st(&["Sup/Sup.dll", "Sup/Hunting/a.wav", "Sup/icon.png", "Root.dll"]);
        let got = owned_rels(&side, "Sup/Sup.dll", None, None, &none());
        assert_eq!(got, st(&["Sup/Sup.dll", "Sup/Hunting/a.wav", "Sup/icon.png"]));
    }

    #[test]
    fn owned_does_not_take_folder_shared_with_another_dll() {
        let side = st(&["Pack/A.dll", "Pack/B.dll", "Pack/A_data.csv", "Pack/readme.txt"]);
        let got = owned_rels(&side, "Pack/A.dll", None, None, &none());
        assert_eq!(got, st(&["Pack/A.dll", "Pack/A_data.csv"]));
    }

    #[test]
    fn walk_and_prune_roundtrip() {
        let tmp = tempfile::tempdir().unwrap();
        let root = tmp.path();
        std::fs::create_dir_all(root.join("A/B")).unwrap();
        std::fs::write(root.join("A/B/x.png"), b"x").unwrap();
        std::fs::write(root.join("A/keep.txt"), b"k").unwrap();
        std::fs::write(root.join("top.dll"), b"d").unwrap();
        assert_eq!(walk_files(root), st(&["A/B/x.png", "A/keep.txt", "top.dll"]));

        std::fs::remove_file(root.join("A/B/x.png")).unwrap();
        prune_empty_dirs(root, &st(&["A/B/x.png"]));
        assert!(!root.join("A/B").exists(), "emptied directory should be pruned");
        assert!(root.join("A/keep.txt").exists(), "non-empty parent must stay");
    }
}
