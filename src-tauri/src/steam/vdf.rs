use crate::error::AppResult;
use std::path::{Path, PathBuf};

pub fn library_steamapps_dirs(steam_path: &Path) -> AppResult<Vec<PathBuf>> {
    let default_sa = steam_path.join("steamapps");
    let mut dirs = vec![default_sa.clone()];

    let vdf = default_sa.join("libraryfolders.vdf");
    if let Ok(content) = std::fs::read_to_string(&vdf) {
        for line in content.lines() {
            let line = line.trim();
            if let Some(rest) = line.strip_prefix("\"path\"") {
                if let Some(p) = extract_quoted(rest) {
                    let sa = PathBuf::from(p).join("steamapps");
                    if !dirs.contains(&sa) {
                        dirs.push(sa);
                    }
                }
            }
        }
    }
    Ok(dirs)
}

pub fn installdir_from_manifest(steamapps: &Path, app_id: &str) -> Option<String> {
    let manifest = steamapps.join(format!("appmanifest_{app_id}.acf"));
    let content = std::fs::read_to_string(&manifest).ok()?;
    for line in content.lines() {
        if let Some(rest) = line.trim().strip_prefix("\"installdir\"") {
            return extract_quoted(rest);
        }
    }
    None
}

fn extract_quoted(s: &str) -> Option<String> {
    let start = s.find('"')?;
    let rest = &s[start + 1..];
    let end = rest.find('"')?;
    Some(rest[..end].replace("\\\\", "\\"))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn extract_quoted_unescapes_backslashes() {
        assert_eq!(
            extract_quoted(r#"  "E:\\SteamLibrary""#),
            Some("E:\\SteamLibrary".to_string())
        );
    }

    #[test]
    fn extract_quoted_none_when_missing() {
        assert_eq!(extract_quoted("no quotes here"), None);
        assert_eq!(extract_quoted("\"only one"), None);
    }

    #[test]
    fn library_dirs_parses_multi_library_vdf() {
        let dir = tempfile::tempdir().unwrap();
        let steam = dir.path();
        let sa = steam.join("steamapps");
        std::fs::create_dir_all(&sa).unwrap();
        std::fs::write(
            sa.join("libraryfolders.vdf"),
            "\"libraryfolders\"\n{\n\t\"0\"\n\t{\n\t\t\"path\"\t\t\"C:\\\\Program Files (x86)\\\\Steam\"\n\t}\n\t\"1\"\n\t{\n\t\t\"path\"\t\t\"E:\\\\SteamLibrary\"\n\t}\n}\n",
        )
        .unwrap();
        let dirs = library_steamapps_dirs(steam).unwrap();
        assert_eq!(dirs[0], sa);
        assert!(dirs.contains(&PathBuf::from("C:\\Program Files (x86)\\Steam\\steamapps")));
        assert!(dirs.contains(&PathBuf::from("E:\\SteamLibrary\\steamapps")));
    }

    #[test]
    fn library_dirs_without_vdf_returns_default() {
        let dir = tempfile::tempdir().unwrap();
        let dirs = library_steamapps_dirs(dir.path()).unwrap();
        assert_eq!(dirs, vec![dir.path().join("steamapps")]);
    }

    #[test]
    fn installdir_reads_manifest() {
        let dir = tempfile::tempdir().unwrap();
        let sa = dir.path();
        std::fs::write(
            sa.join("appmanifest_2393970.acf"),
            "\"AppState\"\n{\n\t\"appid\"\t\t\"2393970\"\n\t\"name\"\t\t\"Human Host\"\n\t\"installdir\"\t\t\"Human Host\"\n}\n",
        )
        .unwrap();
        assert_eq!(
            installdir_from_manifest(sa, "2393970"),
            Some("Human Host".to_string())
        );
    }

    #[test]
    fn installdir_none_when_manifest_missing() {
        let dir = tempfile::tempdir().unwrap();
        assert_eq!(installdir_from_manifest(dir.path(), "2393970"), None);
    }
}
