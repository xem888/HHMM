use crate::paths::GamePaths;
use serde::Serialize;
use std::path::Path;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BepInExStatus {
    pub installed: bool,
    pub has_winhttp: bool,
    pub version: Option<String>,
    pub compat: Option<BepInExCompat>,
    pub hide_manager: Option<HideManagerState>,
}

#[derive(Serialize, Clone, Copy, Debug, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum HideManagerState {
    Ok,
    MissingFile,
    Disabled,
}

#[derive(Serialize, Clone, Copy, Debug, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum BepInExCompat {
    Ok,
    Below,
    Above,
    Incompatible,
}

pub fn detect(gp: &GamePaths) -> BepInExStatus {
    let has_winhttp = gp.winhttp().exists();
    let core = gp.bepinex_core();
    let core_dll = core.join("BepInEx.dll");
    let core_dll2 = core.join("BepInEx.Core.dll");
    let installed = has_winhttp && (core_dll.exists() || core_dll2.exists());
    let version = read_pe_version(&core_dll).or_else(|| read_pe_version(&core_dll2));
    let compat = if installed {
        version.as_deref().and_then(classify_version)
    } else {
        None
    };
    let hide_manager = if installed {
        Some(
            match std::fs::read_to_string(gp.config().join("BepInEx.cfg")) {
                Ok(raw) => classify_hide_manager(&raw),
                Err(_) => HideManagerState::MissingFile,
            },
        )
    } else {
        None
    };
    BepInExStatus {
        installed,
        has_winhttp,
        version,
        compat,
        hide_manager,
    }
}

fn classify_hide_manager(raw: &str) -> HideManagerState {
    let raw = raw.strip_prefix('\u{feff}').unwrap_or(raw);
    let mut in_chainloader = false;
    for line in raw.lines() {
        let trimmed = line.trim();
        if trimmed.starts_with('[') && trimmed.ends_with(']') {
            in_chainloader = trimmed[1..trimmed.len() - 1] == *super::HIDE_MANAGER_SECTION;
            continue;
        }
        if trimmed.is_empty() || trimmed.starts_with('#') {
            continue;
        }
        if let Some(eq) = trimmed.find('=') {
            if in_chainloader && trimmed[..eq].trim() == super::HIDE_MANAGER_KEY {
                let v = trimmed[eq + 1..].trim();
                return if v.eq_ignore_ascii_case("true") {
                    HideManagerState::Ok
                } else {
                    HideManagerState::Disabled
                };
            }
        }
    }
    HideManagerState::Disabled
}

fn classify_version(s: &str) -> Option<BepInExCompat> {
    let s = s.trim();
    if s.is_empty() {
        return None;
    }
    let parts: Vec<u32> = s
        .split('.')
        .map(|p| {
            p.chars()
                .take_while(|c| c.is_ascii_digit())
                .collect::<String>()
                .parse()
                .unwrap_or(0)
        })
        .collect();
    let major = *parts.first()?;
    if major != 5 {
        return Some(BepInExCompat::Incompatible);
    }
    let head = (*parts.get(1).unwrap_or(&0), *parts.get(2).unwrap_or(&0));
    const HEAD: (u32, u32) = (4, 23);
    const BUILD: u32 = 2;
    use std::cmp::Ordering;
    Some(match head.cmp(&HEAD) {
        Ordering::Less => BepInExCompat::Below,
        Ordering::Greater => BepInExCompat::Above,
        Ordering::Equal => match parts.get(3) {
            None => BepInExCompat::Ok,
            Some(&b) if b < BUILD => BepInExCompat::Below,
            Some(&b) if b > BUILD => BepInExCompat::Above,
            Some(_) => BepInExCompat::Ok,
        },
    })
}

