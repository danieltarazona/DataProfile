#!/bin/bash
set -e

# Load fnm
export PATH="$HOME/.local/share/fnm:$PATH"
eval "$(fnm env)"

# Install Node
fnm install --latest
fnm default latest

cd "$(dirname "$0")"
fnm use

# Install pnpm if missing
if ! command -v pnpm &> /dev/null; then
    npm install -g pnpm
fi

# Run build
pnpm install --no-frozen-lockfile
pnpm build
