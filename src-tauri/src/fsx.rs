use crate::error::{AppError, AppResult};
use sha2::{Digest, Sha256};
use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};
use std::sync::{Mutex, MutexGuard, OnceLock};
use std::time::UNIX_EPOCH;

static FS_OP_LOCK: Mutex<()> = Mutex::new(());

pub fn op_lock() -> MutexGuard<'static, ()> {
    FS_OP_LOCK.lock().unwrap_or_else(|p| p.into_inner())
}

pub fn move_file(from: &Path, to: &Path) -> AppResult<()> {
    if let Some(parent) = to.parent() {
        fs::create_dir_all(parent)?;
    }
    match fs::rename(from, to) {
        Ok(()) => Ok(()),
        Err(_) => {
            fs::copy(from, to)?;
            if let Err(e) = fs::remove_file(from) {
                let _ = fs::remove_file(to);
                return Err(e.into());
            }
            Ok(())
        }
    }
}

pub fn copy_file(from: &Path, to: &Path) -> AppResult<()> {
    if let Some(parent) = to.parent() {
        fs::create_dir_all(parent)?;
    }
    fs::copy(from, to)?;
    Ok(())
}

fn sibling(path: &Path, suffix: &str) -> std::path::PathBuf {
    let name = path
        .file_name()
        .map(|n| n.to_string_lossy().into_owned())
        .unwrap_or_default();
    path.with_file_name(format!("{}.{}.{}", name, std::process::id(), suffix))
}

pub fn atomic_write(path: &Path, content: &[u8]) -> AppResult<()> {
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)?;
    }
    let tmp = sibling(path, "hhmm-tmp");
    if let Err(e) = fs::write(&tmp, content) {
        let _ = fs::remove_file(&tmp);
        return Err(e.into());
    }
    match fs::rename(&tmp, path) {
        Ok(()) => Ok(()),
        Err(_) => {
            let bak = sibling(path, "hhmm-bak");
            if path.exists() {
                if let Err(e) = fs::rename(path, &bak) {
                    let _ = fs::remove_file(&tmp);
                    return Err(e.into());
                }
            }
            match fs::rename(&tmp, path) {
                Ok(()) => {
                    let _ = fs::remove_file(&bak);
                    Ok(())
                }
                Err(e) => {
                    if bak.exists() {
                        let _ = fs::rename(&bak, path);
                    }
                    let _ = fs::remove_file(&tmp);
                    Err(e.into())
                }
            }
        }
    }
}

pub fn sha256_bytes(bytes: &[u8]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(bytes);
    format!("{:x}", hasher.finalize())
}

pub fn sha256_file(path: &Path) -> AppResult<String> {
    Ok(sha256_bytes(&fs::read(path)?))
}

static HASH_CACHE: OnceLock<Mutex<HashMap<PathBuf, (i64, u64, String)>>> = OnceLock::new();

pub fn sha256_file_cached(path: &Path) -> AppResult<String> {
    let meta = fs::metadata(path)?;
    let mt = meta
        .modified()?
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_secs() as i64)
        .unwrap_or(0);
    let sz = meta.len();
    let cache = HASH_CACHE.get_or_init(|| Mutex::new(HashMap::new()));
    {
        let g = cache.lock().unwrap_or_else(|p| p.into_inner());
        if let Some((m, s, h)) = g.get(path) {
            if *m == mt && *s == sz {
                return Ok(h.clone());
            }
        }
    }
    let h = sha256_file(path)?;
    cache
        .lock()
        .unwrap_or_else(|p| p.into_inner())
        .insert(path.to_path_buf(), (mt, sz, h.clone()));
    Ok(h)
}

pub fn mtime(path: &Path) -> AppResult<i64> {
    let meta = fs::metadata(path)?;
    let t = meta
        .modified()?
        .duration_since(UNIX_EPOCH)
        .map_err(|e| AppError::Other(e.to_string()))?;
    Ok(t.as_secs() as i64)
}

