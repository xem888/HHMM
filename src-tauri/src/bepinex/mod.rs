pub mod deploy;
pub mod detect;

pub use detect::BepInExStatus;

pub const HIDE_MANAGER_SECTION: &str = "Chainloader";
pub const HIDE_MANAGER_KEY: &str = "HideManagerGameObject";
pub const HIDE_MANAGER_ON: &str = "true";