fn read_pe_version(path: &Path) -> Option<String> {
    use pelite::pe32::{Pe as _, PeFile as PeFile32};
    use pelite::pe64::{Pe as _, PeFile as PeFile64};

    if !path.exists() {
        return None;
    }
    let map = pelite::FileMap::open(path).ok()?;
    let bytes = map.as_ref();

    macro_rules! ver_from {
        ($pe:expr) => {
            if let Ok(res) = $pe.resources() {
                if let Ok(vi) = res.version_info() {
                    if let Some(lang) = vi.translation().first().copied() {
                        if let Some(s) = vi
                            .value(lang, "ProductVersion")
                            .or_else(|| vi.value(lang, "FileVersion"))
                        {
                            let t = s.trim();
                            if !t.is_empty() {
                                return Some(t.to_string());
                            }
                        }
                    }
                    if let Some(f) = vi.fixed() {
                        return Some(f.dwFileVersion.to_string());
                    }
                }
            }
        };
    }

    if let Ok(pe) = PeFile32::from_bytes(bytes) {
        ver_from!(pe);
    }
    if let Ok(pe) = PeFile64::from_bytes(bytes) {
        ver_from!(pe);
    }
    None
}

#[cfg(test)]
mod tests {
    use super::{classify_hide_manager, classify_version, BepInExCompat, HideManagerState};

    #[test]
    fn hide_manager_true_is_ok_ignore_case() {
        let raw = "[Chainloader]\r\nHideManagerGameObject = true\r\n";
        assert_eq!(classify_hide_manager(raw), HideManagerState::Ok);
        let raw2 = "[Chainloader]\nHideManagerGameObject = True\n";
        assert_eq!(classify_hide_manager(raw2), HideManagerState::Ok);
    }

    #[test]
    fn hide_manager_false_or_missing_is_disabled() {
        let f = "[Chainloader]\nHideManagerGameObject = false\n";
        assert_eq!(classify_hide_manager(f), HideManagerState::Disabled);
        let no_key = "[Chainloader]\nSomeOther = 1\n";
        assert_eq!(classify_hide_manager(no_key), HideManagerState::Disabled);
        let no_sec = "[Logging.Console]\nEnabled = true\n";
        assert_eq!(classify_hide_manager(no_sec), HideManagerState::Disabled);
        assert_eq!(classify_hide_manager(""), HideManagerState::Disabled);
    }

    #[test]
    fn hide_manager_section_and_key_are_case_sensitive_like_bepinex() {
        let lower = "[chainloader]\nHideManagerGameObject = true\n";
        assert_eq!(classify_hide_manager(lower), HideManagerState::Disabled);
        let lower_key = "[Chainloader]\nhidemanagergameobject = true\n";
        assert_eq!(classify_hide_manager(lower_key), HideManagerState::Disabled);
    }

    #[test]
    fn hide_manager_real_world_shape_with_comments_and_bom() {
        let raw = "\u{feff}## Settings file was created by BepInEx\r\n\r\n[Caching]\r\nEnableDiskCache = true\r\n\r\n[Chainloader]\r\n\r\n## If enabled, hides BepInEx Manager GameObject.\r\n# Setting type: Boolean\r\n# Default value: false\r\nHideManagerGameObject = true\r\n\r\n[Logging.Console]\r\nEnabled = false\r\n";
        assert_eq!(classify_hide_manager(raw), HideManagerState::Ok);
    }

    #[test]
    fn target_and_three_part_series_is_ok() {
        assert_eq!(classify_version("5.4.23.2"), Some(BepInExCompat::Ok));
        assert_eq!(classify_version("5.4.23"), Some(BepInExCompat::Ok));
    }

    #[test]
    fn lower_versions_are_below() {
        assert_eq!(classify_version("5.4.22"), Some(BepInExCompat::Below));
        assert_eq!(classify_version("5.4.23.1"), Some(BepInExCompat::Below));
        assert_eq!(classify_version("5.3.0"), Some(BepInExCompat::Below));
    }

    #[test]
    fn higher_5x_versions_are_above() {
        assert_eq!(classify_version("5.4.24"), Some(BepInExCompat::Above));
        assert_eq!(classify_version("5.4.23.3"), Some(BepInExCompat::Above));
        assert_eq!(classify_version("5.5.0"), Some(BepInExCompat::Above));
    }

    #[test]
    fn different_major_is_incompatible() {
        assert_eq!(classify_version("6.0.0"), Some(BepInExCompat::Incompatible));
        assert_eq!(classify_version("6.0.0-be.725"), Some(BepInExCompat::Incompatible));
        assert_eq!(classify_version("4.9.0"), Some(BepInExCompat::Incompatible));
    }

    #[test]
    fn empty_is_none() {
        assert_eq!(classify_version(""), None);
        assert_eq!(classify_version("   "), None);
    }
}
