#!/bin/bash
cd "$(dirname "$0")"
python3 installer.py
echo ""
echo "Press Enter to close..."
read -r
