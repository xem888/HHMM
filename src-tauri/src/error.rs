use serde::{Serialize, Serializer};
use serde::ser::SerializeStruct;

#[derive(thiserror::Error, Debug)]
pub enum AppError {
    #[error("Steam not found: {0}")]
    SteamNotFound(String),
    #[error("Game not found: {0}")]
    GameNotFound(String),
    #[error("Game is running")]
    GameRunning,
    #[error("Path escapes base: {0}")]
    PathEscape(String),
    #[error("IO error: {0}")]
    Io(String),
    #[error("Parse error: {0}")]
    Parse(String),
    #[error("Network error: {0}")]
    Network(String),
    #[error("Not found: {0}")]
    NotFound(String),
    #[error("{0}")]
    Other(String),
}

impl AppError {
    fn kind(&self) -> &'static str {
        match self {
            AppError::SteamNotFound(_) => "SteamNotFound",
            AppError::GameNotFound(_) => "GameNotFound",
            AppError::GameRunning => "GameRunning",
            AppError::PathEscape(_) => "PathEscape",
            AppError::Io(_) => "Io",
            AppError::Parse(_) => "Parse",
            AppError::Network(_) => "Network",
            AppError::NotFound(_) => "NotFound",
            AppError::Other(_) => "Other",
        }
    }
}

impl Serialize for AppError {
    fn serialize<S: Serializer>(&self, s: S) -> Result<S::Ok, S::Error> {
        let mut st = s.serialize_struct("AppError", 2)?;
        st.serialize_field("kind", self.kind())?;
        st.serialize_field("message", &self.to_string())?;
        st.end()
    }
}

impl From<std::io::Error> for AppError {
    fn from(e: std::io::Error) -> Self {
        match e.kind() {
            std::io::ErrorKind::NotFound => AppError::NotFound(e.to_string()),
            kind => AppError::Io(format!("{:?}: {}", kind, e)),
        }
    }
}

pub type AppResult<T> = Result<T, AppError>;
