# SeyedCutter v0.9

![SeyedCutter logo](panel/assets/logo.webp)

Premiere Pro CEP panel extension - **CSV cutter, cut only + paint RED, nothing removed.**

## What it does

You give SeyedCutter a CSV cut-list with time ranges. It:

1. **Loads a CSV** with columns:
   ```
   start_seconds,end_seconds,start_tc,end_tc,label
   62,65,00:01:02:00,00:01:05:00,Opening
   ```
   Only `start_seconds`, `end_seconds`, and `label` are used. `label` may contain commas.

2. **Preview** - shows how many ranges were parsed and lists them (`1. 62s -> 65s : Opening`).

3. **Cut sequence (Ctrl+Shift+K equivalent) + Paint RED:**
   - Selects ALL clips in the active sequence
   - Cuts the whole timeline at every unique start/end boundary using `qe.project.getActiveSequence().razor()` with fallbacks:
     - `Time` object from ticks (`seconds * 254016000`)
     - `Time` object from seconds
     - timecode string `HH:MM:SS:FF`
     - ticks string / number / seconds float
   - Deselects all, then re-selects only clips whose start/end (or middle) falls inside a CSV range
   - Paints those range clips **RED** (`setColorLabel(6)`) - timeline clip first, source `projectItem` as fallback
   - Reports: ranges, cuts attempted ok/fail, clips painted RED, first razor/paint errors

4. **Does NOT:**
   - Delete, ripple-delete, close, move, or reorder anything
   - Create markers (removed by design - cut only)
   - Require a key, registration, or network

## Files

- `CSXS/manifest.xml` - CEP registration: `com.seyed.cutter.panel`, Menu `SeyedCutter`, PPRO `[9.0,99.9]`
- `panel/panel.html` + `panel/panel.css` - UI
- `panel/assets/logo.webp` (+ `logo.png`) - extension logo
- `panel/js/main.js` - CSV parse, builds `start|end|label` payload, calls `seyedCutFromCSVText()` via CEP
- `panel/jsx/host.jsx` - ExtendScript: `seyedCutFromCSVText()`, `seyedRazorAt()`, `seyedSelectAll()`, `seyedDeselectAll()`, `seyedTrySetRed()`
- `panel/js/CSInterface.js` - minimal CEP `evalScript` bridge
- `installer.py` / `Install-Mac.command` / `Install-Windows.bat` - copy + enable unsigned extensions
- `uninstall.py` - removes installed folder
- `HELP.md` - install help (Mac + Windows paths)

## Requirements

- Premiere Pro 2023 / 2024 / 2025 (PPRO 9.0+)
- Unsigned extensions enabled (PlayerDebugMode = 1) - see `HELP.md`
- An open sequence / timeline focused before cutting

## Quick use

1. Install (see `HELP.md`)
2. Restart Premiere → `Window > Extensions > SeyedCutter`
3. Click in Timeline on your sequence
4. Choose CSV → Preview → **Cut sequence + Paint RED**
5. Check status box in panel + Events panel in Premiere

## Install locations

- Mac per-user: `~/Library/Application Support/Adobe/CEP/extensions/SeyedCutter`
- Mac system: `/Library/Application Support/Adobe/CEP/extensions/SeyedCutter`
- Windows: `%APPDATA%\Adobe\CEP\extensions\SeyedCutter`

Full steps: see `HELP.md`.

## Version

- `0.9.0` - GitHub tag `seyedcutter-v0.9`
