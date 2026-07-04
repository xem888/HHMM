use crate::paths::APP_ID;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::{Mutex, OnceLock};

const ENDPOINT: &str =
    "https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/";

#[derive(Serialize, Deserialize, Clone, Debug, Default)]
#[serde(rename_all = "camelCase")]
pub struct WorkshopMeta {
    pub title: String,
    pub preview_url: Option<String>,
    pub time_created: Option<i64>,
    pub time_updated: Option<i64>,
    pub creator: Option<String>,
    pub author: Option<String>,
    pub fetched_at: Option<i64>,
}

fn cache_dir() -> PathBuf {
    let base = dirs::data_local_dir().unwrap_or_else(std::env::temp_dir);
    base.join("HHMM").join("cache")
}

fn cache_file() -> PathBuf {
    cache_dir().join("workshop_meta.json")
}

fn now_secs() -> i64 {
    use std::time::{SystemTime, UNIX_EPOCH};
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_secs() as i64)
        .unwrap_or(0)
}

pub fn read_cache() -> HashMap<String, WorkshopMeta> {
    let Ok(s) = std::fs::read_to_string(cache_file()) else {
        return HashMap::new();
    };
    match serde_json::from_str(&s) {
        Ok(m) => m,
        Err(e) => {
            log::warn!("workshop meta cache corrupt, ignoring: {}", e);
            HashMap::new()
        }
    }
}

fn write_cache(map: &HashMap<String, WorkshopMeta>) {
    if let Ok(s) = serde_json::to_string_pretty(map) {
        if let Err(e) = crate::fsx::atomic_write(&cache_file(), s.as_bytes()) {
            log::warn!("workshop meta cache write failed: {}", e);
        }
    }
}

fn cache_lock() -> &'static Mutex<()> {
    static LOCK: OnceLock<Mutex<()>> = OnceLock::new();
    LOCK.get_or_init(|| Mutex::new(()))
}

pub async fn fetch_meta(item_ids: &[String]) -> HashMap<String, WorkshopMeta> {
    let snapshot = read_cache();
    let client = match reqwest::Client::builder()
        .connect_timeout(std::time::Duration::from_secs(8))
        .timeout(std::time::Duration::from_secs(15))
        .build()
    {
        Ok(c) => c,
        Err(e) => {
            log::warn!("http client init failed, serving cached workshop meta: {}", e);
            return snapshot;
        }
    };
    let now = now_secs();
    const TTL_SECS: i64 = 10 * 60;

    let missing: Vec<&String> = item_ids
        .iter()
        .filter(|id| match snapshot.get(*id) {
            None => true,
            Some(m) => {
                let ttl_expired = m
                    .fetched_at
                    .map_or(true, |t| now.saturating_sub(t) > TTL_SECS);
                if m.title.is_empty() {
                    ttl_expired
                } else {
                    m.creator.is_none() || ttl_expired
                }
            }
        })
        .collect();
    let (fetched_details, query_ok) = if missing.is_empty() {
        (HashMap::new(), false)
    } else {
        match query_steam(&client, &missing).await {
            Ok(d) => (d, true),
            Err(e) => {
                log::warn!(
                    "workshop details fetch failed ({} items), falling back to cache: {}",
                    missing.len(),
                    e
                );
                (HashMap::new(), false)
            }
        }
    };

    let creator_of = |id: &str| -> Option<String> {
        fetched_details
            .get(id)
            .and_then(|m| m.creator.clone())
            .or_else(|| snapshot.get(id).and_then(|m| m.creator.clone()))
    };
    let mut need: Vec<String> = Vec::new();
    for id in item_ids {
        if snapshot.get(id).map_or(false, |m| m.author.is_some()) {
            continue;
        }
        if let Some(cr) = creator_of(id) {
            if !need.contains(&cr) {
                need.push(cr);
            }
        }
    }
    let fetched = futures_util::future::join_all(
        need.iter()
            .map(|sid| async { (sid.clone(), fetch_author(&client, sid).await) }),
    )
    .await;
    let mut names: HashMap<String, String> = HashMap::new();
    for (sid, name) in fetched {
        if let Some(n) = name {
            names.insert(sid, n);
        }
    }
    if names.len() < need.len() {
        log::warn!(
            "author lookup failed for {}/{} profiles (steamcommunity unreachable or profile private)",
            need.len() - names.len(),
            need.len()
        );
    }

    let _guard = cache_lock().lock().unwrap_or_else(|e| e.into_inner());
    let mut cache = read_cache();
    if query_ok {
        for id in &missing {
            if fetched_details.contains_key(id.as_str()) {
                continue;
            }
            let entry = cache.entry((*id).clone()).or_insert_with(|| WorkshopMeta {
                title: String::new(),
                preview_url: None,
                time_created: None,
                time_updated: None,
                creator: None,
                author: None,
                fetched_at: None,
            });
            entry.fetched_at = Some(now);
        }
    }
    for (k, v) in fetched_details {
        let prev_author = cache.get(&k).and_then(|m| m.author.clone());
        cache.insert(
            k,
            WorkshopMeta {
                author: prev_author,
                fetched_at: Some(now),
                ..v
            },
        );
    }
    for v in cache.values_mut() {
        if v.author.is_none() {
            if let Some(cr) = &v.creator {
                if let Some(n) = names.get(cr) {
                    v.author = Some(n.clone());
                }
            }
        }
    }
    write_cache(&cache);
    cache
}

