#!/bin/bash

# DoughVault Deployment Script for PM2
# This script pulls the latest changes from dev branch and restarts the app

echo "🚀 Starting deployment process..."

# Step 1: Stop PM2 (if running)
echo "⏸️  Stopping PM2 application..."
pm2 stop doughvault 2>/dev/null || echo "App not running"

# Step 2: Pull latest changes from dev branch
echo "📥 Pulling latest changes from dev branch..."
git pull origin dev

# Step 3: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 4: Build the application
echo "🔨 Building application..."
npm run build

# Step 5: Start/Restart with PM2
echo "🚀 Starting application with PM2..."
pm2 start ecosystem.config.cjs

# Step 6: Save PM2 process list
echo "💾 Saving PM2 process list..."
pm2 save

# Step 7: Show status
echo "✅ Deployment complete! Application status:"
pm2 status

echo ""
echo "📊 View logs with: pm2 logs doughvault"
echo "📈 Monitor with: pm2 monit"
