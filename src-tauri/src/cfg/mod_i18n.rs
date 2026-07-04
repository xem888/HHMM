use crate::paths::GamePaths;
use std::collections::HashMap;
use std::path::Path;

pub type ModCfgI18n = HashMap<String, HashMap<String, HashMap<String, String>>>;

pub fn scan(gp: &GamePaths) -> ModCfgI18n {
    let mut out: ModCfgI18n = HashMap::new();
    for dir in [gp.plugins(), gp.disabled()] {
        scan_dir(&dir, &mut out);
    }
    out
}

fn scan_dir(dir: &Path, out: &mut ModCfgI18n) {
    let Ok(rd) = std::fs::read_dir(dir) else {
        return;
    };
    for e in rd.flatten() {
        let p = e.path();
        let name = e.file_name().to_string_lossy().to_lowercase();
        if !name.ends_with(".hhmm-i18n.json") || !p.is_file() {
            continue;
        }
        match read_one(&p) {
            Some((file, entries)) => {
                let slot = out.entry(file).or_default();
                for (k, langs) in entries {
                    slot.entry(k).or_insert(langs);
                }
            }
            None => log::warn!("mod i18n file ignored (bad format): {}", p.display()),
        }
    }
}

fn read_one(p: &Path) -> Option<(String, HashMap<String, HashMap<String, String>>)> {
    let raw = std::fs::read_to_string(p).ok()?;
    parse(&raw)
}

fn parse(raw: &str) -> Option<(String, HashMap<String, HashMap<String, String>>)> {
    let v: serde_json::Value = serde_json::from_str(raw).ok()?;
    let file = v.get("file")?.as_str()?.trim().to_string();
    let entries_v = v.get("entries")?.as_object()?;
    let mut entries: HashMap<String, HashMap<String, String>> = HashMap::new();
    for (key, langs_v) in entries_v {
        let Some(obj) = langs_v.as_object() else {
            continue;
        };
        let mut langs = HashMap::new();
        for (lang, text) in obj {
            if let Some(s) = text.as_str() {
                langs.insert(lang.clone(), s.to_string());
            }
        }
        if !langs.is_empty() {
            entries.insert(key.clone(), langs);
        }
    }
    if file.is_empty() || entries.is_empty() {
        return None;
    }
    Some((file, entries))
}

#[cfg(test)]
mod tests {
    use super::*;

    const GOOD: &str = r#"{
        "format": 1,
        "file": "humanhost.quickdismantle.cfg",
        "entries": {
            "Hotkey": { "zh-CN": "批量拆解热键", "de": "Hotkey zum Zerlegen" },
            "RequireConfirm": { "zh-CN": "需要二次确认" }
        }
    }"#;

    #[test]
    fn parse_good_file() {
        let (file, entries) = parse(GOOD).unwrap();
        assert_eq!(file, "humanhost.quickdismantle.cfg");
        assert_eq!(entries["Hotkey"]["zh-CN"], "批量拆解热键");
        assert_eq!(entries["Hotkey"]["de"], "Hotkey zum Zerlegen");
        assert_eq!(entries["RequireConfirm"].len(), 1);
    }

    #[test]
    fn parse_rejects_bad_shapes() {
        assert!(parse("not json").is_none());
        assert!(parse(r#"{"entries":{}}"#).is_none());
        assert!(parse(r#"{"file":"a.cfg"}"#).is_none());
        assert!(parse(r#"{"file":"a.cfg","entries":{}}"#).is_none());
        assert!(parse(r#"{"file":"","entries":{"K":{"de":"x"}}}"#).is_none());
        assert!(parse(r#"{"file":"a.cfg","entries":{"K":{"de":5}}}"#).is_none());
    }

    #[test]
    fn scan_merges_and_skips_broken() {
        let dir = tempfile::tempdir().unwrap();
        let plugins = dir.path().join("plugins");
        std::fs::create_dir_all(&plugins).unwrap();
        std::fs::write(plugins.join("QuickDismantle.hhmm-i18n.json"), GOOD).unwrap();
        std::fs::write(plugins.join("Broken.hhmm-i18n.json"), "{oops").unwrap();
        std::fs::write(plugins.join("Other.dll"), "binary").unwrap();

        let mut out = ModCfgI18n::new();
        scan_dir(&plugins, &mut out);
        assert_eq!(out.len(), 1);
        assert_eq!(
            out["humanhost.quickdismantle.cfg"]["Hotkey"]["zh-CN"],
            "批量拆解热键"
        );
    }
}
