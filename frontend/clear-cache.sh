#!/bin/bash
# Clear Vite Cache Script
# Run this when you get "Failed to fetch dynamically imported module" errors

echo "Clearing Vite cache..."

# Check if .vite folder exists
if [ -d "node_modules/.vite" ]; then
    echo "Found .vite cache folder. Removing..."
    rm -rf node_modules/.vite
    echo "✓ Vite cache cleared successfully!"
else
    echo "No .vite cache folder found."
fi

echo ""
echo "Next steps:"
echo "1. Stop your dev server if it's running (Ctrl+C)"
echo "2. Run: npm run start"
echo ""
echo "Or run with force flag: npm run start -- --force"

