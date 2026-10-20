import http from 'http';
import { app } from '../server.js';
import { initDB } from '../db/init.js';

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    req.on('error', (err) => reject(err));
    if (postData) {
      req.write(typeof postData === 'object' ? JSON.stringify(postData) : postData);
    }
    req.end();
  });
}

import fs from 'fs';
import path from 'path';

async function runTests() {
  console.log('===========================================================');
  console.log('🧪 AFRICA WEB3 INSTITUTE - BACKEND VERIFICATION TEST SUITE');
  console.log('===========================================================');

  const dbFile = path.join(process.cwd(), 'db', 'awi.db');
  if (fs.existsSync(dbFile)) {
    try { fs.unlinkSync(dbFile); } catch (e) {}
  }

  await initDB();


  const PORT = 3099;
  const server = app.listen(PORT);

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Admin Login (to obtain JWT for protected tests)
    console.log('\n--- 1. AUTHENTICATION ---');
    let token = '';
    const loginRes = await makeRequest({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/admin/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { email: 'admin@africaweb3institute.org', password: 'admin' });

    assert(loginRes.statusCode === 200, 'Superadmin login succeeded (HTTP 200)');
    const parsed = JSON.parse(loginRes.body);
    token = parsed.token;
    assert(token && token.length > 20, 'JWT token generated successfully');

    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // 2. Contact Us Form Engine
    console.log('\n--- 2. CONTACT US FORM ENGINE ---');
    const submitRes = await makeRequest({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/contact',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      name: 'Integration Test User',
      email: 'test@example.com',
      organization: 'Web3 Security Lab',
      subject: 'Automated Test Message',
      message: 'Testing contact form submission.'
    });

    assert(submitRes.statusCode === 201, 'Public Contact Form Submission (HTTP 201)');

    const listRes = await makeRequest({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/contact-messages',
      method: 'GET',
      headers: authHeaders
    });

    assert(listRes.statusCode === 200, 'Admin Contact Messages Inbox (HTTP 200)');
    const listBody = JSON.parse(listRes.body);
    assert(listBody.data && listBody.data.length >= 1, 'Inbound messages listed correctly');

    // 3. Week 4: Research Visualization Systems (KPI: 10 Visuals Completed)
    console.log('\n--- 3. WEEK 4: RESEARCH VISUALIZATION SYSTEMS ---');
    const visRes = await makeRequest({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/visualizations',
      method: 'GET'
    });

    assert(visRes.statusCode === 200, 'GET /api/visualizations (HTTP 200)');
    const visBody = JSON.parse(visRes.body);
    assert(visBody.data && visBody.data.length >= 10, `KPI MET: ${visBody.count} visuals completed (>= 10 required)`);

    const singleVis = await makeRequest({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/visualizations/continental-adoption-index',
      method: 'GET'
    });

    assert(singleVis.statusCode === 200, 'GET /api/visualizations/:slug (HTTP 200)');

    // 4. Week 5: Newsletter Intelligence & Tracking (KPI: Open/Click Tracking Active)
    console.log('\n--- 4. WEEK 5: NEWSLETTER INTELLIGENCE & TRACKING ---');
    const subRes = await makeRequest({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/newsletter/subscribers',
      method: 'GET',
      headers: authHeaders
    });

    assert(subRes.statusCode === 200, 'GET /api/newsletter/subscribers (HTTP 200)');

    const openRes = await makeRequest({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/newsletter/track/open/1/1',
      method: 'GET'
    });

    assert(openRes.statusCode === 200, 'Open Tracking Pixel GET /api/newsletter/track/open/1/1 (HTTP 200)');
    assert(openRes.headers['content-type'] === 'image/png', 'Tracking pixel returns image/png');

    const clickRes = await makeRequest({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/newsletter/track/click/1/1?url=https://africaweb3institute.org/reports',
      method: 'GET'
    });

    assert(clickRes.statusCode === 302, 'Click Redirect Tracking GET /api/newsletter/track/click/1/1 (HTTP 302)');
    assert(clickRes.headers['location'] === 'https://africaweb3institute.org/reports', 'Redirect location header set correctly');

    const analyticsRes = await makeRequest({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/newsletter/analytics',
      method: 'GET',
      headers: authHeaders
    });

    assert(analyticsRes.statusCode === 200, 'Newsletter Analytics Report GET /api/newsletter/analytics (HTTP 200)');
    const analyticsBody = JSON.parse(analyticsRes.body);
    assert(analyticsBody.report.trackingActive === true, 'KPI MET: Open & Click tracking active');

    // 5. Week 6: State of Web3 in Africa Dashboard (KPI: Dashboard Deployed)
    console.log('\n--- 5. WEEK 6: STATE OF WEB3 IN AFRICA DASHBOARD ---');
    const dashRes = await makeRequest({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/state-of-web3/dashboard',
      method: 'GET'
    });

    assert(dashRes.statusCode === 200, 'Continental Dashboard Beta GET /api/state-of-web3/dashboard (HTTP 200)');
    const dashBody = JSON.parse(dashRes.body);
    assert(dashBody.dashboard.status === 'deployed_beta', 'KPI MET: Dashboard deployed (beta state)');
    assert(dashBody.dashboard.startupsDirectory.length >= 5, 'Startup intelligence directory populated');

    // 6. Week 7: Research Repository Metrics (KPI: Reporting Automation Active)
    console.log('\n--- 6. WEEK 7: RESEARCH REPOSITORY METRICS ---');
    const downloadRes = await makeRequest({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/publications/1/download',
      method: 'GET'
    });

    assert(downloadRes.statusCode === 200, 'Report Download Trigger GET /api/publications/1/download (HTTP 200)');

    const impactRes = await makeRequest({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/research-metrics/impact',
      method: 'GET'
    });

    assert(impactRes.statusCode === 200, 'Research Impact Dashboard GET /api/research-metrics/impact (HTTP 200)');
    const impactBody = JSON.parse(impactRes.body);
    assert(impactBody.impactDashboard.reportingAutomationActive === true, 'KPI MET: Reporting automation active');

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    server.close();
  }

  console.log('\n===========================================================');
  console.log(`📊 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('===========================================================');

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
