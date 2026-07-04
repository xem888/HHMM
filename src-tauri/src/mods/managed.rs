use super::{scan, steam_api, workshop, ManagedMod, ManagedSource, ManagedState, ModEntry};
use crate::paths::GamePaths;
use std::collections::{HashMap, HashSet};

pub fn list_managed(gp: &GamePaths) -> Vec<ManagedMod> {
    let mut ws = workshop::scan_workshop(gp);
    ws.sort_by(|a, b| a.item_id.cmp(&b.item_id));
    let installed = scan::scan_installed(gp);
    let title_cache = steam_api::read_cache();

    let mut inst_map: HashMap<String, &ModEntry> = HashMap::new();
    for m in &installed {
        match inst_map.entry(m.dll_name.to_lowercase()) {
            std::collections::hash_map::Entry::Occupied(mut e) => {
                log::warn!(
                    "duplicate installed dll '{}' in both plugins and disabled; showing the enabled copy",
                    m.dll_name
                );
                if m.enabled && !e.get().enabled {
                    e.insert(m);
                }
            }
            std::collections::hash_map::Entry::Vacant(v) => {
                v.insert(m);
            }
        }
    }
    let mut consumed: HashSet<String> = HashSet::new();
    let mut out: Vec<ManagedMod> = Vec::new();

    let mut seen_ws: HashSet<String> = HashSet::new();
    for w in &ws {
        let key = w.dll_name.to_lowercase();
        if !seen_ws.insert(key.clone()) {
            log::warn!(
                "workshop items collide on dll '{}'; only the first (by item id) is managed",
                w.dll_name
            );
            continue;
        }
        let id = dll_stem(&w.dll_name);
        let inst = inst_map.get(&key).copied();
        if inst.is_some() {
            consumed.insert(key.clone());
        }
        let (state, updatable, size, mtime) = match inst {
            Some(m) => (
                if m.enabled {
                    ManagedState::Enabled
                } else {
                    ManagedState::Disabled
                },
                m.hash != w.hash,
                m.size,
                m.mtime,
            ),
            None => (ManagedState::NotInstalled, false, 0, w.mtime),
        };
        let meta = title_cache.get(&w.item_id);
        let display_name = meta
            .map(|m| m.title.clone())
            .filter(|t| !t.is_empty())
            .unwrap_or_else(|| id.clone());
        out.push(ManagedMod {
            key,
            id,
            dll_name: w.dll_name.clone(),
            display_name,
            source: ManagedSource::Workshop {
                item_id: w.item_id.clone(),
            },
            state,
            updatable,
            size,
            mtime,
            title: meta.map(|m| m.title.clone()),
            author: meta.and_then(|m| m.author.clone()),
            preview_url: meta.and_then(|m| m.preview_url.clone()),
            time_created: meta.and_then(|m| m.time_created),
            time_updated: meta.and_then(|m| m.time_updated),
        });
    }

    for m in &installed {
        let key = m.dll_name.to_lowercase();
        if consumed.contains(&key) {
            continue;
        }
        consumed.insert(key.clone());
        out.push(ManagedMod {
            key,
            id: m.id.clone(),
            dll_name: m.dll_name.clone(),
            display_name: m.id.clone(),
            source: ManagedSource::Local,
            state: if m.enabled {
                ManagedState::Enabled
            } else {
                ManagedState::Disabled
            },
            updatable: false,
            size: m.size,
            mtime: m.mtime,
            title: None,
            author: None,
            preview_url: None,
            time_created: None,
            time_updated: None,
        });
    }

    out
}

fn dll_stem(dll: &str) -> String {
    std::path::Path::new(dll)
        .file_stem()
        .map(|s| s.to_string_lossy().to_string())
        .unwrap_or_else(|| dll.to_string())
}
