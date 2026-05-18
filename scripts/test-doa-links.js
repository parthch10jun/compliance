#!/usr/bin/env node

/**
 * DoA Module Link Testing Script
 * Tests all Level 1 and Level 2 pages for proper rendering
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';
const TIMEOUT = 5000;

// Test results
const results = {
  passed: [],
  failed: [],
  notFound: []
};

// Pages to test
const testPages = {
  'Level 1 - Hub Pages': [
    '/doa',
    '/doa/authority-matrix',
    '/doa/approvals',
    '/doa/sod-monitoring',
    '/doa/delegations',
    '/doa/reports',
    '/doa/exceptions',
  ],
  'Level 2 - Authority Matrix Details': [
    '/doa/authority-matrix/matrix-001',
    '/doa/authority-matrix/matrix-002',
    '/doa/authority-matrix/matrix-003',
  ],
  'Level 2 - Approval Details': [
    '/doa/approvals/APPR-2026-0001',
    '/doa/approvals/APPR-2026-0002',
    '/doa/approvals/APPR-2026-0003',
    '/doa/approvals/APPR-2026-0004',
    '/doa/approvals/APPR-2026-0005',
  ],
  'Level 2 - Delegation Details': [
    '/doa/delegations/del-001',
    '/doa/delegations/del-002',
    '/doa/delegations/del-003',
    '/doa/delegations/del-007',
    '/doa/delegations/del-010',
  ],
  'Missing Pages (Expected 404)': [
    '/doa/approvals/new',
    '/doa/delegations/new',
    '/doa/authority-matrix/new',
    '/doa/exceptions/new',
    '/doa/delegations/calendar',
    '/doa/sod/rules',
    '/doa/sod/conflicts',
  ]
};

function testUrl(url) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: url,
      method: 'GET',
      timeout: TIMEOUT
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          success: res.statusCode === 200,
          notFound: res.statusCode === 404
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        url,
        status: 'ERROR',
        success: false,
        error: error.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        url,
        status: 'TIMEOUT',
        success: false,
        error: 'Request timeout'
      });
    });

    req.end();
  });
}

async function runTests() {
  console.log('\n🧪 DoA Module Link Testing\n');
  console.log('Base URL:', BASE_URL);
  console.log('Timeout:', TIMEOUT + 'ms\n');
  console.log('━'.repeat(80));

  for (const [category, urls] of Object.entries(testPages)) {
    console.log(`\n📂 ${category}\n`);

    for (const url of urls) {
      const result = await testUrl(url);
      
      const icon = result.success ? '✅' : result.notFound ? '⚠️' : '❌';
      const status = result.status;
      
      console.log(`${icon} ${url.padEnd(50)} [${status}]`);

      if (result.success) {
        results.passed.push(url);
      } else if (result.notFound) {
        results.notFound.push(url);
      } else {
        results.failed.push({ url, error: result.error });
      }
    }
  }

  // Summary
  console.log('\n' + '━'.repeat(80));
  console.log('\n📊 TEST SUMMARY\n');
  console.log(`✅ Passed:     ${results.passed.length}`);
  console.log(`⚠️  Not Found:  ${results.notFound.length}`);
  console.log(`❌ Failed:     ${results.failed.length}`);
  console.log(`📝 Total:      ${results.passed.length + results.notFound.length + results.failed.length}`);

  if (results.failed.length > 0) {
    console.log('\n❌ FAILED TESTS:\n');
    results.failed.forEach(({ url, error }) => {
      console.log(`  - ${url}: ${error}`);
    });
  }

  if (results.notFound.length > 0) {
    console.log('\n⚠️  MISSING PAGES (Need to be created):\n');
    results.notFound.forEach(url => {
      console.log(`  - ${url}`);
    });
  }

  console.log('\n' + '━'.repeat(80) + '\n');

  // Exit code
  process.exit(results.failed.length > 0 ? 1 : 0);
}

// Run tests
runTests().catch(console.error);
