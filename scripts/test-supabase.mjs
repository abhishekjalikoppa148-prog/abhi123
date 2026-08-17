/**
 * Automated Verification Script for Supabase Migration.
 * Tests all Supabase client modules, DB helpers, and storage utilities.
 */
import { supabase } from '../lib/supabase/client.ts';
import { supabaseAdmin } from '../lib/supabase/admin.ts';
import { createServerClient } from '../lib/supabase/server.ts';
import {
  getUserByEmail,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserPassword,
  deleteUserAccount,
  createPasswordResetToken,
  getPasswordResetToken,
  deletePasswordResetToken,
  getWebsitesByUserId,
  getWebsiteBySlug,
  getWebsiteById,
  incrementWebsiteViews,
  getPhotoMemories,
  getOrdersByUserId,
  createOrder,
  getAdminStats,
} from '../lib/supabase/db.ts';
import { generateStorageKey } from '../lib/storage.ts';
import { isExpired, getDaysUntilExpiry } from '../lib/expiration.ts';

async function runTests() {
  console.log('====================================================');
  console.log('   CELEBRATIONCRAFT SUPABASE SUITE VERIFICATION     ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(name, condition, details = '') {
    if (condition) {
      console.log(`✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${name} -> ${details}`);
      failed++;
    }
  }

  // 1. Client module instantiation tests
  console.log('--- 1. Testing Supabase Clients ---');
  assert('Browser Supabase client created', !!supabase && typeof supabase.from === 'function');
  assert('Admin Supabase client created', !!supabaseAdmin && typeof supabaseAdmin.from === 'function');
  const serverClient = createServerClient('sample-token');
  assert('Server Supabase client factory created', !!serverClient && typeof serverClient.from === 'function');

  // 2. Storage helper tests
  console.log('\n--- 2. Testing Storage Helpers ---');
  const storageKey = generateStorageKey('user-test-1', 'birthday-photo.jpg');
  assert('Storage key generated properly', storageKey.startsWith('uploads/user-test-1/') && storageKey.endsWith('.jpg'), storageKey);

  // 3. Expiration helper tests
  console.log('\n--- 3. Testing Expiration Logic ---');
  const pastDate = new Date(Date.now() - 86400000).toISOString();
  const futureDate = new Date(Date.now() + 86400000 * 10).toISOString();
  assert('Past date correctly identified as expired', isExpired(pastDate) === true);
  assert('Future date correctly identified as unexpired', isExpired(futureDate) === false);
  const daysLeft = await getDaysUntilExpiry(futureDate);
  assert('Days until expiry computed accurately', daysLeft >= 9 && daysLeft <= 11, `Days left: ${daysLeft}`);

  // 4. DB helper signatures
  console.log('\n--- 4. Testing DB Helper Exports ---');
  assert('getUserByEmail is function', typeof getUserByEmail === 'function');
  assert('getUserById is function', typeof getUserById === 'function');
  assert('createUser is function', typeof createUser === 'function');
  assert('updateUserProfile is function', typeof updateUserProfile === 'function');
  assert('updateUserPassword is function', typeof updateUserPassword === 'function');
  assert('deleteUserAccount is function', typeof deleteUserAccount === 'function');
  assert('createPasswordResetToken is function', typeof createPasswordResetToken === 'function');
  assert('getPasswordResetToken is function', typeof getPasswordResetToken === 'function');
  assert('deletePasswordResetToken is function', typeof deletePasswordResetToken === 'function');
  assert('getWebsitesByUserId is function', typeof getWebsitesByUserId === 'function');
  assert('getWebsiteBySlug is function', typeof getWebsiteBySlug === 'function');
  assert('getWebsiteById is function', typeof getWebsiteById === 'function');
  assert('incrementWebsiteViews is function', typeof incrementWebsiteViews === 'function');
  assert('getPhotoMemories is function', typeof getPhotoMemories === 'function');
  assert('getOrdersByUserId is function', typeof getOrdersByUserId === 'function');
  assert('createOrder is function', typeof createOrder === 'function');
  assert('getAdminStats is function', typeof getAdminStats === 'function');

  console.log('\n====================================================');
  console.log(`  TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');
}

runTests().catch(console.error);
