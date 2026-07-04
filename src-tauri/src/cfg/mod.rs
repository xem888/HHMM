pub mod mod_i18n;
pub mod model;
pub mod parser;
pub mod schema;
pub mod writer;

pub use model::*;

use crate::error::AppResult;
use std::path::Path;

pub fn read_file(path: &Path) -> AppResult<CfgFile> {
    let raw = std::fs::read_to_string(path)?;
    let name = path
        .file_name()
        .map(|s| s.to_string_lossy().to_string())
        .unwrap_or_default();
    Ok(parser::parse(&name, &raw))
}

pub fn read_meta(path: &Path) -> AppResult<CfgFileMeta> {
    let f = read_file(path)?;
    Ok(CfgFileMeta {
        file_name: f.file_name,
        plugin_name: f.plugin_name,
        plugin_version: f.plugin_version,
        plugin_guid: f.plugin_guid,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    const SAMPLE: &str = "## Settings file was created by plugin Test Plugin v1.2.3\n## Plugin GUID: test.plugin\n\n[General]\n\n## Pickup radius in meters\n# Setting type: Single\n# Default value: 12\n# Acceptable value range: From 2 to 40\nRadius = 12\n\n## A toggle\n# Setting type: Boolean\n# Default value: true\nFlag = true\n\n## Mode select\n# Setting type: StackMode\n# Default value: Unified\n# Acceptable values: Unified, Multiplier\nMode = Unified\n\n[ItemOverrides]\n\nWood = 0\nStone = 99\n";

    #[test]
    fn roundtrip_lf_no_change() {
        let out = writer::apply_changes(SAMPLE, &[]);
        assert_eq!(out, SAMPLE, "LF round-trip must be byte-identical");
    }

    #[test]
    fn roundtrip_crlf_no_change() {
        let crlf = SAMPLE.replace('\n', "\r\n");
        let out = writer::apply_changes(&crlf, &[]);
        assert_eq!(out, crlf, "CRLF round-trip must be byte-identical");
    }

    #[test]
    fn parse_header_and_types() {
        let f = parser::parse("test.cfg", SAMPLE);
        assert_eq!(f.plugin_name.as_deref(), Some("Test Plugin"));
        assert_eq!(f.plugin_version.as_deref(), Some("1.2.3"));
        assert_eq!(f.plugin_guid.as_deref(), Some("test.plugin"));
        assert_eq!(f.sections.len(), 2);

        let general = &f.sections[0];
        assert_eq!(general.name, "General");
        assert_eq!(general.kind, SectionKind::Schema);
        assert_eq!(general.entries.len(), 3);

        let radius = &general.entries[0];
        assert_eq!(radius.key, "Radius");
        assert!(matches!(
            radius.control,
            ControlKind::Slider { min, max, .. } if min == 2.0 && max == 40.0
        ));
        assert!(matches!(general.entries[1].control, ControlKind::Toggle));
        assert!(matches!(
            &general.entries[2].control,
            ControlKind::Dropdown { options } if options == &vec!["Unified".to_string(), "Multiplier".to_string()]
        ));
    }

    #[test]
    fn parse_dynamic_section() {
        let f = parser::parse("test.cfg", SAMPLE);
        let overrides = &f.sections[1];
        assert_eq!(overrides.name, "ItemOverrides");
        assert_eq!(overrides.kind, SectionKind::Dynamic);
        assert!(overrides
            .entries
            .iter()
            .all(|e| matches!(e.control, ControlKind::DynamicKeyInt)));
    }

    #[test]
    fn parse_strips_utf8_bom() {
        let bom = format!("\u{feff}{}", SAMPLE);
        let f = parser::parse("test.cfg", &bom);
        assert_eq!(f.plugin_name.as_deref(), Some("Test Plugin"));
        assert_eq!(f.sections.len(), 2);
        let f2 = parser::parse("x.cfg", "\u{feff}[Sec]\nk = 1\n");
        assert_eq!(f2.sections.len(), 1);
        assert_eq!(f2.sections[0].entries.len(), 1);
    }

    #[test]
    fn big_section_with_metadata_stays_schema() {
        let mut raw = String::from("[Toggles]\n");
        for i in 0..60 {
            raw.push_str(&format!(
                "## t{i}\n# Setting type: Boolean\n# Default value: true\nFlag{i} = true\n"
            ));
        }
        let f = parser::parse("big.cfg", &raw);
        assert_eq!(f.sections[0].kind, SectionKind::Schema);
        assert!(matches!(f.sections[0].entries[0].control, ControlKind::Toggle));
        let mut raw2 = String::from("[Overrides]\n");
        for i in 0..60 {
            raw2.push_str(&format!("Item{i} = {i}\n"));
        }
        let f2 = parser::parse("dyn.cfg", &raw2);
        assert_eq!(f2.sections[0].kind, SectionKind::Dynamic);
    }

    #[test]
    fn numeric_primitive_types_get_number_controls() {
        let raw = "[S]\n## a\n# Setting type: Double\n# Default value: 0.05\nMul = 0.05\n## b\n# Setting type: Int64\n# Default value: 100\nCap = 100\n## c\n# Setting type: SomeEnum\nMode = A\n";
        let f = parser::parse("t.cfg", raw);
        let e = &f.sections[0].entries;
        assert!(matches!(e[0].control, ControlKind::Number { integer: false }));
        assert!(matches!(e[1].control, ControlKind::Number { integer: true }));
        assert!(matches!(e[2].control, ControlKind::Text));
    }

    #[test]
    fn change_only_target_line() {
        let changes = vec![CfgChange {
            section: "General".into(),
            key: "Radius".into(),
            value: "20".into(),
        }];
        let out = writer::apply_changes(SAMPLE, &changes);
        assert!(out.contains("Radius = 20"));
        assert!(!out.contains("Radius = 12"));
        assert!(out.contains("Flag = true"));
        assert!(out.contains("Wood = 0"));
        assert!(out.contains("# Acceptable value range: From 2 to 40"));
        assert_eq!(out.lines().count(), SAMPLE.lines().count());
    }

    #[test]
    fn change_dynamic_item_with_spaces_in_key() {
        let raw = "[ItemOverrides]\n.45 ACP (Chrome) = 0\n7.62x39mm Bullet = 500\n";
        let changes = vec![CfgChange {
            section: "ItemOverrides".into(),
            key: ".45 ACP (Chrome)".into(),
            value: "999".into(),
        }];
        let out = writer::apply_changes(raw, &changes);
        assert!(out.contains(".45 ACP (Chrome) = 999"));
        assert!(out.contains("7.62x39mm Bullet = 500"));
    }
}
