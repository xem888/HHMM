
use crate::error::AppResult;
use crate::fsx;
use crate::paths::GamePaths;
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

pub const FORMAT: u32 = 1;

#[derive(Serialize, Deserialize, Clone, Debug, Default, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ManifestEntry {
    pub item_id: Option<String>,
    pub dll_rel: String,
    pub files: BTreeMap<String, String>,
}

#[derive(Serialize, Deserialize, Clone, Debug, Default)]
pub struct Manifest {
    #[serde(default)]
    pub format: u32,
    #[serde(default)]
    pub mods: BTreeMap<String, ManifestEntry>,
}

pub fn load(gp: &GamePaths) -> Manifest {
    let path = gp.manifest();
    let Ok(raw) = std::fs::read_to_string(&path) else {
        return Manifest::default();
    };
    match serde_json::from_str::<Manifest>(&raw) {
        Ok(m) => m,
        Err(e) => {
            log::warn!("install manifest unreadable, falling back to heuristics: {}", e);
            Manifest::default()
        }
    }
}

pub fn save(gp: &GamePaths, manifest: &Manifest) -> AppResult<()> {
    let mut m = manifest.clone();
    m.format = FORMAT;
    let json = serde_json::to_vec_pretty(&m).map_err(|e| crate::error::AppError::Parse(e.to_string()))?;
    fsx::atomic_write(&gp.manifest(), &json)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn roundtrip_and_corrupt_fallback() {
        let tmp = tempfile::tempdir().unwrap();
        let gp = GamePaths::new(tmp.path());
        assert!(load(&gp).mods.is_empty());

        let mut m = Manifest::default();
        let mut files = BTreeMap::new();
        files.insert("Hunting/a.png".to_string(), "abc".to_string());
        m.mods.insert(
            "mod.dll".into(),
            ManifestEntry { item_id: Some("42".into()), dll_rel: "Mod.dll".into(), files },
        );
        save(&gp, &m).unwrap();
        let back = load(&gp);
        assert_eq!(back.format, FORMAT);
        assert_eq!(back.mods["mod.dll"], m.mods["mod.dll"]);

        std::fs::write(gp.manifest(), b"{ not json").unwrap();
        assert!(load(&gp).mods.is_empty(), "a corrupt manifest should degrade to empty instead of failing");
    }
}
