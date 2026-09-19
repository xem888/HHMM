use super::tree;
use crate::error::{AppError, AppResult};
use crate::fsx;
use crate::paths::GamePaths;

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

    let ctx = tree::Ctx::load(gp);
    let from_files = tree::walk_files(from_dir);
    let mut owned = ctx.owned_by_name(&from_files, &dll);
    if owned.is_empty() {
        if tree::find_dll_rel(&tree::walk_files(to_dir), &dll).is_some() {
            return Ok(());
        }
        return Err(AppError::NotFound(format!("{} not found", dll)));
    }

    owned.sort_by_key(|rel| !tree::rel_file_name(rel).eq_ignore_ascii_case(&dll));
    std::fs::create_dir_all(to_dir)?;
    let mut stuck: Vec<String> = Vec::new();
    for rel in &owned {
        let from = tree::rel_join(from_dir, rel)?;
        let to = tree::rel_join(to_dir, rel)?;
        if let Err(e) = fsx::move_file(&from, &to) {
            if tree::rel_file_name(rel).eq_ignore_ascii_case(&dll) {
                return Err(e);
            }
            log::warn!("toggle: file '{}' move failed: {}", rel, e);
            stuck.push(rel.clone());
        }
    }
    tree::prune_empty_dirs(from_dir, &owned);

    if !stuck.is_empty() {
        return Err(AppError::Other(format!(
            "{} file(s) could not be moved (in use?): {}",
            stuck.len(),
            stuck.join(", ")
        )));
    }
    Ok(())
}
