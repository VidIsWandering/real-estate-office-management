#!/bin/bash

# Settings Pages API Test Script
# Tests all backend APIs used by Settings tabs

set -e

BASE_URL="http://localhost:8081/api/v1"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================="
echo "Settings Pages API Integration Test"
echo "========================================="
echo ""

# Login and get token
echo "🔐 Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Login failed${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Login successful${NC}"
echo ""

# Test function
test_api() {
  local name=$1
  local endpoint=$2
  local method=${3:-GET}
  
  echo -n "Testing $name... "
  
  RESPONSE=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json")
  
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | head -n-1)
  
  if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
    SUCCESS=$(echo "$BODY" | grep -o '"success":true' || echo "")
    if [ -n "$SUCCESS" ]; then
      echo -e "${GREEN}✓ PASS (HTTP $HTTP_CODE)${NC}"
      return 0
    else
      echo -e "${YELLOW}⚠ WARNING (HTTP $HTTP_CODE but success:false)${NC}"
      return 1
    fi
  else
    echo -e "${RED}✗ FAIL (HTTP $HTTP_CODE)${NC}"
    echo "$BODY" | head -5
    return 1
  fi
}

echo "📋 Testing Account Tab APIs"
echo "----------------------------"
test_api "Profile" "/auth/profile"
echo ""

echo "🏢 Testing Office Tab APIs"
echo "----------------------------"
test_api "System Configs" "/system/configs"
echo ""

echo "🔔 Testing Notifications Tab APIs"
echo "----------------------------"
test_api "Notification Settings" "/system/configs"
echo ""

echo "⚙️  Testing Config Tab APIs"
echo "----------------------------"
test_api "Property Types" "/config/catalogs/property_type"
test_api "Areas" "/config/catalogs/area"
test_api "Lead Sources" "/config/catalogs/lead_source"
test_api "Contract Types" "/config/catalogs/contract_type"
test_api "All Permissions" "/config/permissions"
echo ""

echo "🔒 Testing Security Tab APIs"
echo "----------------------------"
test_api "Active Sessions" "/auth/sessions"
test_api "Login History" "/auth/login-history"
echo ""

echo "========================================="
echo -e "${GREEN}✓ All tests completed${NC}"
echo "========================================="
