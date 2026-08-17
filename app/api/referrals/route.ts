import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getUserById } from '@/lib/supabase/db';

const REFERRAL_CREDIT_REWARD = 5;
const REFERRAL_CODE_LENGTH = 8;

function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < REFERRAL_CODE_LENGTH; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get user from Supabase
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, referral_code, referral_credits')
      .eq('id', userId)
      .maybeSingle();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate referral code if doesn't exist
    let referralCode = user.referral_code;
    if (!referralCode) {
      referralCode = generateReferralCode();
      await supabaseAdmin
        .from('users')
        .update({ referral_code: referralCode })
        .eq('id', userId);
    }

    // Get referral count
    const { count } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('referred_by', userId);

    return NextResponse.json({
      success: true,
      data: {
        referralCode,
        referralCredits: user.referral_credits || 0,
        referralCount: count || 0,
        creditReward: REFERRAL_CREDIT_REWARD,
      },
    });
  } catch (error) {
    console.error('Referral fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referral data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { referralCode, userId } = await request.json();

    if (!referralCode || !userId) {
      return NextResponse.json(
        { error: 'Referral code and user ID required' },
        { status: 400 }
      );
    }

    // Find referrer by code in Supabase
    const { data: referrers, error: referrerError } = await supabaseAdmin
      .from('users')
      .select('id, referral_credits')
      .ilike('referral_code', referralCode.trim())
      .limit(1);

    if (referrerError || !referrers || referrers.length === 0) {
      return NextResponse.json(
        { error: 'Invalid referral code' },
        { status: 400 }
      );
    }

    const referrer = referrers[0];

    // Check if user already used a referral
    const user = await getUserById(userId);
    if (user && (user as any).referred_by) {
      return NextResponse.json(
        { error: 'User already used a referral code' },
        { status: 400 }
      );
    }

    // Update referrer credits
    await supabaseAdmin
      .from('users')
      .update({
        referral_credits: (referrer.referral_credits || 0) + REFERRAL_CREDIT_REWARD,
      })
      .eq('id', referrer.id);

    // Mark user as referred
    await supabaseAdmin
      .from('users')
      .update({ referred_by: referrer.id })
      .eq('id', userId);

    return NextResponse.json({
      success: true,
      data: {
        creditReward: REFERRAL_CREDIT_REWARD,
        message: `Referral code applied! You earned ${REFERRAL_CREDIT_REWARD} credits.`,
      },
    });
  } catch (error) {
    console.error('Referral application error:', error);
    return NextResponse.json(
      { error: 'Failed to apply referral code' },
      { status: 500 }
    );
  }
}
