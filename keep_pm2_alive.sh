#!/bin/bash
# PM2 Keep-Alive Script
# This script checks if PM2 is running and restarts it if needed
# Runs via cron every 5 minutes

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use Node 20
nvm use 20 > /dev/null 2>&1

# Check if PM2 is running
if ! pm2 list | grep -q "nextjs.*online"; then
    echo "$(date): PM2 nextjs is not running, restarting..."
    cd ~/domains/damahomerealty.com/public_html/frontend/.next/standalone/backend/frontend
    pm2 start server.js --name nextjs --interpreter node > /dev/null 2>&1
    pm2 save > /dev/null 2>&1
    echo "$(date): PM2 nextjs restarted"
else
    echo "$(date): PM2 nextjs is running"
fi

