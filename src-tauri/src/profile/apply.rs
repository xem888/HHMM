use super::{ApplyResult, Profile, ProfileMod};
use crate::error::AppResult;
use crate::fsx;
use crate::mods::{self, FailedItem, ManagedState};
use crate::paths::{resolve_within, GamePaths};
use std::collections::HashSet;

pub(crate) struct CurrentMod {
    pub id: String,
    pub dll_name: String,
    pub installed: bool,
}

#[derive(Debug, PartialEq, Eq)]
pub(crate) enum PlanAction {
    Uninstall { id: String, dll_name: String },
    Toggle { id: String, dll_name: String, enable: bool },
    Install { item_id: String, dll_name: String, to_disabled: bool },
}

pub(crate) fn plan_mod_actions(current: &[CurrentMod], target: &[ProfileMod]) -> Vec<PlanAction> {
    let target_dlls: HashSet<String> = target.iter().map(|m| m.dll_name.to_lowercase()).collect();
    let mut plan = Vec::new();

    for c in current {
        if c.installed && !target_dlls.contains(&c.dll_name.to_lowercase()) {
            plan.push(PlanAction::Uninstall {
                id: c.id.clone(),
                dll_name: c.dll_name.clone(),
            });
        }
    }

    let installed_now: HashSet<String> = current
        .iter()
        .filter(|c| c.installed)
        .map(|c| c.dll_name.to_lowercase())
        .collect();
    for t in target {
        if installed_now.contains(&t.dll_name.to_lowercase()) {
            plan.push(PlanAction::Toggle {
                id: t.id.clone(),
                dll_name: t.dll_name.clone(),
                enable: t.enabled,
            });
        } else if let Some(item_id) = &t.item_id {
            plan.push(PlanAction::Install {
                item_id: item_id.clone(),
                dll_name: t.dll_name.clone(),
                to_disabled: !t.enabled,
            });
        }
    }
    plan
}

pub fn apply(gp: &GamePaths, profile: &Profile) -> AppResult<ApplyResult> {
    let mut res = ApplyResult::default();

    let config_dir = gp.config();
    for (file_name, content) in &profile.cfgs {
        match resolve_within(&config_dir, &[file_name])
            .and_then(|path| fsx::atomic_write(&path, content.as_bytes()))
        {
            Ok(()) => res.applied.push(file_name.clone()),
            Err(e) => res.failed.push(FailedItem {
                dll_name: file_name.clone(),
                reason: e.to_string(),
            }),
        }
    }

    if profile.mods.is_empty() {
        return Ok(res);
    }

    let current: Vec<CurrentMod> = mods::managed::list_managed(gp)
        .into_iter()
        .map(|m| CurrentMod {
            installed: m.state != ManagedState::NotInstalled,
            id: m.id,
            dll_name: m.dll_name,
        })
        .collect();
    for action in plan_mod_actions(&current, &profile.mods) {
        let (dll_name, outcome) = match &action {
            PlanAction::Uninstall { id, dll_name } => {
                (dll_name.clone(), mods::sync::uninstall_one(gp, id))
            }
            PlanAction::Toggle { id, dll_name, enable } => {
                (dll_name.clone(), mods::toggle::toggle(gp, id, *enable))
            }
            PlanAction::Install { item_id, dll_name, to_disabled } => {
                (dll_name.clone(), mods::sync::install_one(gp, item_id, *to_disabled))
            }
        };
        match outcome {
            Ok(()) => res.applied.push(dll_name),
            Err(e) => res.failed.push(FailedItem {
                dll_name,
                reason: e.to_string(),
            }),
        }
    }

    Ok(res)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn cur(id: &str, dll: &str, installed: bool) -> CurrentMod {
        CurrentMod { id: id.into(), dll_name: dll.into(), installed }
    }
    fn tgt(id: &str, dll: &str, item_id: Option<&str>, enabled: bool) -> ProfileMod {
        ProfileMod {
            id: id.into(),
            dll_name: dll.into(),
            item_id: item_id.map(String::from),
            enabled,
        }
    }

    #[test]
    fn uninstalls_current_not_in_profile() {
        let plan = plan_mod_actions(
            &[cur("a", "A.dll", true), cur("b", "B.dll", true)],
            &[tgt("a", "A.dll", None, true)],
        );
        assert!(plan.contains(&PlanAction::Uninstall { id: "b".into(), dll_name: "B.dll".into() }));
        assert!(!plan.iter().any(|p| matches!(p, PlanAction::Uninstall { id, .. } if id == "a")));
    }

    #[test]
    fn never_uninstalls_not_installed_entries() {
        let plan = plan_mod_actions(&[cur("x", "X.dll", false)], &[]);
        assert!(plan.is_empty());
    }

    #[test]
    fn toggles_installed_target_to_profile_state() {
        let plan = plan_mod_actions(
            &[cur("a", "A.dll", true)],
            &[tgt("a", "A.dll", None, false)],
        );
        assert_eq!(
            plan,
            vec![PlanAction::Toggle { id: "a".into(), dll_name: "A.dll".into(), enable: false }]
        );
    }

    #[test]
    fn installs_missing_workshop_target_to_right_slot() {
        let plan = plan_mod_actions(&[], &[tgt("a", "A.dll", Some("123"), false)]);
        assert_eq!(
            plan,
            vec![PlanAction::Install {
                item_id: "123".into(),
                dll_name: "A.dll".into(),
                to_disabled: true
            }]
        );
    }

    #[test]
    fn skips_missing_local_target() {
        let plan = plan_mod_actions(&[], &[tgt("a", "A.dll", None, true)]);
        assert!(plan.is_empty());
    }

    #[test]
    fn dll_match_is_case_insensitive() {
        let plan = plan_mod_actions(
            &[cur("a", "adminpanel.dll", true)],
            &[tgt("a", "AdminPanel.dll", Some("123"), true)],
        );
        assert_eq!(
            plan,
            vec![PlanAction::Toggle {
                id: "a".into(),
                dll_name: "AdminPanel.dll".into(),
                enable: true
            }]
        );
    }

    #[test]
    fn uninstall_runs_before_install() {
        let plan = plan_mod_actions(
            &[cur("old", "Old.dll", true)],
            &[tgt("new", "New.dll", Some("9"), true)],
        );
        assert!(matches!(plan[0], PlanAction::Uninstall { .. }));
        assert!(matches!(plan[1], PlanAction::Install { .. }));
    }
}
