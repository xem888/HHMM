use crate::paths::GAME_PROCESS;
use std::sync::Mutex;
use sysinfo::{Pid, ProcessesToUpdate, System};

static LAST_PID: Mutex<Option<Pid>> = Mutex::new(None);

pub fn is_game_running() -> bool {
    let cached = *LAST_PID.lock().unwrap_or_else(|p| p.into_inner());
    let mut sys = System::new();

    if let Some(pid) = cached {
        sys.refresh_processes(ProcessesToUpdate::Some(&[pid]), true);
        if let Some(p) = sys.process(pid) {
            if p.name()
                .to_string_lossy()
                .eq_ignore_ascii_case(GAME_PROCESS)
            {
                return true;
            }
        }
    }

    sys.refresh_processes(ProcessesToUpdate::All, true);
    let found = sys
        .processes()
        .iter()
        .find(|(_, p)| {
            p.name()
                .to_string_lossy()
                .eq_ignore_ascii_case(GAME_PROCESS)
        })
        .map(|(pid, _)| *pid);
    *LAST_PID.lock().unwrap_or_else(|p| p.into_inner()) = found;
    found.is_some()
}
