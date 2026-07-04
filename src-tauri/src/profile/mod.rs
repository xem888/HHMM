pub mod apply;
pub mod snapshot;

use crate::mods::FailedItem;
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

#[derive(Serialize, Deserialize, Clone, Debug, Default)]
#[serde(rename_all = "camelCase")]
pub struct ApplyResult {
    pub applied: Vec<String>,
    pub failed: Vec<FailedItem>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ProfileMod {
    pub id: String,
    pub dll_name: String,
    pub item_id: Option<String>,
    pub enabled: bool,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Profile {
    pub id: String,
    pub name: String,
    pub cfgs: BTreeMap<String, String>,
    #[serde(default)]
    pub mods: Vec<ProfileMod>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ProfileMeta {
    pub id: String,
    pub name: String,
    pub mod_count: usize,
    pub enabled_count: usize,
}

pub const BACKUP_ID: &str = "~backup";
pub const BACKUP_NAME: &str = "__backup__";

pub fn sanitize_id(name: &str) -> String {
    let s: String = name
        .chars()
        .map(|c| {
            if c.is_alphanumeric() || c == '-' || c == '_' {
                c
            } else {
                '_'
            }
        })
        .collect();
    let trimmed = s.trim_matches('_');
    if trimmed.is_empty() {
        return "profile".to_string();
    }
    let upper = trimmed.to_ascii_uppercase();
    let reserved = matches!(
        upper.as_str(),
        "CON" | "PRN" | "AUX" | "NUL"
            | "COM1" | "COM2" | "COM3" | "COM4" | "COM5" | "COM6" | "COM7" | "COM8" | "COM9"
            | "LPT1" | "LPT2" | "LPT3" | "LPT4" | "LPT5" | "LPT6" | "LPT7" | "LPT8" | "LPT9"
    );
    if reserved {
        format!("p_{}", trimmed)
    } else {
        trimmed.to_string()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn sanitize_replaces_illegal_chars() {
        assert_eq!(sanitize_id("My Profile!"), "My_Profile");
        assert_eq!(sanitize_id("a/b\\c:d"), "a_b_c_d");
        assert_eq!(sanitize_id("..\\..\\evil"), "evil");
    }

    #[test]
    fn sanitize_keeps_unicode_alnum() {
        assert_eq!(sanitize_id("存档1"), "存档1");
        assert_eq!(sanitize_id("test-2_ok"), "test-2_ok");
    }

    #[test]
    fn sanitize_empty_falls_back() {
        assert_eq!(sanitize_id(""), "profile");
        assert_eq!(sanitize_id("!!!"), "profile");
        assert_eq!(sanitize_id("___"), "profile");
    }

    #[test]
    fn sanitize_avoids_windows_reserved_device_names() {
        assert_eq!(sanitize_id("con"), "p_con");
        assert_eq!(sanitize_id("CON"), "p_CON");
        assert_eq!(sanitize_id("Nul"), "p_Nul");
        assert_eq!(sanitize_id("com1"), "p_com1");
        assert_eq!(sanitize_id("console"), "console");
        assert_eq!(sanitize_id("com10"), "com10");
    }

    #[test]
    fn backup_id_is_unreachable_from_user_names() {
        assert_ne!(sanitize_id(BACKUP_ID), BACKUP_ID);
        assert_ne!(sanitize_id("~backup"), BACKUP_ID);
        assert_ne!(sanitize_id("backup"), BACKUP_ID);
        assert_ne!(sanitize_id(BACKUP_NAME), BACKUP_ID);
    }

    #[test]
    fn old_profile_without_mods_field_deserializes() {
        let legacy = r#"{"id":"p1","name":"P1","cfgs":{"a.cfg":"[X]\nk = 1\n"}}"#;
        let p: Profile = serde_json::from_str(legacy).unwrap();
        assert!(p.mods.is_empty(), "legacy profile mods should degrade to empty");
        assert_eq!(p.cfgs.len(), 1);
    }

    #[test]
    fn profile_roundtrips_with_mods() {
        let p = Profile {
            id: "p1".into(),
            name: "P1".into(),
            cfgs: [("a.cfg".to_string(), "content".to_string())].into(),
            mods: vec![ProfileMod {
                id: "m1".into(),
                dll_name: "M.dll".into(),
                item_id: Some("123".into()),
                enabled: true,
            }],
        };
        let json = serde_json::to_string(&p).unwrap();
        assert!(json.contains("\"dllName\""), "should serialize as camelCase: {}", json);
        assert!(json.contains("\"itemId\""));
        let back: Profile = serde_json::from_str(&json).unwrap();
        assert_eq!(back.mods.len(), 1);
        assert_eq!(back.mods[0].dll_name, "M.dll");
        assert_eq!(back.mods[0].item_id.as_deref(), Some("123"));
    }
}
