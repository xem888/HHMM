# Changelog

All notable changes to HHMM are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/); versions follow [SemVer](https://semver.org/).

## [1.3.0] - 2026-09-19

### Added
- **Mods with sub-folders and multiple dlls are now fully supported.** A Workshop mod is installed as its whole file tree — models, textures, sounds and helper dlls in sub-folders included — at exactly the same paths the in-game Mod Browser uses, so both tools always agree on what is installed. Previously only the top-level files were copied, which left asset-heavy mods half installed
  - Mods that were half installed by an older HHMM show up as **Update available**; one click completes them
  - Disabling or uninstalling moves/removes the whole tree and cleans up emptied folders — nothing is left behind in `plugins`
  - Mods you placed manually in their own sub-folder (`plugins/SomeMod/…`) now appear in the list and are managed as one unit
  - Files shared by two installed mods are kept until the last of them is removed; a same-named file with different content is refused with a clear message instead of being silently overwritten
- Zip install keeps the archive's folder structure (it used to flatten everything and refused archives containing the same file name in different folders); a wrapping folder or a `BepInEx/plugins/` prefix inside the zip is detected automatically
- **Update detection looks at the whole mod, not just the dll**: an author updating only a texture or a translation file is now noticed — while files you (or the mod) changed after installing are never treated as an update and are not overwritten when the author did not touch them
- Setting **display names**: mods can ship translated setting names (`labels`) next to the descriptions in their `.hhmm-i18n.json`; the config editor shows them and keeps the raw key as a tooltip. Existing translation files keep working unchanged
- Uninstalling asks for confirmation; manually installed mods get a stronger warning because HHMM has no copy to reinstall from

### Fixed
- **The window no longer freezes while mods are being scanned, installed or toggled** — with many or large mods (or a slow disk) the first load could take long enough for Windows to mark the window "Not Responding"; this work now runs in the background
- **Drag & drop install works on every page** — it only reacted on the My Mods page before
- Applying a profile no longer deletes manually installed mods that are not part of it — they are disabled instead (they could not be restored, not even from the automatic backup)
- Quitting from the tray menu now asks about unsaved config changes, like closing the window does
- "Open config" could jump to another mod's config when one mod name contained the other (`Stack` vs `StackCustomizer`)
- Config files saved with a UTF-8 BOM: changes to settings in the first section were reported as saved but never written
- Launching the game waits for a running install/profile operation to finish instead of starting on a half-written mod folder
- The BepInEx deploy button could stay in its loading state forever if the progress subscription failed
- Moving a file across drives could delete a pre-existing target when the rollback ran; copies are now written to a temporary name first, so an interrupted copy never leaves a truncated dll

### Changed
- First mod-list load is about 40% faster (hashing)
- Drag & drop / browse installs are written to the log (file name, result or the reason for a refusal), so "I dropped it and nothing happened" reports can be diagnosed
- Translation files with only other tools' blocks (e.g. Mod Menu's) are skipped quietly instead of logging a "bad format" warning

## [1.2.0] - 2026-07-04

### Added
- **Required-setting guard (HideManagerGameObject)**: Human Host silently loads no BepInEx mod unless `[Chainloader] HideManagerGameObject = true` is set in `BepInEx.cfg` — the single most common trap for new players. HHMM now handles it end to end:
  - Deploying BepInEx pre-creates a minimal `BepInEx.cfg` with the setting enabled (the official zip ships no config; BepInEx fills in the remaining defaults on first launch) — fresh installs never hit the trap, and no "launch the game once first" dance is needed
  - The dashboard shows a red banner with a one-click **Fix** button whenever the setting is off or the config file is missing (covers hand-installed BepInEx, manual edits, and old profiles bringing `false` back); dismissible per session; fixing is always an explicit click, never a silent background write
  - Applying a profile re-checks the setting immediately and offers an inline fix action in the toast
  - New profile snapshots normalize the stored `BepInEx.cfg` so a profile can never re-import the broken state
- Retry button on the mod-list error card now shows a spinner and reports failures (and succeeding actually clears the error instead of leaving the card up)

