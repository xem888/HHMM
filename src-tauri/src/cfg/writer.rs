use super::model::CfgChange;
use crate::error::AppResult;
use crate::fsx::atomic_write;
use std::path::Path;

fn logical(content: &str) -> &str {
    content.trim().trim_start_matches('\u{feff}').trim_start()
}

pub fn apply_changes(raw: &str, changes: &[CfgChange]) -> String {
    let mut out = String::with_capacity(raw.len() + 32);
    let mut current_section = String::new();

    for line_with_eol in raw.split_inclusive('\n') {
        let content = line_with_eol.trim_end_matches('\n').trim_end_matches('\r');
        let eol = &line_with_eol[content.len()..];
        let trimmed = logical(content);

        if trimmed.starts_with('[') && trimmed.ends_with(']') {
            current_section = trimmed[1..trimmed.len() - 1].to_string();
            out.push_str(line_with_eol);
            continue;
        }

        if trimmed.is_empty() || trimmed.starts_with('#') {
            out.push_str(line_with_eol);
            continue;
        }

        if let Some(eq) = content.find('=') {
            let key = logical(&content[..eq]);
            if let Some(ch) = changes
                .iter()
                .find(|c| c.section == current_section && c.key == key)
            {
                let after = &content[eq + 1..];
                let lead = after.len() - after.trim_start().len();
                let prefix = &content[..eq + 1 + lead];
                out.push_str(prefix);
                out.push_str(&ch.value);
                out.push_str(eol);
                continue;
            }
        }

        out.push_str(line_with_eol);
    }

    out
}

pub fn write_values(path: &Path, changes: &[CfgChange]) -> AppResult<()> {
    let raw = std::fs::read_to_string(path)?;
    let out = apply_changes(&raw, changes);
    atomic_write(path, out.as_bytes())
}

pub fn ensure_value(raw: &str, section: &str, key: &str, value: &str) -> (String, bool) {
    let eol = if raw.contains("\r\n") {
        "\r\n"
    } else if raw.contains('\n') {
        "\n"
    } else {
        "\r\n"
    };

    let mut current_section = String::new();
    let mut key_exists = false;
    let mut value_ok = false;
    for line_with_eol in raw.split_inclusive('\n') {
        let content = line_with_eol.trim_end_matches('\n').trim_end_matches('\r');
        let trimmed = logical(content);
        if trimmed.starts_with('[') && trimmed.ends_with(']') {
            current_section = trimmed[1..trimmed.len() - 1].to_string();
            continue;
        }
        if trimmed.is_empty() || trimmed.starts_with('#') {
            continue;
        }
        if let Some(eq) = content.find('=') {
            if current_section == section && logical(&content[..eq]) == key {
                key_exists = true;
                value_ok = content[eq + 1..].trim() == value;
                break;
            }
        }
    }

    if key_exists {
        if value_ok {
            return (raw.to_string(), false);
        }
        let out = apply_changes(
            raw,
            &[CfgChange {
                section: section.to_string(),
                key: key.to_string(),
                value: value.to_string(),
            }],
        );
        return (out, true);
    }

    let mut out = String::with_capacity(raw.len() + 64);
    let mut inserted = false;
    for line_with_eol in raw.split_inclusive('\n') {
        out.push_str(line_with_eol);
        if inserted {
            continue;
        }
        let content = line_with_eol.trim_end_matches('\n').trim_end_matches('\r');
        let trimmed = logical(content);
        if trimmed.starts_with('[')
            && trimmed.ends_with(']')
            && trimmed[1..trimmed.len() - 1] == *section
        {
            if !line_with_eol.ends_with('\n') {
                out.push_str(eol);
            }
            out.push_str(key);
            out.push_str(" = ");
            out.push_str(value);
            out.push_str(eol);
            inserted = true;
        }
    }
    if !inserted {
        if !raw.is_empty() && !raw.ends_with('\n') {
            out.push_str(eol);
        }
        out.push('[');
        out.push_str(section);
        out.push(']');
        out.push_str(eol);
        out.push_str(key);
        out.push_str(" = ");
        out.push_str(value);
        out.push_str(eol);
    }
    (out, true)
}

