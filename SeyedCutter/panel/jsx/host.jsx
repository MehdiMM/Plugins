// SeyedCutter host.jsx v0.9 - CUT ONLY (Ctrl+Shift+K) + PAINT RED, NOTHING REMOVED.

function seyedLog(msg) {
    try { app.setSDKEventMessage(msg, "info"); } catch(e) {}
}

function seyedToTicks(seconds) {
    return Math.round(seconds * 254016000);
}

function seyedGetFPS(seq, qseq) {
    try { if (qseq && qseq.frameRate) return parseFloat(qseq.frameRate); } catch(e) {}
    try { if (qseq && qseq.framerate) return parseFloat(qseq.framerate); } catch(e) {}
    try {
        var s = seq.getSettings();
        if (s && s.videoFrameRate) {
            // may be a TickTime; try .seconds inverse or float
            var f = parseFloat(s.videoFrameRate);
            if (f > 0 && f < 130) return f;
        }
    } catch(e) {}
    return 25;
}

function seyedSecondsToTC(seconds, fps) {
    if (fps <= 0) fps = 25;
    var f = Math.round((seconds - Math.floor(seconds)) * fps);
    var s = Math.floor(seconds);
    var h = Math.floor(s / 3600); s -= h * 3600;
    var m = Math.floor(s / 60); s -= m * 60;
    function p2(n) { return (n < 10 ? "0" : "") + n; }
    return p2(h) + ":" + p2(m) + ":" + p2(s) + ":" + p2(f);
}

// Premiere 2025 label palette is 0-15. Old code used 1 (looks like default, invisible).
// SilenceRemover used 9=yellow. For RED use 6 (Red/Rose). Change if your theme differs.
var SEYED_RED = 6;

function seyedDeselectAll(seq) {
    try {
        var vn = seq.videoTracks.numTracks, an = seq.audioTracks.numTracks;
        for (var vi = 0; vi < vn; vi++) {
            try {
                var vt = seq.videoTracks[vi];
                for (var ci = 0; ci < vt.clips.numItems; ci++) {
                    try { vt.clips[ci].setSelected(0, 0); } catch(e) {}
                }
            } catch(eT) {}
        }
        for (var ai = 0; ai < an; ai++) {
            try {
                var at = seq.audioTracks[ai];
                for (var cj = 0; cj < at.clips.numItems; cj++) {
                    try { at.clips[cj].setSelected(0, 0); } catch(e2) {}
                }
            } catch(eT2) {}
        }
    } catch(e) {}
}

function seyedTrySetRed(clip) {
    var lastErr = "";
    // 1) timeline clip itself - this is what shows in timeline (like SilenceRemover yellow)
    try {
        if (clip && clip.setColorLabel) {
            clip.setColorLabel(SEYED_RED);
            try {
                if (clip.getColorLabel && clip.getColorLabel() === SEYED_RED) return { ok: true, via: "clip" };
            } catch(eV) {}
            return { ok: true, via: "clip" };
        } else { lastErr = "clip.setColorLabel missing"; }
    } catch(e) { lastErr = e.toString(); }
    // 2) source project item fallback
    try {
        if (clip && clip.projectItem && clip.projectItem.setColorLabel) {
            clip.projectItem.setColorLabel(SEYED_RED);
            return { ok: true, via: "source" };
        }
    } catch(e2) { lastErr += " | src:" + e2.toString(); }
    return { ok: false, err: lastErr };
}

function seyedSelectClip(clip) {
    try { clip.setSelected(1, 1); return true; } catch(e1) {}
    try { clip.setSelected(true, true); return true; } catch(e2) {}
    return false;
}

function seyedSelectAll(seq) {
    var n = 0;
    var vn = 0, an = 0;
    try { vn = seq.videoTracks.numTracks; } catch(e) {}
    try { an = seq.audioTracks.numTracks; } catch(e) {}
    for (var vi = 0; vi < vn; vi++) {
        try {
            var vt = seq.videoTracks[vi];
            for (var ci = 0; ci < vt.clips.numItems; ci++) {
                try { vt.clips[ci].setSelected(1, 1); n++; } catch(e1) {
                    try { vt.clips[ci].setSelected(true, true); n++; } catch(e2) {}
                }
            }
        } catch(eT) {}
    }
    for (var ai = 0; ai < an; ai++) {
        try {
            var at = seq.audioTracks[ai];
            for (var cj = 0; cj < at.clips.numItems; cj++) {
                try { at.clips[cj].setSelected(1, 1); n++; } catch(e3) {
                    try { at.clips[cj].setSelected(true, true); n++; } catch(e4) {}
                }
            }
        } catch(eT2) {}
    }
    return n;
}

