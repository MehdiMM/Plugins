#!/usr/bin/env python3
"""Remove SeyedCutter."""
import os, shutil, platform
name = "SeyedCutter"
s = platform.system()
h = os.path.expanduser("~")
if s == "Windows":
    d = os.path.join(os.environ.get("APPDATA", h), "Adobe", "CEP", "extensions", name)
else:
    d = os.path.join(h, "Library", "Application Support", "Adobe", "CEP", "extensions", name)
print("Removing:", d)
shutil.rmtree(d, ignore_errors=True)
print("Done. Restart Premiere.")