pub fn ensure_file_value(path: &Path, section: &str, key: &str, value: &str) -> AppResult<bool> {
    let raw = match std::fs::read_to_string(path) {
        Ok(s) => s,
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => String::new(),
        Err(e) => return Err(e.into()),
    };
    let (out, changed) = ensure_value(&raw, section, key, value);
    if changed {
        atomic_write(path, out.as_bytes())?;
    }
    Ok(changed)
}

#[cfg(test)]
mod tests {
    use super::{apply_changes, ensure_value, CfgChange};

    const BASE: &str = "## Settings file was created by BepInEx\r\n\r\n[Chainloader]\r\n\r\n## If enabled, hides BepInEx Manager GameObject from Unity.\r\n# Setting type: Boolean\r\n# Default value: false\r\nHideManagerGameObject = false\r\n\r\n[Logging.Console]\r\n\r\nEnabled = true\r\n";

    #[test]
    fn bom_on_first_line_does_not_hide_the_first_section() {
        let raw = "\u{feff}[General]\r\nSpeed = 1\r\n";
        let out = apply_changes(
            raw,
            &[CfgChange { section: "General".into(), key: "Speed".into(), value: "2".into() }],
        );
        assert_eq!(out, "\u{feff}[General]\r\nSpeed = 2\r\n");
        let (out, changed) = ensure_value(raw, "General", "Speed", "1");
        assert!(!changed);
        assert_eq!(out, raw);
    }

    #[test]
    fn ensure_replaces_existing_false_preserving_rest() {
        let (out, changed) = ensure_value(BASE, "Chainloader", "HideManagerGameObject", "true");
        assert!(changed);
        assert!(out.contains("HideManagerGameObject = true\r\n"));
        assert!(!out.contains("= false\r"));
        assert!(out.contains("# Default value: false\r\n"));
        assert!(out.contains("[Logging.Console]\r\n"));
        assert_eq!(out.lines().count(), BASE.lines().count());
    }

    #[test]
    fn ensure_noop_when_already_true_case_exact() {
        let raw = BASE.replace(
            "HideManagerGameObject = false",
            "HideManagerGameObject = true",
        );
        let (out, changed) = ensure_value(&raw, "Chainloader", "HideManagerGameObject", "true");
        assert!(!changed);
        assert_eq!(out, raw, "must stay byte-identical when already satisfied (zero write)");
    }

    #[test]
    fn ensure_inserts_key_after_existing_section_header() {
        let raw = "[Chainloader]\r\n\r\n## other\r\nSomeKey = 1\r\n";
        let (out, changed) = ensure_value(raw, "Chainloader", "HideManagerGameObject", "true");
        assert!(changed);
        assert!(out.starts_with("[Chainloader]\r\nHideManagerGameObject = true\r\n"));
        assert!(out.contains("SomeKey = 1\r\n"));
    }

    #[test]
    fn ensure_appends_section_when_missing() {
        let raw = "[Logging.Console]\nEnabled = true\n";
        let (out, changed) = ensure_value(raw, "Chainloader", "HideManagerGameObject", "true");
        assert!(changed);
        assert!(out.ends_with("[Chainloader]\nHideManagerGameObject = true\n"));
        assert!(out.starts_with("[Logging.Console]\nEnabled = true\n"));
    }

    #[test]
    fn ensure_empty_file_creates_minimal_cfg_crlf() {
        let (out, changed) = ensure_value("", "Chainloader", "HideManagerGameObject", "true");
        assert!(changed);
        assert_eq!(out, "[Chainloader]\r\nHideManagerGameObject = true\r\n");
    }

    #[test]
    fn ensure_handles_section_header_without_trailing_newline() {
        let raw = "[Chainloader]";
        let (out, changed) = ensure_value(raw, "Chainloader", "HideManagerGameObject", "true");
        assert!(changed);
        assert_eq!(out, "[Chainloader]\r\nHideManagerGameObject = true\r\n");
    }

    #[test]
    fn ensure_does_not_touch_same_key_in_other_section() {
        let raw = "[Other]\nHideManagerGameObject = false\n";
        let (out, changed) = ensure_value(raw, "Chainloader", "HideManagerGameObject", "true");
        assert!(changed);
        assert!(out.starts_with("[Other]\nHideManagerGameObject = false\n"));
        assert!(out.ends_with("[Chainloader]\nHideManagerGameObject = true\n"));
    }
}
