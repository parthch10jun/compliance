#!/bin/bash

# Visual Testing Script for New DoA Features
# Tests all newly added visual demo features

echo "🎨 DoA Module - Visual Feature Testing"
echo "========================================"
echo ""

BASE_URL="http://localhost:3000"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test function
test_url() {
    local url=$1
    local name=$2
    local status=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${url}")
    
    if [ "$status" = "200" ]; then
        echo -e "${GREEN}✅ ${name}${NC} - ${BLUE}${url}${NC} (${status})"
        
        # Check for React errors in the HTML
        local content=$(curl -s "${BASE_URL}${url}")
        if echo "$content" | grep -q "Application error"; then
            echo -e "${RED}   ⚠️  WARNING: Application error detected${NC}"
            return 1
        fi
        
        # Check for basic content
        if echo "$content" | grep -q "text-h1\|text-h2\|text-h3"; then
            echo -e "   ${GREEN}Has headings ✓${NC}"
        else
            echo -e "${YELLOW}   ⚠️  No headings found${NC}"
        fi
        
        return 0
    else
        echo -e "${RED}❌ ${name}${NC} - ${url} (${status})"
        return 1
    fi
}

echo "📍 Testing NEW Visual Demo Features:"
echo "======================================"
echo ""

# Test 1: Visual Matrix Designer
echo "1️⃣  Visual Matrix Designer (Drag & Drop)"
test_url "/doa/authority-matrix/designer" "Visual Designer"
echo ""

# Test 2: Simulation Mode
echo "2️⃣  Simulation / What-If Mode"
test_url "/doa/authority-matrix/simulate" "Simulator"
echo ""

# Test 3: Policy Workflow
echo "3️⃣  Policy Change Workflow"
test_url "/doa/policy-workflow" "Policy Workflow"
echo ""

# Test 4: Authority Matrix with new features
echo "4️⃣  Enhanced Authority Matrix (with Import/Export buttons)"
test_url "/doa/authority-matrix" "Matrix Hub"
echo ""

# Test 5: Test all navigation items
echo "5️⃣  Navigation Integration Test"
test_url "/doa" "DoA Dashboard"
test_url "/doa/approvals" "Approvals"
test_url "/doa/delegations" "Delegations"
test_url "/doa/sod-monitoring" "SoD Monitoring"
test_url "/doa/exceptions" "Exceptions"
test_url "/doa/reports" "Reports"
test_url "/doa/settings" "Settings"
echo ""

# Test 6: Persona Switcher functionality
echo "6️⃣  User Persona Features"
test_url "/doa" "Persona Switcher (on Dashboard)"
echo ""

# Additional new pages
echo "7️⃣  Supporting Pages"
test_url "/doa/authority-matrix/new" "Create Matrix Form"
test_url "/doa/authority-matrix/templates" "Matrix Templates"
echo ""

echo "======================================"
echo "✅ Visual Testing Complete!"
echo ""
echo "🌐 To manually test interactivity, open these URLs:"
echo ""
echo "   Visual Designer:  ${BASE_URL}/doa/authority-matrix/designer"
echo "   Simulator:        ${BASE_URL}/doa/authority-matrix/simulate"
echo "   Policy Workflow:  ${BASE_URL}/doa/policy-workflow"
echo "   Matrix Hub:       ${BASE_URL}/doa/authority-matrix"
echo ""
