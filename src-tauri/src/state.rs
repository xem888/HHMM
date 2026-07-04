use crate::paths::GamePaths;
use std::sync::Mutex;

#[derive(Default)]
pub struct AppState {
    pub game: Mutex<Option<GamePaths>>,
}

impl AppState {
    pub fn game_paths(&self) -> Result<GamePaths, crate::error::AppError> {
        self.game
            .lock()
            .unwrap_or_else(|e| e.into_inner())
            .clone()
            .ok_or_else(|| crate::error::AppError::GameNotFound("game path not set".into()))
    }
}
