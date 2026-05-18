#!/usr/bin/env node

/**
 * Comprehensive DoA Module Link Testing
 * Tests ALL navigation items, reports, and interactive elements
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Comprehensive page list based on actual sidebar and page content
const allPages = {
  'Dashboard': '/doa',
  
  'Authority Matrix': [
    '/doa/authority-matrix',
    '/doa/authority-matrix/matrix-001',
    '/doa/authority-matrix/matrix-002',
    '/doa/authority-matrix/matrix-003',
    '/doa/authority-matrix/new',
    '/doa/authority-matrix/templates',
    '/doa/authority-matrix/matrix-001/edit',
  ],
  
  'Approvals': [
    '/doa/approvals',
    '/doa/approvals/new',
    '/doa/approvals/my-approvals',
    '/doa/approvals/team-approvals',
    '/doa/approvals/APPR-2026-0001',
    '/doa/approvals/APPR-2026-0002',
    '/doa/approvals/APPR-2026-0003',
  ],
  
  'Delegations': [
    '/doa/delegations',
    '/doa/delegations/new',
    '/doa/delegations/calendar',
    '/doa/delegations/del-001',
    '/doa/delegations/del-002',
    '/doa/delegations/del-001/edit',
  ],
  
  'SoD Monitoring': [
    '/doa/sod-monitoring',
    '/doa/sod/rules',
    '/doa/sod/analysis',
    '/doa/sod/conflicts',
    '/doa/sod/conflicts/conf-001',
  ],
  
  'Exceptions': [
    '/doa/exceptions',
    '/doa/exceptions/new',
    '/doa/emergency-approvals',
    '/doa/overrides',
    '/doa/exceptions/EXC-001',
  ],
  
  'Reports': [
    '/doa/reports',
    '/doa/reports/authority-usage',
    '/doa/reports/approval-cycle-time',
    '/doa/reports/executive-summary',
    '/doa/reports/authority-matrix-coverage-report',
    '/doa/reports/authority-usage-report',
    '/doa/reports/matrix-version-history',
    '/doa/reports/approval-cycle-time-analysis',
    '/doa/reports/bottleneck-identification',
    '/doa/reports/approval-volume-trends',
    '/doa/reports/exception-rate-analysis',
    '/doa/reports/active-delegations-summary',
    '/doa/reports/delegation-coverage-report',
    '/doa/reports/permanent-delegation-review',
    '/doa/reports/sod-conflict-summary',
    '/doa/reports/remediation-tracking',
    '/doa/reports/sod-rule-effectiveness',
  ],
  
  'Settings': [
    '/doa/settings',
    '/doa/settings/notifications',
    '/doa/settings/integrations',
  ],
};

function testUrl(url) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: url,
      method: 'GET',
      timeout: 5000
    }, (res) => {
      res.on('data', () => {});
      res.on('end', () => {
        resolve({ url, status: res.statusCode });
      });
    });

    req.on('error', (error) => {
      resolve({ url, status: 'ERROR', error: error.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ url, status: 'TIMEOUT' });
    });

    req.end();
  });
}

async function runTests() {
  console.log('\n🧪 COMPREHENSIVE DoA Module Testing\n');
  console.log('━'.repeat(90));

  const results = { ok: 0, notFound: 0, error: 0, total: 0 };
  const issues = [];

  for (const [category, pages] of Object.entries(allPages)) {
    console.log(`\n📂 ${category}\n`);

    const pageList = Array.isArray(pages) ? pages : [pages];

    for (const url of pageList) {
      results.total++;
      const result = await testUrl(url);
      
      const icon = result.status === 200 ? '✅' : result.status === 404 ? '⚠️ ' : '❌';
      const statusText = String(result.status).padStart(7);
      
      console.log(`${icon} ${statusText}  ${url}`);

      if (result.status === 200) {
        results.ok++;
      } else if (result.status === 404) {
        results.notFound++;
        issues.push({ url, status: 404, category });
      } else {
        results.error++;
        issues.push({ url, status: result.status, error: result.error, category });
      }
    }
  }

  // Summary
  console.log('\n' + '━'.repeat(90));
  console.log('\n📊 COMPREHENSIVE TEST SUMMARY\n');
  console.log(`✅ Working:    ${results.ok} (${Math.round(results.ok/results.total*100)}%)`);
  console.log(`⚠️  Not Found:  ${results.notFound} (${Math.round(results.notFound/results.total*100)}%)`);
  console.log(`❌ Errors:     ${results.error}`);
  console.log(`📝 Total:      ${results.total}`);

  if (issues.length > 0) {
    console.log('\n' + '━'.repeat(90));
    console.log('\n⚠️  PAGES NEEDING ATTENTION:\n');
    
    const byCategory = {};
    issues.forEach(issue => {
      if (!byCategory[issue.category]) byCategory[issue.category] = [];
      byCategory[issue.category].push(issue);
    });

    for (const [cat, items] of Object.entries(byCategory)) {
      console.log(`\n${cat}:`);
      items.forEach(item => {
        console.log(`  ${item.status === 404 ? '⚠️ ' : '❌'} ${item.url}`);
      });
    }
  }

  console.log('\n' + '━'.repeat(90) + '\n');
  process.exit(results.error > 0 ? 1 : 0);
}

runTests().catch(console.error);
