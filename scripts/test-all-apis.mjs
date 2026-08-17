// Comprehensive API Test Suite
const BASE_URL = 'http://localhost:3000';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  const res = await fetch(url, {
    ...options,
    headers
  });
  let body;
  const text = await res.text();
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }
  return { status: res.status, ok: res.ok, headers: res.headers, body };
}

async function runSuite() {
  console.log('========================================');
  console.log('  STARTING FULL API AUTOMATED TEST SUITE');
  console.log('========================================\n');

  let passed = 0;
  let failed = 0;
  const testResults = [];

  function assert(name, condition, details = '') {
    if (condition) {
      console.log(`✅ PASS: ${name}`);
      passed++;
      testResults.push({ name, status: 'PASS', details });
    } else {
      console.error(`❌ FAIL: ${name} -> ${details}`);
      failed++;
      testResults.push({ name, status: 'FAIL', details });
    }
  }

  // ─── 1. AUTHENTICATION TESTS ──────────────────────────────────────────
  console.log('\n--- 1. Testing Authentication APIs ---');
  
  // 1.1 Login with wrong password
  const badLogin = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'test@example.com', password: 'WrongPassword999!' })
  });
  assert('POST /api/auth/login (bad password)', badLogin.status === 401, `Status: ${badLogin.status}`);

  // 1.2 Login with demo user
  const userLogin = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'test@example.com', password: 'Password@123' })
  });
  assert('POST /api/auth/login (valid user)', userLogin.status === 200 && userLogin.body.success, `Status: ${userLogin.status}`);
  
  // Extract user cookie
  const setCookieUser = userLogin.headers.get('set-cookie');
  const userCookie = setCookieUser ? setCookieUser.split(';')[0] : '';
  const userHeaders = userCookie ? { Cookie: userCookie } : {};

  // 1.3 GET /api/auth/me with session
  const meRes = await request('/api/auth/me', { headers: userHeaders });
  assert('GET /api/auth/me (authenticated)', meRes.status === 200 && meRes.body.user?.email === 'test@example.com', `Status: ${meRes.status}`);

  // 1.4 Admin Login
  const adminLogin = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@celebrationcraft.com', password: 'Admin@123' })
  });
  assert('POST /api/auth/login (admin)', adminLogin.status === 200 && adminLogin.body.user?.role === 'admin', `Status: ${adminLogin.status}`);
  
  const setCookieAdmin = adminLogin.headers.get('set-cookie');
  const adminCookie = setCookieAdmin ? setCookieAdmin.split(';')[0] : '';
  const adminHeaders = adminCookie ? { Cookie: adminCookie } : {};

  // 1.5 Forgot Password
  const forgotRes = await request('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email: 'test@example.com' })
  });
  assert('POST /api/auth/forgot-password', forgotRes.status === 200 && forgotRes.body.success, `Status: ${forgotRes.status}`);

  // 1.6 Signup new user
  const uniqueEmail = `qa_user_${Date.now()}@example.com`;
  const signupRes = await request('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name: 'QA Test User', email: uniqueEmail, password: 'StrongPassword@123' })
  });
  assert('POST /api/auth/signup', signupRes.status === 201 && signupRes.body.success, `Status: ${signupRes.status}`);

  // ─── 2. WEBSITES CRUD TESTS ──────────────────────────────────────────
  console.log('\n--- 2. Testing Website APIs ---');

  // 2.1 Get websites for user
  const websitesRes = await request('/api/websites', { headers: userHeaders });
  assert('GET /api/websites', websitesRes.status === 200 && Array.isArray(websitesRes.body.websites), `Count: ${websitesRes.body.websites?.length}`);

  // 2.2 Create new website
  const newSiteSlug = `qa-birthday-${Date.now()}`;
  const createSiteRes = await request('/api/websites', {
    method: 'POST',
    headers: userHeaders,
    body: JSON.stringify({
      slug: newSiteSlug,
      creatorName: 'Abhishek',
      personName: 'Pooja Sharma',
      personNickname: 'Pooju',
      personAge: 25,
      birthdayDate: '2026-09-15',
      relationship: 'Sister',
      birthdayMessage: 'Happy Birthday to the most amazing sister in the world! ✨🎉',
      templateId: 'cute',
      favColor: '#ec4899',
      planId: 'free',
      photos: [
        { url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600', caption: 'Party time' }
      ]
    })
  });
  assert('POST /api/websites (create)', createSiteRes.status === 201 && createSiteRes.body.website?.slug === newSiteSlug, `Status: ${createSiteRes.status}`);
  const createdSiteId = createSiteRes.body.website?.id;

  // 2.3 Get single website by slug
  const getSingleSlug = await request(`/api/websites?slug=${newSiteSlug}`);
  assert('GET /api/websites?slug=...', getSingleSlug.status === 200 && getSingleSlug.body.website?.person_name === 'Pooja Sharma', `Status: ${getSingleSlug.status}`);

  // 2.4 Update website
  if (createdSiteId) {
    const updateRes = await request('/api/websites', {
      method: 'PUT',
      headers: userHeaders,
      body: JSON.stringify({
        id: createdSiteId,
        personName: 'Pooja Sharma Updated',
        birthdayMessage: 'Updated birthday message with even more love! 💖',
        templateId: 'cute'
      })
    });
    assert('PUT /api/websites (update)', updateRes.status === 200 && updateRes.body.success, `Status: ${updateRes.status}`);

    // 2.5 Create version snapshot
    const versionRes = await request('/api/websites/versions', {
      method: 'POST',
      headers: userHeaders,
      body: JSON.stringify({ websiteId: createdSiteId })
    });
    assert('POST /api/websites/versions', versionRes.status === 200 && versionRes.body.success, `Status: ${versionRes.status}`);

    // 2.6 Duplicate website
    const dupRes = await request('/api/websites/duplicate', {
      method: 'POST',
      headers: userHeaders,
      body: JSON.stringify({ websiteId: createdSiteId, newTitle: 'Pooja Sharma Copy' })
    });
    assert('POST /api/websites/duplicate', dupRes.status === 200 && dupRes.body.success, `Status: ${dupRes.status}`);

    // 2.7 Delete website
    const delRes = await request(`/api/websites/${createdSiteId}`, {
      method: 'DELETE',
      headers: userHeaders
    });
    assert('DELETE /api/websites/[id]', delRes.status === 200 && delRes.body.success, `Status: ${delRes.status}`);
  }

  // ─── 3. ANALYTICS & TRACKING TESTS ──────────────────────────────────
  console.log('\n--- 3. Testing Analytics APIs ---');

  // 3.1 Track page view
  const trackRes = await request('/api/analytics/track', {
    method: 'POST',
    body: JSON.stringify({ slug: 'rohan-special-24', eventType: 'page_view' })
  });
  assert('POST /api/analytics/track', trackRes.status === 200 && trackRes.body.success, `Status: ${trackRes.status}`);

  // 3.2 Get website analytics
  const analyticsRes = await request('/api/analytics/website?slug=rohan-special-24', { headers: userHeaders });
  assert('GET /api/analytics/website', analyticsRes.status === 200 && analyticsRes.body.data?.totalViews !== undefined, `Views: ${analyticsRes.body.data?.totalViews}`);

  // 3.3 Funnel analytics
  const funnelRes = await request('/api/analytics/funnel', { headers: adminHeaders });
  assert('GET /api/analytics/funnel', funnelRes.status === 200 && funnelRes.body.success, `Status: ${funnelRes.status}`);

  // ─── 4. COUPONS, LIMITS & REFERRALS TESTS ───────────────────────────
  console.log('\n--- 4. Testing Coupons, Limits, Referrals & AI Credits ---');

  // 4.1 Validate coupon code WELCOME50
  const couponRes = await request('/api/coupons', {
    method: 'POST',
    body: JSON.stringify({ code: 'WELCOME50', userId: 'user-demo-1', orderValue: 299 })
  });
  assert('POST /api/coupons (WELCOME50)', couponRes.status === 200 && couponRes.body.data?.discountAmount > 0, `Discount: ${couponRes.body.data?.discountAmount}`);

  // 4.2 Check plan limits
  const limitsRes = await request('/api/limits/check', {
    method: 'POST',
    body: JSON.stringify({ planId: 'basic', feature: 'photos', currentCount: 2 })
  });
  assert('POST /api/limits/check', limitsRes.status === 200 && limitsRes.body.allowed !== undefined, `Allowed: ${limitsRes.body.allowed}`);

  // 4.3 Referrals
  const refRes = await request('/api/referrals?userId=user-demo-1');
  assert('GET /api/referrals', refRes.status === 200 && refRes.body.data?.referralCode, `Code: ${refRes.body.data?.referralCode}`);

  // 4.4 AI Credits
  const aiCreditsRes = await request('/api/ai/credits?userId=user-demo-1');
  assert('GET /api/ai/credits', aiCreditsRes.status === 200 && aiCreditsRes.body.data?.dailyLimit !== undefined, `Limit: ${aiCreditsRes.body.data?.dailyLimit}`);

  // ─── 5. PAYMENT TESTS ───────────────────────────────────────────────
  console.log('\n--- 5. Testing Payment APIs ---');

  // 5.1 Create order
  const orderRes = await request('/api/payment/create-order', {
    method: 'POST',
    headers: userHeaders,
    body: JSON.stringify({
      websiteId: 'site-rohan-9821',
      planId: 'premium',
      amount: 199,
      currency: 'INR'
    })
  });
  assert('POST /api/payment/create-order', orderRes.status === 200 && orderRes.body.orderId, `Order ID: ${orderRes.body.orderId}`);

  // ─── 6. ADMIN DASHBOARD APIS ────────────────────────────────────────
  console.log('\n--- 6. Testing Admin APIs ---');

  // 6.1 Admin Stats
  const statsRes = await request('/api/admin/stats', { headers: adminHeaders });
  assert('GET /api/admin/stats', statsRes.status === 200 && statsRes.body.data?.totalUsers >= 1, `Total Users: ${statsRes.body.data?.totalUsers}`);

  // 6.2 Admin Users
  const adminUsersRes = await request('/api/admin/users', { headers: adminHeaders });
  assert('GET /api/admin/users', adminUsersRes.status === 200 && Array.isArray(adminUsersRes.body.data), `Users count: ${adminUsersRes.body.data?.length}`);

  // 6.3 Admin Websites
  const adminWebsitesRes = await request('/api/admin/websites', { headers: adminHeaders });
  assert('GET /api/admin/websites', adminWebsitesRes.status === 200 && Array.isArray(adminWebsitesRes.body.data), `Websites count: ${adminWebsitesRes.body.data?.length}`);

  // 6.4 Admin Orders
  const adminOrdersRes = await request('/api/admin/orders', { headers: adminHeaders });
  assert('GET /api/admin/orders', adminOrdersRes.status === 200 && Array.isArray(adminOrdersRes.body.data), `Orders count: ${adminOrdersRes.body.data?.length}`);

  // ─── 7. EXPIRATION CRON ─────────────────────────────────────────────
  console.log('\n--- 7. Testing Expiration Cron ---');
  const cronRes = await request('/api/cron/check-expiration');
  assert('GET /api/cron/check-expiration', cronRes.status === 200 && cronRes.body.success, `Status: ${cronRes.status}`);

  console.log('\n========================================');
  console.log(`  SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED (Total: ${passed + failed})`);
  console.log('========================================\n');
}

runSuite();