### Fixed
- **Duplicate-dll invariant**: a mod's dll can no longer exist in `plugins` and `disabled` at the same time. All three install paths (manual dll/zip, Workshop install/update, profile apply) now resolve the target side from what's actually on disk (a mod you disabled stays disabled when you drop a newer dll on the window) and clean up the other side afterwards — previously this state made the UI show the opposite of what the game actually loaded, and "enable" could silently roll a fresh install back to the old version
- Installed-mod scan matches dll extensions case-insensitively (`MOD.DLL` installed fine but then never appeared in the list — impossible to disable or uninstall while BepInEx kept loading it); same fix applied to `.cfg` listing and profile snapshots
- Installing a zip validates first, writes second: a zip without any dll now fails **before** touching the disk (previously its readme/textures were already scattered into `plugins` as unremovable orphans); entries are extracted to memory and written only after the whole archive read cleanly
- Toggling a mod now moves the same file set that installing it copied (Workshop source manifest) — updating a disabled mod then enabling it no longer leaves its newer data files stranded on the wrong side
- The automatic pre-apply backup profile now uses an internal id that user profile names can never collide with — applying any profile used to silently overwrite a user profile literally named "backup"; a failed backup is also reported in the apply result instead of being swallowed
- Uninstalling or toggling mod X no longer moves/deletes data files belonging to a sibling mod named `X_Something` (ownership now goes to the longest matching dll name)
- Batch update ("Update all") re-validates against the disk instead of trusting a possibly stale plan from the UI
- Int32 settings round fractional input on blur (saving `1.5` made BepInEx silently fall back to the default); dynamic list numbers get the same empty-value guard as regular number inputs
- Toggle switches recognize `True`/`TRUE` as on (hand-edited configs showed "off" while the game had the feature enabled)
- Sections with full metadata are no longer force-converted to a numeric-only dynamic list just for being large (60 boolean flags rendered as blank number boxes); `Double`/`Int64`-style settings get proper number controls instead of an empty dropdown
- Config files saved with a UTF-8 BOM parse correctly (plugin name/version no longer vanish; a BOM before a section header no longer hides the whole section); unreadable (non-UTF-8) configs are logged instead of silently disappearing from the editor and profile snapshots
- Key capture supports the OEM row (comma, period, brackets, slash, quotes, minus/equals, backquote, numpad operators…) — pressing them previously did nothing and the control looked frozen
- Saving a config while switching files can no longer paint the previous file's content under the new file's highlight
- Russian and Polish counts use their full plural forms (2/5 items showed English text; the key checker now understands CLDR plural suffixes)
- Legacy disabled-folder migration runs once at startup under the file-operation lock instead of on every list refresh without it
- Launching the game no longer flashes a console window; Settings deploy progress toast no longer mixes English phase names into translated text; deleted/hidden Workshop items no longer trigger a metadata re-request on every refresh; second app instances now surface the existing window (matters with close-to-tray); temp files from atomic writes are cleaned up on all failure paths; profile names matching Windows reserved device names (`con`, `nul`, …) no longer fail with cryptic IO errors; file names containing `..` are no longer rejected as path traversal; the import dialog accepts `.zip` (drag & drop always did)

## [1.1.0] - 2026-06-10

### Added
- **Mod-shipped config description translations** (`<DllStem>.hhmm-i18n.json`): mod authors can bundle translated descriptions for their config entries with the mod itself — distributed through the Workshop, picked up from the installed folders (plugins + disabled), so translations survive unsubscribing and never require an HHMM update. Lookup order: mod-shipped → HHMM's built-in table → English original. Spec: `docs/mod-cfg-i18n-spec.md`. Quick Dismantle ships the first one (13 languages)
- Manually-set game paths persist across restarts (see Fixed for the full detection rework)