function seyedRazorAt(qseq, seconds, ticks, tcStr) {
    var errs = [];
    // 1) Time object from ticks (best 2019-2026)
    try {
        var t1 = new Time();
        t1.ticks = ticks.toString();
        qseq.razor(t1);
        return { ok: true, via: "Time-ticks" };
    } catch(e1) { errs.push("Time-ticks:" + e1.toString()); }
    // 2) Time object from seconds
    try {
        var t2 = new Time();
        t2.seconds = seconds;
        qseq.razor(t2);
        return { ok: true, via: "Time-sec" };
    } catch(e2) { errs.push("Time-sec:" + e2.toString()); }
    // 3) timecode string HH:MM:SS:FF (DeadAir method)
    try { qseq.razor(tcStr); return { ok: true, via: "tc" }; }
    catch(e3) { errs.push("tc:" + e3.toString()); }
    // 4) ticks string
    try { qseq.razor(ticks.toString()); return { ok: true, via: "ticks-str" }; }
    catch(e4) { errs.push("ticks-str:" + e4.toString()); }
    // 5) ticks number
    try { qseq.razor(ticks); return { ok: true, via: "ticks-num" }; }
    catch(e5) { errs.push("ticks-num:" + e5.toString()); }
    // 6) seconds float
    try { qseq.razor(seconds); return { ok: true, via: "sec-num" }; }
    catch(e6) { errs.push("sec-num:" + e6.toString()); }
    return { ok: false, err: errs.join(" | ") };
}

