#!/usr/bin/env python3
"""SeyedCutter installer - no key, no registration, just copy + enable debug."""
import os, sys, shutil, subprocess, platform

EXT_NAME = "SeyedCutter"

def src_dir():
    return os.path.dirname(os.path.abspath(__file__))

def dest_dir():
    sysname = platform.system()
    home = os.path.expanduser("~")
    if sysname == "Windows":
        appdata = os.environ.get("APPDATA", os.path.join(home, "AppData", "Roaming"))
        return os.path.join(appdata, "Adobe", "CEP", "extensions", EXT_NAME)
    elif sysname == "Darwin":
        return os.path.join(home, "Library", "Application Support", "Adobe", "CEP", "extensions", EXT_NAME)
    else:
        return os.path.join(home, ".adobe", "CEP", "extensions", EXT_NAME)

def enable_debug():
    sysname = platform.system()
    versions = ["9", "10", "11", "12"]
    if sysname == "Darwin":
        for v in versions:
            try:
                subprocess.run(["defaults", "write", f"com.adobe.CSXS.{v}", "PlayerDebugMode", "1"],
                               stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                print(f"  debug enabled CSXS.{v}")
            except Exception as e:
                print(f"  skip CSXS.{v}: {e}")
    elif sysname == "Windows":
        for v in versions:
            try:
                subprocess.run(["reg", "add", f"HKCU\\Software\\Adobe\\CSXS.{v}",
                                "/v", "PlayerDebugMode", "/t", "REG_SZ", "/d", "1", "/f"],
                               stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, shell=True)
                print(f"  debug enabled CSXS.{v}")
            except Exception as e:
                print(f"  skip CSXS.{v}: {e}")
    else:
        print("  debug flag: manual step, see README.")

def main():
    src = src_dir()
    dst = dest_dir()
    print(f"SeyedCutter installer (no key needed)")
    print(f"Source: {src}")
    print(f"Dest:   {dst}")
    if not os.path.isfile(os.path.join(src, "CSXS", "manifest.xml")):
        print("ERROR: CSXS/manifest.xml not found. Run installer from inside SeyedCutter folder.")
        sys.exit(1)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    if os.path.isdir(dst):
        print("Removing old install...")
        shutil.rmtree(dst)
    # ignore installer leftovers + OS junk
    def _ignore(d, names):
        return {"__pycache__", ".DS_Store", ".git"}.intersection(names)
    shutil.copytree(src, dst, ignore=_ignore)
    print(f"Copied to {dst}")
    print("Enabling unsigned extensions...")
    enable_debug()
    print("")
    print("DONE. Next:")
    print(" 1. Restart Premiere Pro")
    print(" 2. Window > Extensions > SeyedCutter")
    print(" 3. Open a sequence, load Timecodes-CutList.csv, Cut + Paint RED")
    print("No registration, no key. Uninstall: delete the dest folder above.")

if __name__ == "__main__":
    main()
