use crate::error::{AppError, AppResult};
use crate::fsx;
use crate::paths::GamePaths;
use std::path::Path;

pub fn toggle(gp: &GamePaths, mod_id: &str, enable: bool) -> AppResult<()> {
    let plugins = gp.plugins();
    let disabled = gp.disabled();
    let dll = format!("{}.dll", mod_id);
    crate::paths::resolve_within(&plugins, &[&dll])?;

    let (from_dir, to_dir) = if enable {
        (&disabled, &plugins)
    } else {
        (&plugins, &disabled)
    };

    let from_dll = from_dir.join(&dll);
    if !from_dll.exists() {
        if to_dir.join(&dll).exists() {
            return Ok(());
        }
        return Err(AppError::NotFound(format!("{} not found", dll)));
    }

    let source_extras: Option<Vec<String>> = super::workshop::scan_workshop(gp)
        .into_iter()
        .find(|w| w.dll_name.eq_ignore_ascii_case(&dll))
        .map(|w| w.extra_files);

    std::fs::create_dir_all(to_dir)?;
    move_with_extras(from_dir, to_dir, mod_id, &dll, source_extras.as_deref())?;
    Ok(())
}

fn should_move_on_toggle(
    name: &str,
    id: &str,
    dll: &str,
    source_extras: Option<&[String]>,
    all_dll_stems: &[String],
) -> bool {
    if super::is_extra_file_of(name, id, dll, all_dll_stems) {
        return true;
    }
    if name.to_ascii_lowercase().ends_with(".dll") {
        return false;
    }
    source_extras
        .map(|list| list.iter().any(|s| s.eq_ignore_ascii_case(name)))
        .unwrap_or(false)
}

fn move_with_extras(
    from: &Path,
    to: &Path,
    id: &str,
    dll: &str,
    source_extras: Option<&[String]>,
) -> AppResult<()> {
    fsx::move_file(&from.join(dll), &to.join(dll))?;

    if let Ok(rd) = std::fs::read_dir(from) {
        let all_names: Vec<String> = rd
            .flatten()
            .filter(|e| e.path().is_file())
            .map(|e| e.file_name().to_string_lossy().to_string())
            .collect();
        let mut stems = super::dll_stems_of(&all_names);
        stems.push(id.to_string());
        let names: Vec<String> = all_names
            .into_iter()
            .filter(|n| should_move_on_toggle(n, id, dll, source_extras, &stems))
            .collect();
        for n in names {
            if let Err(e) = fsx::move_file(&from.join(&n), &to.join(&n)) {
                log::warn!("toggle: extra file '{}' move failed: {}", n, e);
            }
        }
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::should_move_on_toggle;

    fn stems(list: &[&str]) -> Vec<String> {
        list.iter().map(|s| s.to_string()).collect()
    }

    #[test]
    fn toggle_moves_prefix_and_source_listed_files() {
        let st = stems(&["Mod"]);
        assert!(should_move_on_toggle("Mod_items.csv", "Mod", "Mod.dll", None, &st));
        let src = vec!["data.json".to_string(), "readme.txt".to_string()];
        assert!(should_move_on_toggle("data.json", "Mod", "Mod.dll", Some(&src), &st));
        assert!(should_move_on_toggle("Readme.TXT", "Mod", "Mod.dll", Some(&src), &st));
    }

    #[test]
    fn toggle_never_moves_other_dlls_or_unrelated() {
        let st = stems(&["Mod"]);
        let src = vec!["Helper.dll".to_string()];
        assert!(!should_move_on_toggle("Helper.dll", "Mod", "Mod.dll", Some(&src), &st));
        assert!(!should_move_on_toggle("other.txt", "Mod", "Mod.dll", Some(&src), &st));
        assert!(!should_move_on_toggle("readme.txt", "Mod", "Mod.dll", None, &st));
    }

    #[test]
    fn toggle_respects_longest_stem_ownership() {
        let st = stems(&["Mod", "Mod_Plus"]);
        assert!(!should_move_on_toggle("Mod_Plus_data.csv", "Mod", "Mod.dll", None, &st));
        assert!(should_move_on_toggle(
            "Mod_Plus_data.csv",
            "Mod_Plus",
            "Mod_Plus.dll",
            None,
            &st
        ));
    }
}
