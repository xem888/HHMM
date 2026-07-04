use super::model::{ControlKind, SettingType};

pub fn infer(
    st: &SettingType,
    range: &Option<(f64, f64)>,
    acceptable: &Option<Vec<String>>,
) -> ControlKind {
    match st {
        SettingType::Boolean => ControlKind::Toggle,
        SettingType::Int32 => match range {
            Some((a, b)) => ControlKind::Slider {
                min: *a,
                max: *b,
                step: 1.0,
            },
            None => ControlKind::Number { integer: true },
        },
        SettingType::Single => match range {
            Some((a, b)) => ControlKind::Slider {
                min: *a,
                max: *b,
                step: 0.01,
            },
            None => ControlKind::Number { integer: false },
        },
        SettingType::KeyboardShortcut => ControlKind::Keybind,
        SettingType::KeyCode => ControlKind::KeyCode,
        SettingType::Enum(name) => {
            let int_like = matches!(
                name.as_str(),
                "Int64" | "UInt64" | "UInt32" | "Int16" | "UInt16" | "Byte" | "SByte"
            );
            let float_like = matches!(name.as_str(), "Double" | "Decimal");
            if int_like || float_like {
                match range {
                    Some((a, b)) => ControlKind::Slider {
                        min: *a,
                        max: *b,
                        step: if int_like { 1.0 } else { 0.01 },
                    },
                    None => ControlKind::Number { integer: int_like },
                }
            } else {
                match acceptable {
                    Some(opts) if !opts.is_empty() => ControlKind::Dropdown {
                        options: opts.clone(),
                    },
                    _ => ControlKind::Text,
                }
            }
        }
        SettingType::String => ControlKind::Text,
        SettingType::Unknown(_) => match acceptable {
            Some(opts) => ControlKind::Dropdown {
                options: opts.clone(),
            },
            None => ControlKind::Text,
        },
    }
}
