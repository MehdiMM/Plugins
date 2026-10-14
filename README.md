# plugins

Collection of Premiere Pro CEP panel extensions.

## Plugins

| Plugin | Version | What it does |
|--------|---------|--------------|
| [SeyedCutter](SeyedCutter/) | `0.9.0` (tag `seyedcutter-v0.9`) | CSV cutter — cut only + paint RED, nothing removed. Load `start_seconds,end_seconds,...,label` CSV, razor timeline at every boundary, paint range clips RED. |

## Layout

```
plugins/
  SeyedCutter/       # each plugin is a top-level folder
    CSXS/manifest.xml
    panel/
    README.md        # what the plugin does
    HELP.md          # where to install (Mac + Windows)
    installer.py
  FuturePlugin/      # add next plugin the same way
```

## Versioning

Each plugin versions independently with tags:

```
<pluginname>-vX.Y   e.g. seyedcutter-v0.9, seyedcutter-v0.9.0
```

## Adding a new plugin

1. Copy your plugin folder in as `plugins/YourName/`
2. Include its own `README.md` + `HELP.md`
3. Commit, push, tag `yourname-v0.1`
