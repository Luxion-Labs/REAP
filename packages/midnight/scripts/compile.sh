#!/bin/bash
# Compile all Compact contracts

# Ensure cargo/local bin is in PATH
export PATH="$HOME/.local/bin:$HOME/.cargo/bin:$PATH"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
CONTRACTS_DIR="$PROJECT_DIR/contracts"
BUILD_DIR="$PROJECT_DIR/build"

echo "Building contracts..."
mkdir -p "$BUILD_DIR"

failed=0
for file in "$CONTRACTS_DIR"/*.compact; do
  if [ ! -f "$file" ]; then
    continue
  fi
  
  name=$(basename "$file" .compact)
  output_dir="$BUILD_DIR/$name"
  
  echo "Compiling $name..."
  mkdir -p "$output_dir"
  
  if compact compile "$file" "$output_dir"; then
    # Check if artifacts were created
    if [ -n "$(ls -A "$output_dir" 2>/dev/null)" ]; then
      artifacts=$(ls -1 "$output_dir" | tr '\n' ', ' | sed 's/,$//')
      echo "✓ $name → $artifacts"
    else
      echo "✓ $name compiled"
    fi
  else
    echo "✗ Failed to compile $name"
    failed=$((failed + 1))
  fi
done

echo ""
if [ $failed -eq 0 ]; then
  echo "✅ All contracts compiled successfully!"
  exit 0
else
  echo "⚠️  Compilation complete with errors"
  exit 1
fi
