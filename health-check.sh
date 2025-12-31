#!/bin/bash

# Health check script for iSkillBiz Landing Page
# This script checks the health of all services

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🏥 Running health checks..."

# Check if containers are running
echo -e "${YELLOW}📦 Checking container status...${NC}"
if ! docker-compose ps | grep -q "Up"; then
    echo -e "${RED}❌ Some containers are not running!${NC}"
    docker-compose ps
    exit 1
fi

# Check frontend
echo -e "${YELLOW}🔍 Checking frontend (Next.js)...${NC}"
if curl -f -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Frontend is healthy${NC}"
else
    echo -e "${RED}❌ Frontend is not responding${NC}"
    exit 1
fi

# Check backend API
echo -e "${YELLOW}🔍 Checking backend (NestJS)...${NC}"
if curl -f -s http://localhost:3001/api/sections > /dev/null; then
    echo -e "${GREEN}✅ Backend API is healthy${NC}"
else
    echo -e "${RED}❌ Backend API is not responding${NC}"
    exit 1
fi

# Check nginx
echo -e "${YELLOW}🔍 Checking Nginx...${NC}"
if curl -f -s http://localhost/health > /dev/null; then
    echo -e "${GREEN}✅ Nginx is healthy${NC}"
else
    echo -e "${RED}❌ Nginx is not responding${NC}"
    exit 1
fi

# Check nginx routing
echo -e "${YELLOW}🔍 Checking Nginx routing...${NC}"
if curl -f -s http://localhost/api/sections > /dev/null; then
    echo -e "${GREEN}✅ Nginx API routing is working${NC}"
else
    echo -e "${RED}❌ Nginx API routing failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All health checks passed!${NC}"

