SeyedCutter v0.9.0 - CSV cutter for Premiere Pro (like SilenceRemover, but manual)
================================================================
Does: Import CSV -> CUT active sequence at in/out -> paint those clips RED.
Does NOT: delete / ripple-delete / move anything.

FILES
- CSXS/manifest.xml : CEP registration (Menu: SeyedCutter)
- panel/panel.html : UI
- panel/jsx/host.jsx : ExtendScript that does the cutting
- Timecodes-CutList.csv : sample from fox folder

INSTALL (Premiere 2023/2024/2025, Mac)
1. Copy folder "SeyedCutter" to:
   /Library/Application Support/Adobe/CEP/extensions/
   (create extensions folder if missing. Needs admin sudo.)
   OR per-user (no admin, Premiere 2024+):
   ~/Library/Application Support/Adobe/CEP/extensions/
2. Enable unsigned extensions (required, since not signed):
   defaults write com.adobe.CSXS.9 PlayerDebugMode 1
   defaults write com.adobe.CSXS.10 PlayerDebugMode 1
   defaults write com.adobe.CSXS.11 PlayerDebugMode 1
3. Restart Premiere Pro.
4. Window > Extensions > SeyedCutter
5. Open your sequence, click Load / choose Timecodes-CutList.csv,
   then "Cut sequence + Paint RED".

CSV FORMAT (same as fox file)
start_seconds,end_seconds,start_tc,end_tc,label
62,65,00:01:02,00:01:05,Opening / entrance
... plugin only uses start_seconds + end_seconds + label.

WHAT IT DOES IN CODE
- app.enableQE() + qseq.addEdit(ticks) / track.razor(ticks) at every boundary
- loop videoTracks + audioTracks, if clip middle inside range -> clip.setColorLabel(1) = RED
- optional markers.createMarker(start/end) named CUT:/END:
- NO remove(), NO rippleDelete, NO closeClip.

UNINSTALL: delete the SeyedCutter folder from extensions/ and restart Premiere.
