# SeyedCutter

![SeyedCutter logo](SeyedCutter/panel/assets/logo.webp)

Premiere Pro CEP panel extension - **CSV cutter, Cut and Select** - cut only + paint RED, nothing removed.

This repo currently contains only **SeyedCutter**. Full docs live in [`SeyedCutter/`](SeyedCutter/).

## What it does

- Load a CSV cut-list (`start_seconds,end_seconds,start_tc,end_tc,label`)
- Preview ranges
- Razor the active sequence at every in/out boundary (Ctrl+Shift+K equivalent)
- Paint those range clips RED (`setColorLabel(6)`)
- Nothing is deleted, moved, or reordered. No key required.

See [`SeyedCutter/README.md`](SeyedCutter/README.md) for full usage, file map, and requirements.

## Quick start

1. See [`SeyedCutter/HELP.md`](SeyedCutter/HELP.md) for install paths (Mac + Windows)
2. Restart Premiere → `Window > Extensions > SeyedCutter`
3. Focus your sequence → choose CSV → Preview → **Cut sequence + Paint RED**

## Version

- `SeyedCutter 0.9.0` - tags `seyedcutter-v0.9`, `seyedcutter-v0.9.0`
