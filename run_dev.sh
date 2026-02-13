#!/bin/bash
set -e

# Load fnm
export FNM_DIR="$HOME/.local/share/fnm"
export PATH="$FNM_DIR:$PATH"
eval "$($FNM_DIR/fnm env --shell bash)"

# Ensure we are using the new node
NODE_VER=$(ls $HOME/.local/share/fnm/node-versions | head -n 1)
export PATH="$HOME/.local/share/fnm/node-versions/$NODE_VER/installation/bin:$PATH"

cd /home/data/Projects/DataKitReact/DataReactProfile

echo "Starting dev server..."
pnpm dev:all
