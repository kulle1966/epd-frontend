#!/bin/bash

# EPD Frontend Deployment Script
# Kopiert die wichtigsten Dateien zur Azure Static Web App

echo "Starting EPD Frontend deployment..."

# Dateien, die deployed werden sollen
FILES=(
    "index.html"
    "staticwebapp.config.json"
    "package.json"
    "README.md"
)

echo "Files to deploy:"
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ $file ($(du -h "$file" | cut -f1))"
    else
        echo "✗ $file (missing)"
    fi
done

echo ""
echo "Azure Static Web App URL: https://orange-coast-0194f1703.3.azurestaticapps.net"
echo "API Endpoint: https://epd-extractor-api-2025.azurewebsites.net"
echo ""
echo "Deployment Token: eb86c66101b692e6ac92dc0e09a451d62d47e21856235381b264d68ec1a509f303-b4bd9705-b4e7-4885-80e8-6d7ba056e10900308050194f1703"
echo ""
echo "Manual deployment required via Azure Portal or SWA CLI"