function seyedCutFromCSVText(csvText, withMarkers) {
    try {
        var ranges = [];
        var lines = String(csvText).split("\n");
        for (var li = 0; li < lines.length; li++) {
            var ln = lines[li];
            if (!ln) continue;
            var parts = ln.split("|");
            if (parts.length < 2) continue;
            var s = parseFloat(parts[0]);
            var e = parseFloat(parts[1]);
            if (isNaN(s) || isNaN(e) || e <= s) continue;
            var lb = parts.length >= 3 ? parts[2] : ("Cut " + (ranges.length + 1));
            ranges.push({ start: s, end: e, label: lb });
        }
        if (!ranges.length) return "ERROR: empty cut list (parsed 0 ranges)";
        var seq = app.project.activeSequence;
        if (!seq) return "ERROR: No active sequence. Click a sequence in Timeline first.";
        var cuts = [];
        for (var i = 0; i < ranges.length; i++) {
            cuts.push(ranges[i].start); cuts.push(ranges[i].end);
        }
        cuts.sort(function(a,b){return a-b;});
        var uniq = [];
        for (var k = 0; k < cuts.length; k++) {
            if (k === 0 || Math.abs(cuts[k] - cuts[k-1]) > 0.001) uniq.push(cuts[k]);
        }

        // 1) SELECT ALL items in sequence first (as requested)
        var selCount = seyedSelectAll(seq);

        // 2) CUT whole scene at every boundary = Ctrl+Shift+K on all tracks
        var razorOK = 0, razorFail = 0, firstErr = "", viaUsed = "";
        var fps = 25;
        try {
            app.enableQE();
            var qseq = qe.project.getActiveSequence();
            if (!qseq) return "ERROR: QE active sequence is null. Click inside the Timeline panel, then retry. Selected:" + selCount;
            fps = seyedGetFPS(seq, qseq);
            for (var c = 0; c < uniq.length; c++) {
                var sec = uniq[c];
                var tk = seyedToTicks(sec);
                var tc = seyedSecondsToTC(sec, fps);
                var rr = seyedRazorAt(qseq, sec, tk, tc);
                if (rr && rr.ok) { razorOK++; if (!viaUsed) viaUsed = rr.via; }
                else { razorFail++; if (!firstErr) firstErr = (rr ? rr.err : "unknown"); }
            }
        } catch(eR) {
            return "ERROR QE razor: " + eR.toString();
        }

        // 3) SilenceRemover-style: deselect all, SELECT in-between clips by start-end, then paint RED
        seyedDeselectAll(seq);
        var painted = 0, paintedSrc = 0, paintFail = 0, firstPaintErr = "", selected = 0;
        var tol = 0.04;
        var vn = 0, an = 0;
        try { vn = seq.videoTracks.numTracks; } catch(e) {}
        try { an = seq.audioTracks.numTracks; } catch(e) {}
        for (var vi = 0; vi < vn; vi++) {
            try {
                var vt = seq.videoTracks[vi];
                for (var ci = 0; ci < vt.clips.numItems; ci++) {
                    try {
                        var cl = vt.clips[ci];
                        var cs = cl.start.seconds, ce = cl.end.seconds;
                        for (var r = 0; r < ranges.length; r++) {
                            if (cs >= ranges[r].start - tol && ce <= ranges[r].end + tol) {
                                seyedSelectClip(cl); selected++;
                                var pr0 = seyedTrySetRed(cl); if (pr0 && pr0.ok) { painted++; if (pr0.via === "source") paintedSrc++; } else { paintFail++; if (!firstPaintErr && pr0) firstPaintErr = pr0.err; }
                                break;
                            }
                            // fallback: middle inside (for uncut long clips)
                            var mid = (cs + ce) / 2;
                            if (mid >= ranges[r].start && mid <= ranges[r].end) {
                                seyedSelectClip(cl); selected++;
                                var pr0 = seyedTrySetRed(cl); if (pr0 && pr0.ok) { painted++; if (pr0.via === "source") paintedSrc++; } else { paintFail++; if (!firstPaintErr && pr0) firstPaintErr = pr0.err; }
                                break;
                            }
                        }
                    } catch(eC) {}
                }
            } catch(eT) {}
        }
        for (var ai = 0; ai < an; ai++) {
            try {
                var at = seq.audioTracks[ai];
                for (var cj = 0; cj < at.clips.numItems; cj++) {
                    try {
                        var ca = at.clips[cj];
                        var cs2 = ca.start.seconds, ce2 = ca.end.seconds;
                        for (var r2 = 0; r2 < ranges.length; r2++) {
                            if (cs2 >= ranges[r2].start - tol && ce2 <= ranges[r2].end + tol) {
                                seyedSelectClip(ca); selected++;
                                var pr1 = seyedTrySetRed(ca); if (pr1 && pr1.ok) { painted++; if (pr1.via === "source") paintedSrc++; } else { paintFail++; if (!firstPaintErr && pr1) firstPaintErr = pr1.err; }
                                break;
                            }
                            var mid2 = (cs2 + ce2) / 2;
                            if (mid2 >= ranges[r2].start && mid2 <= ranges[r2].end) {
                                seyedSelectClip(ca); selected++;
                                var pr1 = seyedTrySetRed(ca); if (pr1 && pr1.ok) { painted++; if (pr1.via === "source") paintedSrc++; } else { paintFail++; if (!firstPaintErr && pr1) firstPaintErr = pr1.err; }
                                break;
                            }
                        }
                    } catch(eC2) {}
                }
            } catch(eT2) {}
        }

        var msg = "SeyedCutter DONE\nRanges: " + ranges.length
            + "\nInitially selected: " + selCount + "\nRange clips selected: " + selected
            + "\nCuts attempted: " + uniq.length + " (ok:" + razorOK + " fail:" + razorFail + (viaUsed ? " via:" + viaUsed : "") + " fps:" + fps + ")"
            + "\nClips painted RED: " + painted + " (timeline:" + (painted - paintedSrc) + " via-source:" + paintedSrc + " fail:" + paintFail + ")"
            + "\nNOTHING REMOVED - cut only + red.";
        if (razorFail > 0 && firstErr) msg += "\nFirst razor error: " + firstErr;
        if (paintFail > 0 && firstPaintErr) msg += "\nFirst paint error: " + firstPaintErr;
        seyedLog(msg);
        return msg;
    } catch(e) {
        return "ERROR: " + e.toString();
    }
}

function seyedCutFromJSON(jsonStr, withMarkers) {
    return "Please reload SeyedCutter panel - old version used JSON which ExtendScript does not support.";
}
