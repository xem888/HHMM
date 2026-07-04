use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum SettingType {
    Boolean,
    Int32,
    Single,
    String,
    KeyboardShortcut,
    KeyCode,
    Enum(String),
    Unknown(String),
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(tag = "kind", rename_all = "camelCase")]
pub enum ControlKind {
    Toggle,
    Slider { min: f64, max: f64, step: f64 },
    Number { integer: bool },
    Dropdown { options: Vec<String> },
    Keybind,
    KeyCode,
    Text,
    MultiText { separator: String },
    DynamicKeyInt,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum SectionKind {
    Schema,
    Dynamic,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct CfgEntry {
    pub key: String,
    pub value: String,
    pub description: Vec<String>,
    pub setting_type: SettingType,
    pub default_value: Option<String>,
    pub range: Option<(f64, f64)>,
    pub acceptable_values: Option<Vec<String>>,
    pub control: ControlKind,
    #[serde(skip)]
    #[allow(dead_code)]
    pub comment_block: Vec<String>,
    #[serde(skip)]
    #[allow(dead_code)]
    pub leading_blanks: Vec<String>,
    #[serde(skip)]
    #[allow(dead_code)]
    pub raw_value_line: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct CfgSection {
    pub name: String,
    pub kind: SectionKind,
    pub entries: Vec<CfgEntry>,
    #[serde(skip)]
    #[allow(dead_code)]
    pub raw_header_line: String,
    #[serde(skip)]
    #[allow(dead_code)]
    pub leading_blanks: Vec<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct CfgFile {
    pub file_name: String,
    pub plugin_name: Option<String>,
    pub plugin_version: Option<String>,
    pub plugin_guid: Option<String>,
    pub sections: Vec<CfgSection>,
    #[serde(skip)]
    #[allow(dead_code)]
    pub header_lines: Vec<String>,
    #[serde(skip)]
    #[allow(dead_code)]
    pub eol: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct CfgFileMeta {
    pub file_name: String,
    pub plugin_name: Option<String>,
    pub plugin_version: Option<String>,
    pub plugin_guid: Option<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct CfgChange {
    pub section: String,
    pub key: String,
    pub value: String,
}
