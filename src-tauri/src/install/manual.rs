use crate::error::{AppError, AppResult};
use crate::fsx;
use crate::mods::{self, sync, tree};
use crate::paths::GamePaths;
use std::path::{Path, PathBuf};

const MAX_ZIP_ENTRIES: usize = 5000;
const MAX_ZIP_TOTAL_BYTES: u64 = 1 << 30;

pub fn install_from_path(gp: &GamePaths, src: &Path) -> AppResult<Vec<String>> {
    match src.extension().and_then(|s| s.to_str()).map(|s| s.to_lowercase()) {
        Some(ext) if ext == "dll" => install_single_dll(gp, src),
        Some(ext) if ext == "zip" => install_zip(gp, src),
        _ => Err(AppError::Other(
            "unsupported file (need .dll or .zip)".into(),
        )),
    }
}

fn install_single_dll(gp: &GamePaths, src: &Path) -> AppResult<Vec<String>> {
    let name = src
        .file_name()
        .ok_or_else(|| AppError::Other("invalid file name".into()))?
        .to_string_lossy()
        .to_string();
    let to_disabled = mods::resolve_install_side(gp, &name, false);
    let dst_dir = if to_disabled { gp.disabled() } else { gp.plugins() };
    std::fs::create_dir_all(&dst_dir)?;
    let rel = mods::find_dll_ci(&dst_dir, &name).unwrap_or_else(|| name.clone());
    fsx::copy_file(src, &tree::rel_join(&dst_dir, &rel)?)?;
    mods::cleanup_other_side(gp, &tree::Ctx::load(gp), &name, to_disabled);
    Ok(vec![name])
}

struct Staging(PathBuf);
impl Drop for Staging {
    fn drop(&mut self) {
        let _ = std::fs::remove_dir_all(&self.0);
    }
}

fn install_zip(gp: &GamePaths, zip_path: &Path) -> AppResult<Vec<String>> {
    let file = std::fs::File::open(zip_path)?;
    let mut zip = zip::ZipArchive::new(file)
        .map_err(|e| AppError::Other(format!("zip open: {}", e)))?;
    if zip.len() > MAX_ZIP_ENTRIES {
        return Err(AppError::Other(format!(
            "zip has too many entries ({} > {})",
            zip.len(),
            MAX_ZIP_ENTRIES
        )));
    }

    let mut names: Vec<(usize, String)> = Vec::new();
    let mut total: u64 = 0;
    for i in 0..zip.len() {
        let f = zip
            .by_index(i)
            .map_err(|e| AppError::Other(format!("zip entry: {}", e)))?;
        if f.is_dir() {
            continue;
        }
        total = total.saturating_add(f.size());
        let name = f.name().replace('\\', "/");
        names.push((i, name.trim_start_matches('/').to_string()));
    }
    if total > MAX_ZIP_TOTAL_BYTES {
        return Err(AppError::Other(format!(
            "zip is too large when extracted ({} MB > {} MB)",
            total >> 20,
            MAX_ZIP_TOTAL_BYTES >> 20
        )));
    }

    let root = zip_root(&names.iter().map(|(_, n)| n.clone()).collect::<Vec<_>>());
    let mut rels: Vec<(usize, String)> = Vec::new();
    let mut seen = std::collections::HashSet::new();
    for (i, name) in names {
        let Some(rel) = strip_prefix_ci(&name, &root) else {
            continue;
        };
        tree::rel_join(Path::new("staging"), rel)?;
        if !seen.insert(rel.to_lowercase()) {
            return Err(AppError::Other(format!(
                "zip contains two entries that differ only by case: '{}'",
                rel
            )));
        }
        rels.push((i, rel.to_string()));
    }
    let files: Vec<String> = rels.iter().map(|(_, r)| r.clone()).collect();
    let Some(dll_rel) = tree::pick_main_dll(&files).cloned() else {
        return Err(AppError::Other(
            "no .dll found in zip (nothing was installed)".into(),
        ));
    };

    let staging = Staging(
        gp.bepinex()
            .join("HHMM")
            .join(format!("staging-{}", std::process::id())),
    );
    let _ = std::fs::remove_dir_all(&staging.0);
    let mut budget = MAX_ZIP_TOTAL_BYTES;
    for (i, rel) in &rels {
        let mut f = zip
            .by_index(*i)
            .map_err(|e| AppError::Other(format!("zip entry: {}", e)))?;
        let dest = tree::rel_join(&staging.0, rel)?;
        if let Some(parent) = dest.parent() {
            std::fs::create_dir_all(parent)?;
        }
        let mut out = std::fs::File::create(&dest)?;
        let written = std::io::copy(&mut std::io::Read::take(&mut f, budget + 1), &mut out)?;
        if written > budget {
            return Err(AppError::Other(
                "zip is larger than its headers claim (nothing was installed)".into(),
            ));
        }
        budget -= written;
    }

    let extra_files: Vec<String> = files.iter().filter(|f| **f != dll_rel).cloned().collect();
    let mut ctx = tree::Ctx::load(gp);
    sync::install_tree(
        gp,
        &mut ctx,
        &sync::TreeSource {
            dir: &staging.0,
            dll_rel: &dll_rel,
            extra_files: &extra_files,
            item_id: None,
        },
        false,
    )?;
    Ok(files
        .iter()
        .filter(|f| tree::is_dll_rel(f))
        .map(|f| tree::rel_file_name(f).to_string())
        .collect())
}

