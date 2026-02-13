#!/bin/bash
set -e

# Load fnm
export FNM_DIR="$HOME/.local/share/fnm"
export PATH="$FNM_DIR:$PATH"
eval "$($FNM_DIR/fnm env)"

# Install Node
$FNM_DIR/fnm install --latest
$FNM_DIR/fnm default latest

# Ensure we are using the new node
export PATH="$HOME/.local/share/fnm/node-versions/$(ls $HOME/.local/share/fnm/node-versions | head -n 1)/installation/bin:$PATH"

# Install pnpm if missing
if ! command -v pnpm &> /dev/null; then
    npm install -g pnpm
fi

# Run build
cd /home/data/Projects/DataKitReact/DataReactProfile
pnpm install --no-frozen-lockfile
pnpm build