async fn query_steam(
    client: &reqwest::Client,
    ids: &[&String],
) -> Result<HashMap<String, WorkshopMeta>, String> {
    let mut body = format!("itemcount={}", ids.len());
    for (i, id) in ids.iter().enumerate() {
        body.push_str(&format!("&publishedfileids[{}]={}", i, id));
    }

    let resp = client
        .post(ENDPOINT)
        .header("Content-Type", "application/x-www-form-urlencoded")
        .body(body)
        .send()
        .await
        .map_err(|e| e.to_string())?;
    if !resp.status().is_success() {
        return Err(format!("HTTP {}", resp.status()));
    }
    let text = resp.text().await.map_err(|e| e.to_string())?;
    let json: serde_json::Value = serde_json::from_str(&text).map_err(|e| e.to_string())?;

    let details = json
        .get("response")
        .and_then(|r| r.get("publishedfiledetails"))
        .and_then(|d| d.as_array())
        .ok_or_else(|| "unexpected response shape".to_string())?;

    let app_id: u64 = APP_ID.parse().unwrap_or(0);
    let mut out = HashMap::new();
    for d in details {
        if d.get("consumer_app_id").and_then(|v| v.as_u64()) != Some(app_id) {
            continue;
        }
        let Some(id) = d.get("publishedfileid").and_then(|v| v.as_str()) else {
            continue;
        };
        let title = d
            .get("title")
            .and_then(|v| v.as_str())
            .unwrap_or("")
            .to_string();
        if title.is_empty() {
            continue;
        }
        out.insert(
            id.to_string(),
            WorkshopMeta {
                title,
                preview_url: d
                    .get("preview_url")
                    .and_then(|v| v.as_str())
                    .map(|s| s.to_string()),
                time_created: d.get("time_created").and_then(|v| v.as_i64()),
                time_updated: d.get("time_updated").and_then(|v| v.as_i64()),
                creator: d
                    .get("creator")
                    .and_then(|v| v.as_str())
                    .map(|s| s.to_string()),
                author: None,
                fetched_at: None,
            },
        );
    }
    Ok(out)
}

async fn fetch_author(client: &reqwest::Client, steamid64: &str) -> Option<String> {
    let url = format!("https://steamcommunity.com/profiles/{}/?xml=1", steamid64);
    let resp = client
        .get(&url)
        .header("User-Agent", "Mozilla/5.0 HHMM")
        .send()
        .await
        .ok()?;
    if !resp.status().is_success() {
        return None;
    }
    let text = resp.text().await.ok()?;
    parse_steam_id_tag(&text)
}

fn parse_steam_id_tag(xml: &str) -> Option<String> {
    let start = xml.find("<steamID>")? + "<steamID>".len();
    let rest = &xml[start..];
    let end = rest.find("</steamID>")?;
    let inner = rest[..end].trim();
    let name = inner
        .strip_prefix("<![CDATA[")
        .and_then(|s| s.strip_suffix("]]>"))
        .unwrap_or(inner)
        .trim();
    if name.is_empty() {
        None
    } else {
        Some(name.to_string())
    }
}
