use crate::mods::tree;
use crate::paths::GamePaths;
use serde::Serialize;
use std::collections::HashMap;
use std::path::Path;

pub type Table = HashMap<String, HashMap<String, HashMap<String, String>>>;

#[derive(Serialize, Default, Debug)]
pub struct ModCfgI18n {
    pub entries: Table,
    pub labels: Table,
}

pub fn scan(gp: &GamePaths) -> ModCfgI18n {
    let mut out = ModCfgI18n::default();
    for dir in [gp.plugins(), gp.disabled()] {
        scan_dir(&dir, &mut out);
    }
    out
}

fn scan_dir(dir: &Path, out: &mut ModCfgI18n) {
    for rel in tree::walk_files(dir) {
        if !rel.to_lowercase().ends_with(".hhmm-i18n.json") {
            continue;
        }
        let Ok(p) = tree::rel_join(dir, &rel) else {
            continue;
        };
        let Ok(raw) = std::fs::read_to_string(&p) else {
            log::warn!("mod i18n file unreadable: {}", p.display());
            continue;
        };
        match parse(&raw) {
            Parsed::Ok { file, entries, labels } => {
                merge(out.entries.entry(file.clone()).or_default(), entries);
                merge(out.labels.entry(file).or_default(), labels);
            }
            Parsed::NothingForUs => log::debug!("mod i18n file has no entries/labels: {}", p.display()),
            Parsed::Bad => log::warn!("mod i18n file ignored (bad format): {}", p.display()),
        }
    }
    out.entries.retain(|_, v| !v.is_empty());
    out.labels.retain(|_, v| !v.is_empty());
}

fn merge(slot: &mut HashMap<String, HashMap<String, String>>, from: HashMap<String, HashMap<String, String>>) {
    for (k, langs) in from {
        slot.entry(k).or_insert(langs);
    }
}

#[derive(Debug)]
enum Parsed {
    Ok {
        file: String,
        entries: HashMap<String, HashMap<String, String>>,
        labels: HashMap<String, HashMap<String, String>>,
    },
    NothingForUs,
    Bad,
}

fn parse(raw: &str) -> Parsed {
    let raw = raw.strip_prefix('\u{feff}').unwrap_or(raw);
    let Ok(v) = serde_json::from_str::<serde_json::Value>(raw) else {
        return Parsed::Bad;
    };
    if v.get("format").is_some_and(|f| f.as_u64() != Some(1)) {
        return Parsed::Bad;
    }
    let entries = table_of(v.get("entries"));
    let labels = table_of(v.get("labels"));
    let file = v
        .get("file")
        .and_then(|f| f.as_str())
        .map(|s| s.trim().to_string())
        .unwrap_or_default();
    if entries.is_empty() && labels.is_empty() {
        return if v.is_object() { Parsed::NothingForUs } else { Parsed::Bad };
    }
    if file.is_empty() {
        return Parsed::Bad;
    }
    Parsed::Ok { file, entries, labels }
}

fn table_of(v: Option<&serde_json::Value>) -> HashMap<String, HashMap<String, String>> {
    let mut out = HashMap::new();
    let Some(obj) = v.and_then(|x| x.as_object()) else {
        return out;
    };
    for (key, langs_v) in obj {
        let Some(langs_obj) = langs_v.as_object() else {
            continue;
        };
        let langs: HashMap<String, String> = langs_obj
            .iter()
            .filter_map(|(lang, text)| text.as_str().map(|s| (lang.clone(), s.to_string())))
            .collect();
        if !langs.is_empty() {
            out.insert(key.clone(), langs);
        }
    }
    out
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

    fn ok(raw: &str) -> (String, HashMap<String, HashMap<String, String>>, HashMap<String, HashMap<String, String>>) {
        match parse(raw) {
            Parsed::Ok { file, entries, labels } => (file, entries, labels),
            other => panic!("expected Ok, got {:?}", other),
        }
    }

    #[test]
    fn parse_good_file() {
        let (file, entries, labels) = ok(GOOD);
        assert_eq!(file, "humanhost.quickdismantle.cfg");
        assert_eq!(entries["Hotkey"]["zh-CN"], "批量拆解热键");
        assert_eq!(entries["Hotkey"]["de"], "Hotkey zum Zerlegen");
        assert_eq!(entries["RequireConfirm"].len(), 1);
        assert!(labels.is_empty());
    }

    #[test]
    fn parse_rejects_bad_shapes() {
        assert!(matches!(parse("not json"), Parsed::Bad));
        assert!(matches!(parse(r#"{"file":"","entries":{"K":{"de":"x"}}}"#), Parsed::Bad));
        assert!(matches!(parse(r#"{"entries":{"K":{"de":"x"}}}"#), Parsed::Bad));
        assert!(matches!(parse(r#"{"format":2,"file":"a.cfg","entries":{"K":{"de":"x"}}}"#), Parsed::Bad));
    }

    #[test]
    fn labels_block_is_read_and_labels_alone_are_enough() {
        let (_, entries, labels) = ok(
            r#"{"format":1,"file":"a.cfg","entries":{"K":{"de":"Beschreibung"}},"labels":{"K":{"de":"Name"}}}"#,
        );
        assert_eq!(entries["K"]["de"], "Beschreibung");
        assert_eq!(labels["K"]["de"], "Name");

        let (_, entries, labels) = ok(r#"{"file":"a.cfg","labels":{"K":{"de":"Name"}}}"#);
        assert!(entries.is_empty());
        assert_eq!(labels["K"]["de"], "Name");
    }

    #[test]
    fn unknown_top_level_keys_are_ignored_and_foreign_only_files_are_silent() {
        let (_, entries, _) = ok(
            r#"{"format":1,"file":"a.cfg","entries":{"K":{"de":"x"}},"modmenu":{"page":{"de":"Seite"},"sections":{}},"futureBlock":[1,2]}"#,
        );
        assert_eq!(entries["K"]["de"], "x");
        assert!(matches!(
            parse(r#"{"format":1,"file":"a.cfg","modmenu":{"page":{"de":"Seite"}}}"#),
            Parsed::NothingForUs
        ));
        assert!(matches!(parse(r#"{"file":"a.cfg","entries":{}}"#), Parsed::NothingForUs));
        assert!(matches!(
            parse(r#"{"file":"a.cfg","entries":{"K":{"de":5}}}"#),
            Parsed::NothingForUs
        ));
    }

    #[test]
    fn scan_merges_recurses_and_skips_broken() {
        let dir = tempfile::tempdir().unwrap();
        let plugins = dir.path().join("plugins");
        std::fs::create_dir_all(plugins.join("Sub")).unwrap();
        std::fs::write(plugins.join("QuickDismantle.hhmm-i18n.json"), GOOD).unwrap();
        std::fs::write(plugins.join("Broken.hhmm-i18n.json"), "{oops").unwrap();
        std::fs::write(plugins.join("Other.dll"), "binary").unwrap();
        std::fs::write(
            plugins.join("Sub").join("Nested.hhmm-i18n.json"),
            r#"{"file":"nested.cfg","labels":{"K":{"fr":"Nom"}}}"#,
        )
        .unwrap();

        let mut out = ModCfgI18n::default();
        scan_dir(&plugins, &mut out);
        assert_eq!(out.entries.len(), 1);
        assert_eq!(
            out.entries["humanhost.quickdismantle.cfg"]["Hotkey"]["zh-CN"],
            "批量拆解热键"
        );
        assert_eq!(out.labels["nested.cfg"]["K"]["fr"], "Nom");
    }
}
