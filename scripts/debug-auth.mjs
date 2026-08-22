/**
 * Debug auth linkage script
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cnkxlsfcdonnfjeqpcmm.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNua3hsc2ZjZG9ubmZqZXFwY21tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njk3OTQxOCwiZXhwIjoyMTAyNTU1NDE4fQ._pg0Kek7vpsdhKnvMD6zup5sGpuvUYMCZT3SyEc9tHo';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function debug() {
  // List all auth users
  const { data: authList, error: authListErr } = await supabase.auth.admin.listUsers();
  if (authListErr) { console.error('List error:', authListErr); return; }
  
  const email = 'abhishek@example.com';
  const authUser = authList.users.find(u => u.email === email);
  if (!authUser) {
    console.log('No auth user with that email!');
    return;
  }
  
  console.log('Auth user found:');
  console.log('  id:', authUser.id);
  console.log('  email:', authUser.email);
  console.log('  email_confirmed_at:', authUser.email_confirmed_at);
  console.log('  banned_until:', authUser.banned_until);
  
  // Check users table
  const { data: profile, error: profileErr } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  if (profileErr) {
    console.log('\nNo profile found by email:', profileErr.message);
  } else {
    console.log('\nProfile in users table:');
    console.log('  id:', profile.id);
    console.log('  auth_id:', profile.auth_id);
    console.log('  name:', profile.name);
    console.log('  email:', profile.email);
    console.log('  role:', profile.role);
    console.log('  plan:', profile.plan);
    
    // Check if auth_id matches
    if (profile.auth_id === authUser.id) {
      console.log('\n✅ auth_id matches!');
    } else {
      console.log('\n❌ auth_id MISMATCH!');
      console.log('  Profile auth_id:', profile.auth_id);
      console.log('  Actual auth user id:', authUser.id);
    }
  }
  
  // Try to sign in with anon key to see the actual error
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNua3hsc2ZjZG9ubmZqZXFwY21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5Nzk0MTgsImV4cCI6MjEwMjU1NTQxOH0.tpHsUrs_WavjgN7GEm7S0XvarSppJGZNaPybAjvF358';
  const anonClient = createClient(supabaseUrl, anonKey);
  
  console.log('\nAttempting signInWithPassword...');
  const { data: signInData, error: signInErr } = await anonClient.auth.signInWithPassword({
    email,
    password: 'password123',
  });
  
  if (signInErr) {
    console.log('Sign in error:', signInErr.message, '(status:', signInErr.status, ')');
  } else {
    console.log('✅ Sign in successful! Session:', signInData.session?.access_token?.slice(0, 20) + '...');
  }
}

debug().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
