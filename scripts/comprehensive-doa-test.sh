#!/bin/bash

# Comprehensive DoA Module Testing Script
# Tests ALL pages, ALL links, ALL features

echo "🧪 COMPREHENSIVE DoA MODULE TEST"
echo "=================================="
echo ""

BASE_URL="http://localhost:3000"
PASS=0
FAIL=0
TOTAL=0

# Test function
test_page() {
    local url=$1
    local name=$2
    TOTAL=$((TOTAL + 1))
    
    status=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${url}")
    
    if [ "$status" = "200" ]; then
        echo "✅ $name"
        PASS=$((PASS + 1))
        return 0
    else
        echo "❌ $name (HTTP $status)"
        FAIL=$((FAIL + 1))
        return 1
    fi
}

echo "📊 1. DASHBOARD"
test_page "/doa" "Main Dashboard"
echo ""

echo "📄 2. AUTHORITY MATRIX (11 pages)"
test_page "/doa/authority-matrix" "Matrix Hub"
test_page "/doa/authority-matrix/new" "Create Matrix"
test_page "/doa/authority-matrix/designer" "Visual Designer"
test_page "/doa/authority-matrix/simulate" "Simulator"
test_page "/doa/authority-matrix/templates" "Templates"
test_page "/doa/authority-matrix/matrix-001" "Matrix Detail #1"
test_page "/doa/authority-matrix/matrix-002" "Matrix Detail #2"
test_page "/doa/authority-matrix/matrix-003" "Matrix Detail #3"
test_page "/doa/authority-matrix/matrix-001/edit" "Edit Matrix #1"
test_page "/doa/authority-matrix/matrix-001/entries" "Matrix Entries"
test_page "/doa/authority-matrix/comparison" "Matrix Comparison"
echo ""

echo "✅ 3. APPROVALS (10 pages)"
test_page "/doa/approvals" "Approvals Dashboard"
test_page "/doa/approvals/new" "Submit Request"
test_page "/doa/approvals/my-approvals" "My Approvals"
test_page "/doa/approvals/apr-001" "Approval Detail #1"
test_page "/doa/approvals/apr-002" "Approval Detail #2"
test_page "/doa/approvals/apr-003" "Approval Detail #3"
test_page "/doa/workflows" "Workflows List"
test_page "/doa/workflows/new" "Create Workflow"
test_page "/doa/workflows/wf-001" "Workflow Detail"
test_page "/doa/workflows/wf-001/analytics" "Workflow Analytics"
echo ""

echo "🔄 4. DELEGATIONS (8 pages)"
test_page "/doa/delegations" "Delegations Dashboard"
test_page "/doa/delegations/new" "Create Delegation"
test_page "/doa/delegations/calendar" "Calendar View"
test_page "/doa/delegations/del-001" "Delegation Detail #1"
test_page "/doa/delegations/del-002" "Delegation Detail #2"
test_page "/doa/delegations/del-001/edit" "Edit Delegation"
test_page "/doa/delegations/ooo" "OOO Delegations"
test_page "/doa/delegations/history" "Delegation History"
echo ""

echo "⚠️  5. SOD MONITORING (7 pages)"
test_page "/doa/sod-monitoring" "SoD Dashboard"
test_page "/doa/sod/rules" "Rules Library"
test_page "/doa/sod/rules/new" "Create Rule"
test_page "/doa/sod/rules/sod-001" "Rule Detail"
test_page "/doa/sod/conflicts" "Conflicts List"
test_page "/doa/sod/conflicts/conf-001" "Conflict Detail"
test_page "/doa/sod/analysis" "SoD Analysis"
echo ""

echo "🚨 6. EXCEPTIONS (5 pages)"
test_page "/doa/exceptions" "Exceptions Dashboard"
test_page "/doa/exceptions/new" "Request Exception"
test_page "/doa/exceptions/EXC-001" "Exception Detail"
test_page "/doa/emergency-approvals" "Emergency Approvals"
test_page "/doa/overrides" "Override Tracking"
echo ""

echo "📊 7. REPORTS (17 pages)"
test_page "/doa/reports" "Reports Hub"
test_page "/doa/reports/executive-summary" "Executive Summary"
test_page "/doa/reports/authority-usage" "Authority Usage"
test_page "/doa/reports/approval-cycle-time" "Approval Cycle Time"
test_page "/doa/reports/sod-conflict-summary" "SoD Conflict Summary"
test_page "/doa/reports/active-delegations-summary" "Active Delegations"
test_page "/doa/reports/exception-rate-analysis" "Exception Rate"
test_page "/doa/reports/authority-matrix-coverage-report" "Matrix Coverage"
test_page "/doa/reports/authority-usage-report" "Usage Report"
test_page "/doa/reports/matrix-version-history" "Version History"
test_page "/doa/reports/approval-cycle-time-analysis" "Cycle Time Analysis"
test_page "/doa/reports/bottleneck-identification" "Bottleneck ID"
test_page "/doa/reports/approval-volume-trends" "Volume Trends"
test_page "/doa/reports/delegation-coverage-report" "Delegation Coverage"
test_page "/doa/reports/permanent-delegation-review" "Permanent Delegations"
test_page "/doa/reports/remediation-tracking" "Remediation Tracking"
test_page "/doa/reports/sod-rule-effectiveness" "Rule Effectiveness"
echo ""

echo "⚙️  8. SETTINGS (5 pages)"
test_page "/doa/settings" "General Settings"
test_page "/doa/settings/notifications" "Notifications"
test_page "/doa/settings/integrations" "Integrations"
test_page "/doa/policy-workflow" "Policy Workflow"
test_page "/doa/attestations" "Attestations"
echo ""

echo "=================================="
echo "📊 TEST SUMMARY"
echo "=================================="
echo "Total Tests: $TOTAL"
echo "Passed: $PASS ($(awk "BEGIN {printf \"%.1f\", ($PASS/$TOTAL)*100}")%)"
echo "Failed: $FAIL ($(awk "BEGIN {printf \"%.1f\", ($FAIL/$TOTAL)*100}")%)"
echo ""

if [ $FAIL -eq 0 ]; then
    echo "🎉 ALL TESTS PASSED!"
    exit 0
else
    echo "⚠️  SOME TESTS FAILED - Review above for details"
    exit 1
fi