### Fixed
- Game detection rework (verified live): "game not found" is now a normal state instead of an error — Settings/Dashboard render normally with a reachable "Set manually" button rather than being replaced by an error card (previously that card only offered a futile Retry, locking out users with non-standard install locations); the dashboard BepInEx card shows "not set" until a game path exists
- Manually-set game paths are now persisted and survive restarts; detection falls back Steam-auto → persisted manual path → not-found, so a refresh can no longer wipe a manually configured path back to "not set" (exactly the users auto-detection fails for); a negative detection also clears the backend's remembered path, so installs can no longer land in a ghost folder after the game was moved
- BepInEx deploy now extracts to a staging folder and swaps files in only after the whole archive succeeded — a corrupt download or full disk can no longer leave a half-deployed BepInEx; the swap also re-checks the game isn't running; if the swap itself is interrupted, the staging folder is kept for retry instead of being destroyed; concurrent deploys are rejected
- Installing a zip whose folders contain same-named files is now rejected up front instead of silently overwriting one with the other
- Workshop items containing several dlls are managed deterministically (alphabetical pick + warning log) instead of drifting with directory enumeration order; dll extension matching is now case-insensitive (`MOD.DLL` was skipped and mis-copied as a data file)
- Mutating mod operations (install / uninstall / toggle / batch sync / apply profile / manual install / config save / profile snapshot) are serialized behind a global lock — two concurrent commands can no longer interleave their multi-file move/delete sequences, a config save can no longer overwrite values a profile apply just restored, and a snapshot can no longer miss a dll mid-rename
- Config editor: changing a value back to its original no longer counts as an unsaved change; edits made while a save is in flight survive; empty/invalid number inputs revert on blur instead of being saveable; error toasts now show the real message (was "[object Object]" e.g. when saving while the game runs)
- All network requests now have timeouts (Steam metadata 15s, BepInEx download 120s) — a hung connection no longer leaves refresh/deploy spinning forever; Steam API responses are checked for HTTP status before parsing
- Config editor: Retry after a failed file load actually retries (was a no-op); rapid file switching can no longer show one file's content under another file's highlight (request sequencing)
- Config editor: KeyboardShortcut capture now writes valid Unity KeyCode names (digit keys wrote `1` instead of `Alpha1`, arrows wrote `ArrowUp` instead of `UpArrow` — BepInEx silently fell back to defaults)
- Closing the window or switching pages with unsaved config edits now asks for confirmation instead of silently discarding them
- Confirm dialog: focus moves into the dialog on open — Enter can no longer double-trigger the action that opened it; ESC no longer also closes the log viewer behind it; a second confirmation requested while one is open no longer leaves the first caller hanging forever
- Dashboard no longer flashes a red "BepInEx not detected" card during startup detection
- Title bar gets its own crash fallback (drag + minimize + close stay available) and the maximize button shows a proper restore icon when maximized
- "Game is running" rejections now show a translated explanation in toasts instead of raw English
- Install toast lists the dlls actually installed from an archive instead of guessing from the file name
- Log commands now return the same structured error shape as every other command
- Workshop mod update times could display up to 7 days stale (details cache TTL was 7 days; now 10 minutes — the "update available" badge was never affected as it compares file hashes)
- Workshop metadata network failures are now logged (previously silent: a failed fetch made the mod list fall back to dll filenames with no trace in the log viewer)
- Mod data files whose case differs from the dll name are now moved/removed together with the dll on toggle/uninstall (prefix match is case-insensitive, matching Windows filesystem semantics)
- Uninstalling a workshop mod now removes every file the install copied (using the workshop source dir as the manifest) — non-prefixed files like readme/icons no longer pile up as orphans in plugins; unsubscribed (Local) mods keep the previous prefix-based behavior
- Creating a profile no longer silently overwrites an existing one when two different names sanitize to the same storage id
- A successful mod operation is no longer reported as failed when only the follow-up list refresh failed
- Dismissing the dashboard error card no longer hides future errors; late deploy progress events no longer overwrite the final result toast
- "Update available" notifications no longer stack when both startup and manual checks find one
- The displayed app version is now read from the app itself instead of hardcoded copies (release checklist shrinks to three files)

### Performance
- Mod list refresh no longer re-hashes every dll when nothing changed (per-file metadata cache); game-running poll only re-checks the cached PID while the game runs, pauses while the window is hidden in the tray, and refreshes immediately when it becomes visible again
- Dashboard glow cards no longer re-render the whole card tree on every mouse move (CSS-variable driven, rAF-throttled); click sparks stop their render loop when idle and stay crisp across monitors with different DPI scaling
- Mod rows past 100 skip offscreen layout/paint and drop the staggered entrance (small lists keep the full hover treatment)
- Title bar no longer floods IPC with maximize-state queries while the window is being resized
- Release binary built with LTO + size optimization + symbol stripping; MSI no longer built (NSIS only)

### Internal
- Test suite grown from 27 to 58: atomic file writes/moves, profile apply diff logic (extracted into a pure function), Steam library/manifest parsing, profile name sanitization and legacy-format degradation, cached hashing
- Atomic-write temp files no longer collide for same-stem files (a.cfg / a.json); workshop cache writes are atomic; tray icon failure no longer aborts startup; io errors keep their ErrorKind in logs

### Security
- Strict Content-Security-Policy in production (frontend locked to bundled assets + Tauri IPC; all networking lives in the Rust backend)
- Removed the passwordless legacy signing key backup from the working tree

## [1.0.0] - 2026-06-07

Initial public release.

- One-click sync of subscribed Workshop mods into the game's plugins folder
- Per-mod enable / disable (disabled mods live outside `plugins/` — BepInEx loads recursively)
- Visual config editor with type-aware controls (sliders, toggles, key capture, dynamic item lists) and byte-faithful round-trip writes
- "Open raw config" escape hatch for advanced users (opens in Notepad)
- One-click BepInEx 5.4.23.2 deployment with SHA-256 download verification and version-compatibility banner (4 tiers, 6.x flagged incompatible)
- Config profiles: full-environment snapshots (mod set + all config values) with one-click apply and automatic pre-apply backup
- Drag & drop install of local `.dll` / `.zip` mods, plus a persistent Import button
- Workshop titles and author names (7-day cache TTL, graceful offline degradation)
- 14 languages, light / dark theme, custom title bar, system tray, window-state memory
- Automatic self-update via signed GitHub releases (minisign)
- In-app log viewer (tail 256KB, copy / open folder / clear)

Distribution: [Steam Workshop](https://steamcommunity.com/sharedfiles/filedetails/?id=3740140784) + GitHub Releases.
