#!/bin/bash

# RCE Career Hub Deployment Script
# This script automates the deployment process

set -e

echo "🚀 RCE Career Hub Deployment Script"
echo "===================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

echo -e "${BLUE}✓ Node.js version: $(node --version)${NC}"

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

# Build the application
echo -e "${BLUE}🔨 Building the application...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

# Run tests (if test script exists)
if npm run test 2>/dev/null; then
    echo -e "${GREEN}✓ Tests passed${NC}"
fi

# Check if deployed to Vercel
if [ "$1" == "vercel" ]; then
    echo -e "${BLUE}🌐 Deploying to Vercel...${NC}"
    vercel --prod
    echo -e "${GREEN}✓ Deployed to Vercel${NC}"
else
    echo -e "${GREEN}✓ Build ready for deployment${NC}"
    echo -e "${BLUE}📂 Output directory: .next${NC}"
fi

echo -e "${GREEN}✅ Deployment preparation complete!${NC}"