pub fn file_size(path: &Path) -> AppResult<u64> {
    Ok(fs::metadata(path)?.len())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn atomic_write_creates_new_file_with_parents() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("sub").join("a.cfg");
        atomic_write(&path, b"hello").unwrap();
        assert_eq!(fs::read(&path).unwrap(), b"hello");
    }

    #[test]
    fn atomic_write_overwrites_existing() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("a.cfg");
        atomic_write(&path, b"old").unwrap();
        atomic_write(&path, b"new content").unwrap();
        assert_eq!(fs::read(&path).unwrap(), b"new content");
    }

    #[test]
    fn atomic_write_leaves_no_tmp_or_bak() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("a.cfg");
        atomic_write(&path, b"x").unwrap();
        atomic_write(&path, b"y").unwrap();
        let leftovers: Vec<_> = fs::read_dir(dir.path())
            .unwrap()
            .filter_map(|e| e.ok())
            .filter(|e| {
                let n = e.file_name().to_string_lossy().into_owned();
                n.contains("hhmm-tmp") || n.contains("hhmm-bak")
            })
            .collect();
        assert!(leftovers.is_empty(), "leftover helper files: {:?}", leftovers);
    }

    #[test]
    fn atomic_write_same_stem_different_ext_no_collision() {
        let dir = tempfile::tempdir().unwrap();
        let cfg = dir.path().join("a.cfg");
        let json = dir.path().join("a.json");
        atomic_write(&cfg, b"cfg-content").unwrap();
        atomic_write(&json, b"json-content").unwrap();
        assert_eq!(fs::read(&cfg).unwrap(), b"cfg-content");
        assert_eq!(fs::read(&json).unwrap(), b"json-content");
        assert_ne!(sibling(&cfg, "hhmm-tmp"), sibling(&json, "hhmm-tmp"));
    }

    #[test]
    fn move_file_moves_and_creates_parent() {
        let dir = tempfile::tempdir().unwrap();
        let from = dir.path().join("plugins").join("m.dll");
        let to = dir.path().join("disabled").join("m.dll");
        fs::create_dir_all(from.parent().unwrap()).unwrap();
        fs::write(&from, b"dllbytes").unwrap();
        move_file(&from, &to).unwrap();
        assert!(!from.exists(), "source file should be gone after move");
        assert_eq!(fs::read(&to).unwrap(), b"dllbytes");
    }

    #[test]
    fn move_file_overwrites_target() {
        let dir = tempfile::tempdir().unwrap();
        let from = dir.path().join("new.dll");
        let to = dir.path().join("old.dll");
        fs::write(&from, b"new").unwrap();
        fs::write(&to, b"old").unwrap();
        move_file(&from, &to).unwrap();
        assert!(!from.exists());
        assert_eq!(fs::read(&to).unwrap(), b"new");
    }

    #[test]
    fn move_file_missing_source_errors() {
        let dir = tempfile::tempdir().unwrap();
        let from = dir.path().join("nope.dll");
        let to = dir.path().join("to.dll");
        assert!(move_file(&from, &to).is_err());
        assert!(!to.exists(), "must not leave a target file behind on failure");
    }

    #[test]
    fn sha256_known_vectors() {
        assert_eq!(
            sha256_bytes(b""),
            "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        );
        assert_eq!(
            sha256_bytes(b"abc"),
            "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
        );
    }

    #[test]
    fn sha256_file_matches_bytes() {
        let dir = tempfile::tempdir().unwrap();
        let p = dir.path().join("f.bin");
        fs::write(&p, b"abc").unwrap();
        assert_eq!(sha256_file(&p).unwrap(), sha256_bytes(b"abc"));
    }

    #[test]
    fn sha256_cached_consistent_and_tracks_content_change() {
        let dir = tempfile::tempdir().unwrap();
        let p = dir.path().join("m.dll");
        fs::write(&p, b"v1").unwrap();
        let h1 = sha256_file_cached(&p).unwrap();
        assert_eq!(h1, sha256_bytes(b"v1"));
        assert_eq!(sha256_file_cached(&p).unwrap(), h1);
        fs::write(&p, b"v2-longer").unwrap();
        assert_eq!(sha256_file_cached(&p).unwrap(), sha256_bytes(b"v2-longer"));
    }
}
