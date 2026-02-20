#!/bin/bash
# deploy to render.com free tier
# requires: render CLI installed and logged in

echo "deploying mycel-gateway to render..."

# check if render CLI is installed
if ! command -v render &> /dev/null; then
    echo "render CLI not found. installing..."
    npm install -g @render/cli
fi

# deploy using render.yaml
echo "deploying with render.yaml config..."
render blueprint apply

echo ""
echo "deployment initiated!"
echo "check dashboard: https://dashboard.render.com"
echo ""
echo "after deploy, register on openx402.ai:"
echo "  curl -X POST https://openx402.ai/api/register \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"url\": \"https://mycel-gateway.onrender.com\", \"name\": \"mycel\"}'"