fn zip_root(names: &[String]) -> String {
    const MARK: &str = "bepinex/plugins/";
    for n in names {
        let l = n.to_lowercase();
        let mut from = 0;
        while let Some(pos) = l[from..].find(MARK) {
            let at = from + pos;
            if at == 0 || l.as_bytes()[at - 1] == b'/' {
                return n[..at + MARK.len()].to_string();
            }
            from = at + 1;
        }
    }
    match tree::pick_main_dll(names) {
        Some(dll) => match tree::rel_parent(dll) {
            "" => String::new(),
            p => format!("{}/", p),
        },
        None => String::new(),
    }
}

fn strip_prefix_ci<'a>(name: &'a str, root: &str) -> Option<&'a str> {
    if root.is_empty() {
        return Some(name);
    }
    let head = name.get(..root.len())?;
    head.eq_ignore_ascii_case(root).then(|| &name[root.len()..])
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Write;

    fn st(list: &[&str]) -> Vec<String> {
        list.iter().map(|s| s.to_string()).collect()
    }

    #[test]
    fn zip_root_detection() {
        assert_eq!(zip_root(&st(&["Mod.dll", "Art/a.png"])), "");
        assert_eq!(zip_root(&st(&["Wrap/Mod.dll", "Wrap/Art/a.png", "readme.txt"])), "Wrap/");
        assert_eq!(
            zip_root(&st(&["Pack/BepInEx/plugins/Mod.dll", "Pack/BepInEx/config/x.cfg"])),
            "Pack/BepInEx/plugins/"
        );
        assert_eq!(zip_root(&st(&["MyBepInEx/plugins/Mod.dll"])), "MyBepInEx/plugins/");
    }

    fn make_zip(path: &Path, entries: &[(&str, &str)]) {
        let mut w = zip::ZipWriter::new(std::fs::File::create(path).unwrap());
        let opts = zip::write::SimpleFileOptions::default()
            .compression_method(zip::CompressionMethod::Stored);
        for (name, body) in entries {
            w.start_file(*name, opts).unwrap();
            w.write_all(body.as_bytes()).unwrap();
        }
        w.finish().unwrap();
    }

    fn temp_gp() -> (tempfile::TempDir, GamePaths) {
        let tmp = tempfile::tempdir().unwrap();
        let gp = GamePaths::new(tmp.path().join("steamapps").join("common").join("Human Host"));
        std::fs::create_dir_all(gp.plugins()).unwrap();
        std::fs::create_dir_all(gp.disabled()).unwrap();
        (tmp, gp)
    }

    #[test]
    fn zip_keeps_folder_structure_and_same_named_files() {
        let (tmp, gp) = temp_gp();
        let z = tmp.path().join("sup.zip");
        make_zip(
            &z,
            &[
                ("Sup/Sup.dll", "dll"),
                ("Sup/Hunting/pistol.wav", "h"),
                ("Sup/Military/pistol.wav", "m"),
                ("readme.txt", "outside the root"),
            ],
        );
        let dlls = install_from_path(&gp, &z).unwrap();
        assert_eq!(dlls, st(&["Sup.dll"]));
        assert_eq!(
            tree::walk_files(&gp.plugins()),
            st(&["Hunting/pistol.wav", "Military/pistol.wav", "Sup.dll"])
        );
        assert!(!gp.bepinex().join("HHMM").join(format!("staging-{}", std::process::id())).exists());

        mods::toggle::toggle(&gp, "Sup", false).unwrap();
        assert!(tree::walk_files(&gp.plugins()).is_empty());
        mods::sync::uninstall_one(&gp, "Sup").unwrap();
        assert!(tree::walk_files(&gp.disabled()).is_empty());
    }

    #[test]
    fn zip_without_dll_or_with_traversal_writes_nothing() {
        let (tmp, gp) = temp_gp();
        let z = tmp.path().join("bad.zip");
        make_zip(&z, &[("textures/a.png", "x")]);
        assert!(install_from_path(&gp, &z).is_err());
        make_zip(&z, &[("Mod.dll", "d"), ("../evil.txt", "x")]);
        assert!(install_from_path(&gp, &z).is_err());
        assert!(tree::walk_files(&gp.plugins()).is_empty(), "nothing may be written when validation fails");
        assert!(!tmp.path().join("evil.txt").exists());
    }

    #[test]
    fn single_dll_replaces_in_place_and_keeps_the_manifest() {
        let (tmp, gp) = temp_gp();
        let z = tmp.path().join("m.zip");
        make_zip(&z, &[("Mod.dll", "v1"), ("Art/a.png", "png")]);
        install_from_path(&gp, &z).unwrap();

        let dev = tmp.path().join("Mod.dll");
        std::fs::write(&dev, "v2-dev-build").unwrap();
        install_from_path(&gp, &dev).unwrap();
        assert_eq!(std::fs::read_to_string(gp.plugins().join("Mod.dll")).unwrap(), "v2-dev-build");
        assert!(gp.plugins().join("Art").join("a.png").is_file(), "dropping a new dll must not wipe the assets");
        assert_eq!(mods::manifest::load(&gp).mods["mod.dll"].files.len(), 2);
    }
}
