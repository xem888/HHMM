use super::model::*;
use super::schema;

const DYNAMIC_THRESHOLD: usize = 50;

pub fn parse(file_name: &str, raw: &str) -> CfgFile {
    let raw = raw.strip_prefix('\u{feff}').unwrap_or(raw);
    let eol = if raw.contains("\r\n") { "\r\n" } else { "\n" }.to_string();

    let mut header_lines: Vec<String> = Vec::new();
    let mut sections: Vec<CfgSection> = Vec::new();
    let mut plugin_name = None;
    let mut plugin_version = None;
    let mut plugin_guid = None;

    let mut pending_blanks: Vec<String> = Vec::new();
    let mut pending_comments: Vec<String> = Vec::new();
    let mut desc: Vec<String> = Vec::new();
    let mut setting_type = SettingType::Unknown(String::new());
    let mut default_value: Option<String> = None;
    let mut range: Option<(f64, f64)> = None;
    let mut acceptable: Option<Vec<String>> = None;

    for raw_line in raw.split('\n') {
        let line = raw_line.trim_end_matches('\r');
        let trimmed = line.trim();

        if trimmed.is_empty() {
            pending_blanks.push(line.to_string());
            continue;
        }

        if trimmed.starts_with('[') && trimmed.ends_with(']') {
            sections.push(CfgSection {
                name: trimmed[1..trimmed.len() - 1].to_string(),
                kind: SectionKind::Schema,
                entries: Vec::new(),
                raw_header_line: line.to_string(),
                leading_blanks: std::mem::take(&mut pending_blanks),
            });
            pending_comments.clear();
            reset_entry(
                &mut desc,
                &mut setting_type,
                &mut default_value,
                &mut range,
                &mut acceptable,
            );
            continue;
        }

        if trimmed.starts_with("##") {
            let d = trimmed.trim_start_matches('#').trim_start();
            if sections.is_empty() {
                header_lines.push(line.to_string());
                if let Some(rest) = d.strip_prefix("Settings file was created by plugin ") {
                    if let Some(idx) = rest.rfind(" v") {
                        plugin_name = Some(rest[..idx].to_string());
                        plugin_version = Some(rest[idx + 2..].to_string());
                    } else {
                        plugin_name = Some(rest.to_string());
                    }
                } else if let Some(g) = d.strip_prefix("Plugin GUID: ") {
                    plugin_guid = Some(g.trim().to_string());
                }
            } else {
                desc.push(d.to_string());
            }
            pending_comments.push(line.to_string());
            continue;
        }

        if trimmed.starts_with('#') {
            let m = trimmed.trim_start_matches('#').trim_start();
            if let Some(v) = m.strip_prefix("Setting type:") {
                setting_type = parse_type(v.trim());
            } else if let Some(v) = m.strip_prefix("Default value:") {
                default_value = Some(v.trim().to_string());
            } else if let Some(v) = m.strip_prefix("Acceptable value range:") {
                range = parse_range(v.trim());
            } else if let Some(v) = m.strip_prefix("Acceptable values:") {
                acceptable = Some(v.split(',').map(|x| x.trim().to_string()).collect());
            }
            pending_comments.push(line.to_string());
            continue;
        }

        if let Some(eq) = line.find('=') {
            let key = line[..eq].trim().to_string();
            let value = line[eq + 1..].trim().to_string();
            let control = schema::infer(&setting_type, &range, &acceptable);
            let entry = CfgEntry {
                key,
                value,
                description: std::mem::take(&mut desc),
                setting_type: setting_type.clone(),
                default_value: default_value.take(),
                range: range.take(),
                acceptable_values: acceptable.take(),
                control,
                comment_block: std::mem::take(&mut pending_comments),
                leading_blanks: std::mem::take(&mut pending_blanks),
                raw_value_line: line.to_string(),
            };
            if let Some(sec) = sections.last_mut() {
                sec.entries.push(entry);
            }
            setting_type = SettingType::Unknown(String::new());
            continue;
        }

        pending_comments.push(line.to_string());
    }

    for sec in sections.iter_mut() {
        let numeric_like = |e: &CfgEntry| match &e.setting_type {
            SettingType::Int32 | SettingType::Single => true,
            SettingType::Unknown(_) => e.value.trim().parse::<f64>().is_ok(),
            _ => false,
        };
        let no_meta = !sec.entries.is_empty()
            && sec.entries.iter().all(|e| {
                matches!(e.setting_type, SettingType::Unknown(_)) && e.default_value.is_none()
            });
        let all_numeric = sec.entries.iter().all(numeric_like);
        if (no_meta || sec.entries.len() > DYNAMIC_THRESHOLD) && all_numeric {
            sec.kind = SectionKind::Dynamic;
            for e in sec.entries.iter_mut() {
                e.control = ControlKind::DynamicKeyInt;
            }
        }
    }

    CfgFile {
        file_name: file_name.to_string(),
        plugin_name,
        plugin_version,
        plugin_guid,
        sections,
        header_lines,
        eol,
    }
}

fn reset_entry(
    desc: &mut Vec<String>,
    st: &mut SettingType,
    dv: &mut Option<String>,
    range: &mut Option<(f64, f64)>,
    acc: &mut Option<Vec<String>>,
) {
    desc.clear();
    *st = SettingType::Unknown(String::new());
    *dv = None;
    *range = None;
    *acc = None;
}

fn parse_type(s: &str) -> SettingType {
    match s {
        "Boolean" => SettingType::Boolean,
        "Int32" => SettingType::Int32,
        "Single" => SettingType::Single,
        "String" => SettingType::String,
        "KeyboardShortcut" => SettingType::KeyboardShortcut,
        "KeyCode" => SettingType::KeyCode,
        other => SettingType::Enum(other.to_string()),
    }
}

fn parse_range(s: &str) -> Option<(f64, f64)> {
    let rest = s.trim().strip_prefix("From ")?;
    let (a, b) = rest.split_once(" to ")?;
    Some((a.trim().parse().ok()?, b.trim().parse().ok()?))
}
