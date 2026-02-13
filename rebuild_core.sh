#!/bin/bash
set -e

# Load fnm
export FNM_DIR="$HOME/.local/share/fnm"
export PATH="$FNM_DIR:$PATH"
eval "$($FNM_DIR/fnm env --shell bash)"

# Ensure we are using the new node
# This finds the latest installed node version and adds it to PATH
NODE_VER=$(ls $HOME/.local/share/fnm/node-versions | head -n 1)
export PATH="$HOME/.local/share/fnm/node-versions/$NODE_VER/installation/bin:$PATH"

echo "Using Node: $(node -v)"
echo "Using NPM: $(npm -v)"

# Install pnpm if missing
if ! command -v pnpm &> /dev/null; then
    npm install -g pnpm
fi

echo "Using PNPM: $(pnpm -v)"

# Navigate to DataKitReactCore
cd /home/data/Projects/DataKitReact/DataKitReactCore

echo "Cleaning up..."
rm -rf node_modules pnpm-lock.yaml

echo "Installing dependencies..."
pnpm install

echo "Building..."
pnpm build

echo "Packing..."
# Capture the filename of the packed tgz
PACKED_FILE=$(pnpm pack | tail -n 1)

echo "Moving packed file $PACKED_FILE to DataReactProfile libs..."
mkdir -p ../DataReactProfile/libs
mv "$PACKED_FILE" ../DataReactProfile/libs/datakit-react-core-latest.tgz

echo "Done!"
