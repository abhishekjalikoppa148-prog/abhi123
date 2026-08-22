/**
 * Create Demo User Script
 * Creates the demo user in Supabase Auth + users table
 * 
 * Usage: node scripts/create-demo-user.mjs
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cnkxlsfcdonnfjeqpcmm.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNua3hsc2ZjZG9ubmZqZXFwY21tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njk3OTQxOCwiZXhwIjoyMTAyNTU1NDE4fQ._pg0Kek7vpsdhKnvMD6zup5sGpuvUYMCZT3SyEc9tHo';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createDemoUser() {
  const email = 'abhishek@example.com';
  const password = 'password123';
  const name = 'Abhishek Demo';

  console.log('Creating demo user in Supabase Auth...');

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name,
      role: 'user',
    },
  });

  if (authError) {
    if (authError.message.includes('already been registered') || authError.message.includes('already exists')) {
      console.log('ℹ️  Auth user already exists. Fetching existing user...');
      // List users and find by email
      const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) throw listError;
      const existingUser = listData.users.find(u => u.email === email);
      if (!existingUser) throw new Error('User not found after creation attempt');
      
      // Update password
      const { error: updateError } = await supabase.auth.admin.updateUserById(existingUser.id, {
        password,
        email_confirm: true,
      });
      if (updateError) {
        console.error('Failed to update password:', updateError.message);
      } else {
        console.log('✅ Password updated for existing auth user');
      }

      // Check if profile exists in users table
      const { data: existingProfile } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', existingUser.id)
        .single();

      if (existingProfile) {
        console.log('✅ User profile already exists in users table');
      } else {
        // Create profile
        const { error: profileError } = await supabase.from('users').insert({
          name,
          email,
          auth_id: existingUser.id,
          role: 'user',
          plan: 'free',
          plan_status: 'active',
        });
        if (profileError) throw profileError;
        console.log('✅ User profile created in users table');
      }

      console.log('\n🎉 Demo user ready!');
      console.log('Email:', email);
      console.log('Password:', password);
      return;
    }
    throw authError;
  }

  console.log('✅ Auth user created:', authData.user.id);

  // Create user profile in users table
  const { error: profileError } = await supabase.from('users').insert({
    name,
    email,
    auth_id: authData.user.id,
    role: 'user',
    plan: 'free',
    plan_status: 'active',
  });

  if (profileError) {
    if (profileError.message.includes('duplicate') || profileError.code === '23505') {
      console.log('ℹ️  User profile already exists in users table');
    } else {
      throw profileError;
    }
  } else {
    console.log('✅ User profile created in users table');
  }

  console.log('\n🎉 Demo user created successfully!');
  console.log('Email:', email);
  console.log('Password:', password);
}

createDemoUser().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
