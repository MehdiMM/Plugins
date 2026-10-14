# SeyedCutter — HELP / Install Guide (Mac + Windows)

## 1. What folder goes where?

You install the whole `SeyedCutter` folder (the one containing `CSXS/` + `panel/`) into Adobe's CEP extensions folder.

### Mac — per-user (recommended, no admin, Premiere 2024+)

```
~/Library/Application Support/Adobe/CEP/extensions/SeyedCutter
```

Full example:

```
/Users/YOU/Library/Application Support/Adobe/CEP/extensions/SeyedCutter/
  CSXS/manifest.xml
  panel/panel.html
  panel/jsx/host.jsx
  ...
```

### Mac — system-wide (all users, needs admin sudo)

```
/Library/Application Support/Adobe/CEP/extensions/SeyedCutter
```

Use this if per-user does not show up in older Premiere versions.

### Windows

```
%APPDATA%\Adobe\CEP\extensions\SeyedCutter
```

Full example:

```
C:\Users\YOU\AppData\Roaming\Adobe\CEP\extensions\SeyedCutter\
  CSXS\manifest.xml
  panel\panel.html
  panel\jsx\host.jsx
  ...
```

To open quickly on Windows: press `Win+R`, paste `%APPDATA%\Adobe\CEP\extensions`, press Enter.

## 2. Automatic install (easiest)

### Mac

1. Double-click `Install-Mac.command`
   - It runs `python3 installer.py`
   - Copies current folder → `~/Library/Application Support/Adobe/CEP/extensions/SeyedCutter`
   - Enables debug mode for CSXS 9/10/11
2. Restart Premiere Pro
3. `Window > Extensions > SeyedCutter`

Or in Terminal:

```bash
cd /path/to/SeyedCutter
python3 installer.py
```

### Windows

1. Double-click `Install-Windows.bat`
   - It runs `python installer.py`
   - Copies current folder → `%APPDATA%\Adobe\CEP\extensions\SeyedCutter`
   - Enables debug mode via registry
2. Restart Premiere Pro
3. `Window > Extensions > SeyedCutter`

## 3. Manual install

1. Create the extensions folder if missing:
   - Mac: `mkdir -p ~/Library/Application\ Support/Adobe/CEP/extensions`
   - Windows: create `%APPDATA%\Adobe\CEP\extensions`
2. Copy the `SeyedCutter` folder there (so `manifest.xml` ends up at `.../SeyedCutter/CSXS/manifest.xml`)
3. Enable unsigned extensions (required, extension is not signed):

   Mac (Terminal):
   ```bash
   defaults write com.adobe.CSXS.9 PlayerDebugMode 1
   defaults write com.adobe.CSXS.10 PlayerDebugMode 1
   defaults write com.adobe.CSXS.11 PlayerDebugMode 1
   ```

   Windows (CMD as current user):
   ```bat
   reg add HKCU\Software\Adobe\CSXS.9 /v PlayerDebugMode /t REG_SZ /d 1 /f
   reg add HKCU\Software\Adobe\CSXS.10 /v PlayerDebugMode /t REG_SZ /d 1 /f
   reg add HKCU\Software\Adobe\CSXS.11 /v PlayerDebugMode /t REG_SZ /d 1 /f
   ```

4. Restart Premiere Pro
5. `Window > Extensions > SeyedCutter`

## 4. Verify

- `CSXS/manifest.xml` exists in installed location
- In Premiere: `Window > Extensions` shows `SeyedCutter`
- Panel shows: `Ready. Open a sequence in Premiere first.`
- Click inside Timeline on your sequence before cutting
- Load CSV → Preview shows `Loaded xxx.csv : N ranges.`

## 5. Uninstall

- Run `python3 uninstall.py` (Mac) / `python uninstall.py` (Windows), or
- Manually delete:
  - Mac: `~/Library/Application Support/Adobe/CEP/extensions/SeyedCutter` (or `/Library/...` if you used system-wide)
  - Windows: `%APPDATA%\Adobe\CEP\extensions\SeyedCutter`
- Restart Premiere

## 6. Troubleshooting

- **Not in Window > Extensions:** debug flag missing, wrong folder level (must be `.../SeyedCutter/CSXS/manifest.xml`, not `.../extensions/CSXS/...`), or Premiere needs restart.
- **QE active sequence is null:** click inside Timeline panel to focus sequence, then retry.
- **ERROR: empty cut list:** CSV must have `start_seconds,end_seconds,...` with `end > start` numbers.
- **Cuts ok but 0 painted:** timeline clips did not align within 0.04s tolerance — check fps / timecode vs seconds.
- **Old JSON error:** reload panel — very old versions used JSON which ExtendScript does not support; v0.9 uses pipe-delimited text.
