use crate::error::{AppError, AppResult};
use crate::fsx;
use crate::mods;
use crate::paths::{validate_within, GamePaths};
use std::io::Read;
use std::path::Path;

pub fn install_from_path(gp: &GamePaths, src: &Path) -> AppResult<Vec<String>> {
    match src.extension().and_then(|s| s.to_str()).map(|s| s.to_lowercase()) {
        Some(ext) if ext == "dll" => {
            let name = src
                .file_name()
                .ok_or_else(|| AppError::Other("invalid file name".into()))?
                .to_string_lossy()
                .to_string();
            let to_disabled = mods::resolve_install_side(gp, &name, false);
            let dst_dir = if to_disabled { gp.disabled() } else { gp.plugins() };
            std::fs::create_dir_all(&dst_dir)?;
            fsx::copy_file(src, &dst_dir.join(&name))?;
            mods::cleanup_other_side(gp, &name, to_disabled);
            Ok(vec![name])
        }
        Some(ext) if ext == "zip" => extract_dlls_from_zip(src, gp),
        _ => Err(AppError::Other(
            "unsupported file (need .dll or .zip)".into(),
        )),
    }
}

fn extract_dlls_from_zip(zip_path: &Path, gp: &GamePaths) -> AppResult<Vec<String>> {
    let file = std::fs::File::open(zip_path)?;
    let mut zip = zip::ZipArchive::new(file)
        .map_err(|e| AppError::Other(format!("zip open: {}", e)))?;

    {
        let mut seen: std::collections::HashMap<String, String> = std::collections::HashMap::new();
        for name in zip.file_names() {
            if name.ends_with('/') {
                continue;
            }
            let Some(base) = Path::new(name).file_name() else {
                continue;
            };
            let key = base.to_string_lossy().to_lowercase();
            if let Some(prev) = seen.insert(key, name.to_string()) {
                return Err(AppError::Other(format!(
                    "zip contains duplicate file name '{}' in different folders ('{}' and '{}') — install the right one manually",
                    base.to_string_lossy(),
                    prev,
                    name
                )));
            }
        }
    }

    let mut entries: Vec<(String, Vec<u8>)> = Vec::new();
    for i in 0..zip.len() {
        let mut f = zip
            .by_index(i)
            .map_err(|e| AppError::Other(format!("zip entry: {}", e)))?;
        if f.is_dir() {
            continue;
        }
        let entry_name = f.name().to_string();
        let Some(base) = Path::new(&entry_name)
            .file_name()
            .map(|s| s.to_string_lossy().to_string())
        else {
            continue;
        };
        let mut buf = Vec::new();
        f.read_to_end(&mut buf)?;
        entries.push((base, buf));
    }

    let dll_names: Vec<String> = entries
        .iter()
        .filter(|(n, _)| mods::is_dll_path(Path::new(n)))
        .map(|(n, _)| n.clone())
        .collect();
    if dll_names.is_empty() {
        return Err(AppError::Other(
            "no .dll found in zip (nothing was installed)".into(),
        ));
    }

    let side: std::collections::HashMap<String, bool> = dll_names
        .iter()
        .map(|d| (d.to_lowercase(), mods::resolve_install_side(gp, d, false)))
        .collect();
    let mut sorted_dlls = dll_names.clone();
    sorted_dlls.sort_by_key(|n| n.to_lowercase());
    let main_side = side[&sorted_dlls[0].to_lowercase()];

    for (base, buf) in &entries {
        let to_disabled = if mods::is_dll_path(Path::new(base)) {
            side[&base.to_lowercase()]
        } else {
            let mut owner: Option<(&String, usize)> = None;
            for d in &dll_names {
                let stem = d.rsplit_once('.').map(|(s, _)| s).unwrap_or(d);
                if mods::is_extra_file(base, stem, d)
                    && owner.map(|(_, l)| stem.len() > l).unwrap_or(true)
                {
                    owner = Some((d, stem.len()));
                }
            }
            owner
                .map(|(d, _)| side[&d.to_lowercase()])
                .unwrap_or(main_side)
        };
        let dir = if to_disabled { gp.disabled() } else { gp.plugins() };
        std::fs::create_dir_all(&dir)?;
        let dest = validate_within(&dir, &dir.join(base))?;
        std::fs::write(&dest, buf)?;
    }

    for d in &dll_names {
        mods::cleanup_other_side(gp, d, side[&d.to_lowercase()]);
    }
    Ok(dll_names)
}
