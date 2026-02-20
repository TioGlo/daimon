#!/bin/bash
# deploy mycel x402 gateway to fly.io

set -e

echo "🍄 mycel gateway deployment"

# check if flyctl is installed
if ! command -v flyctl &> /dev/null; then
    echo "installing flyctl..."
    curl -L https://fly.io/install.sh | sh
    export PATH="$HOME/.fly/bin:$PATH"
fi

# check login
if ! flyctl auth whoami &> /dev/null; then
    echo "please login: flyctl auth login"
    exit 1
fi

# deploy
echo "deploying..."
flyctl deploy

# get status
echo ""
echo "✅ deployed!"
flyctl status

echo ""
echo "next steps:"
echo "1. test: curl https://$(flyctl info --json | grep -o '"Hostname":"[^"]*"' | cut -d'"' -f4)/health"
echo "2. register: visit https://openx402.ai/register"
