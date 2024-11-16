#!/bin/bash

PACKAGE_JSON="package.json"
PACKAGE_JSON_BAK="package.json.bak"

# Check if package.json exists
if [ ! -f "$PACKAGE_JSON" ]; then
  echo "Error: $PACKAGE_JSON not found."
  exit 1
fi

# Backup the original package.json
cp "$PACKAGE_JSON" "$PACKAGE_JSON_BAK"

# Execute the Node.js script to modify package.json
node ./scripts/remove-scripts.js

# Check if the Node.js script executed successfully
if [ $? -ne 0 ]; then
  echo "Error: Failed to modify package.json."
  # Restore the original package.json before exiting
  mv "$PACKAGE_JSON_BAK" "$PACKAGE_JSON"
  exit 1
fi

# Run npm pack
npm pack

# Capture the exit status of npm pack
PACK_STATUS=$?

# Restore the original package.json
mv "$PACKAGE_JSON_BAK" "$PACKAGE_JSON"

# Check if npm pack was successful
if [ $PACK_STATUS -ne 0 ]; then
  echo "Error: npm pack failed."
  exit 1
fi

echo "Successfully packed the package and restored the original package.json."
