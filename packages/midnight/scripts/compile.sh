#!/bin/bash
# Compile all BrickChain contracts via the single main.compact entry point.
# main.compact includes all sub-contracts via 'include' directives.

export PATH="$HOME/.local/bin:$HOME/.cargo/bin:$PATH"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
CONTRACTS_DIR="$PROJECT_DIR/contracts"
BUILD_DIR="$PROJECT_DIR/build"

echo "Building REAP contracts..."
mkdir -p "$BUILD_DIR/REAP"

if compact compile "$CONTRACTS_DIR/main.compact" "$BUILD_DIR/REAP"; then
    echo "✓ REAP contracts compiled successfully → build/REAP"
    exit 0
else
    echo "✗ Compilation failed"
    exit 1
fi
