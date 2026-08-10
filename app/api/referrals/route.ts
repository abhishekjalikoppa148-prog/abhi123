import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

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

    // Get user's referral code and stats
    const users = await query('SELECT referral_code, referral_credits FROM users WHERE id = ?', [userId]) as any[];
    
    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = users[0];
    
    // Generate referral code if doesn't exist
    let referralCode = user.referral_code;
    if (!referralCode) {
      referralCode = generateReferralCode();
      await query('UPDATE users SET referral_code = ? WHERE id = ?', [referralCode, userId]);
    }

    // Get referral count
    const referrals = await query(
      'SELECT COUNT(*) as count FROM users WHERE referred_by = ?',
      [userId]
    ) as any[];
    
    const referralCount = referrals[0]?.count || 0;

    return NextResponse.json({
      success: true,
      data: {
        referralCode,
        referralCredits: user.referral_credits || 0,
        referralCount,
        creditReward: REFERRAL_CREDIT_REWARD
      }
    });
  } catch (error) {
    console.error('Referral fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch referral data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { referralCode, userId } = await request.json();

    if (!referralCode || !userId) {
      return NextResponse.json({ error: 'Referral code and user ID required' }, { status: 400 });
    }

    // Find referrer by code
    const referrers = await query(
      'SELECT id, referral_credits FROM users WHERE referral_code = ?',
      [referralCode]
    ) as any[];

    if (referrers.length === 0) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 400 });
    }

    const referrer = referrers[0];

    // Check if user already used a referral
    const users = await query('SELECT referred_by FROM users WHERE id = ?', [userId]) as any[];
    if (users.length > 0 && users[0].referred_by) {
      return NextResponse.json({ error: 'User already used a referral code' }, { status: 400 });
    }

    // Update referrer credits
    await query(
      'UPDATE users SET referral_credits = referral_credits + ? WHERE id = ?',
      [REFERRAL_CREDIT_REWARD, referrer.id]
    );

    // Mark user as referred
    await query(
      'UPDATE users SET referred_by = ? WHERE id = ?',
      [referrer.id, userId]
    );

    return NextResponse.json({
      success: true,
      data: {
        creditReward: REFERRAL_CREDIT_REWARD,
        message: `Referral code applied! You earned ${REFERRAL_CREDIT_REWARD} credits.`
      }
    });
  } catch (error) {
    console.error('Referral application error:', error);
    return NextResponse.json({ error: 'Failed to apply referral code' }, { status: 500 });
  }
}
