use crate::error::{AppError, AppResult};
use std::path::{Component, Path, PathBuf};

pub const APP_ID: &str = "2393970";
pub const GAME_EXE: &str = "Human Host.exe";
pub const GAME_PROCESS: &str = "Human Host.exe";

#[derive(Clone, Debug)]
pub struct GamePaths {
    pub root: PathBuf,
}

impl GamePaths {
    pub fn new(root: impl Into<PathBuf>) -> Self {
        Self { root: root.into() }
    }
    pub fn winhttp(&self) -> PathBuf {
        self.root.join("winhttp.dll")
    }
    pub fn exe(&self) -> PathBuf {
        self.root.join(GAME_EXE)
    }
    pub fn bepinex(&self) -> PathBuf {
        self.root.join("BepInEx")
    }
    pub fn bepinex_core(&self) -> PathBuf {
        self.bepinex().join("core")
    }
    pub fn plugins(&self) -> PathBuf {
        self.bepinex().join("plugins")
    }
    pub fn disabled(&self) -> PathBuf {
        self.bepinex().join("disabled")
    }
    pub fn legacy_disabled(&self) -> PathBuf {
        self.plugins().join("disabled")
    }
    pub fn config(&self) -> PathBuf {
        self.bepinex().join("config")
    }
}

pub fn normalize(p: &Path) -> PathBuf {
    let mut out = PathBuf::new();
    for comp in p.components() {
        match comp {
            Component::ParentDir => {
                out.pop();
            }
            Component::CurDir => {}
            other => out.push(other.as_os_str()),
        }
    }
    out
}

pub fn validate_within(base: &Path, candidate: &Path) -> AppResult<PathBuf> {
    let base_norm = normalize(base);
    let cand_norm = normalize(candidate);
    if cand_norm.starts_with(&base_norm) {
        Ok(cand_norm)
    } else {
        Err(AppError::PathEscape(cand_norm.display().to_string()))
    }
}

pub fn resolve_within(base: &Path, segments: &[&str]) -> AppResult<PathBuf> {
    let mut p = base.to_path_buf();
    for seg in segments {
        if *seg == ".." || seg.contains('/') || seg.contains('\\') {
            return Err(AppError::PathEscape((*seg).to_string()));
        }
        p.push(seg);
    }
    validate_within(base, &p)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::Path;

    #[test]
    fn normalize_resolves_dot_and_dotdot() {
        assert_eq!(normalize(Path::new("a/b/../c")), PathBuf::from("a/c"));
        assert_eq!(normalize(Path::new("a/./b")), PathBuf::from("a/b"));
        assert_eq!(normalize(Path::new("a/b/../../d")), PathBuf::from("d"));
    }

    #[test]
    fn validate_within_allows_subpath() {
        let got = validate_within(Path::new("root"), Path::new("root/sub/x.dll")).unwrap();
        assert_eq!(got, PathBuf::from("root/sub/x.dll"));
    }

    #[test]
    fn validate_within_rejects_escape() {
        assert!(validate_within(Path::new("root"), Path::new("root/../evil")).is_err());
    }

    #[test]
    fn validate_within_rejects_sibling_prefix() {
        assert!(validate_within(Path::new("root"), Path::new("rootevil/x")).is_err());
    }

    #[test]
    fn resolve_within_joins_safe_segments() {
        let got = resolve_within(Path::new("root"), &["plugins", "Mod.dll"]).unwrap();
        assert_eq!(got, PathBuf::from("root/plugins/Mod.dll"));
    }

    #[test]
    fn resolve_within_rejects_traversal_segments() {
        assert!(resolve_within(Path::new("root"), &[".."]).is_err());
        assert!(resolve_within(Path::new("root"), &["a/b"]).is_err());
        assert!(resolve_within(Path::new("root"), &["a\\b"]).is_err());
    }

    #[test]
    fn resolve_within_allows_legal_names_containing_double_dots() {
        let got = resolve_within(Path::new("root"), &["My..Mod.dll"]).unwrap();
        assert_eq!(got, PathBuf::from("root/My..Mod.dll"));
        let got2 = resolve_within(Path::new("root"), &["com.author..plugin.cfg"]).unwrap();
        assert_eq!(got2, PathBuf::from("root/com.author..plugin.cfg"));
    }
}
