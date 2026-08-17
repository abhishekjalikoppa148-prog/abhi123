import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/mysql';
import { hasFeatureAccess } from '@/lib/limits';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { style, personName, relationship, aboutThem, memories, websiteId } = await request.json();

    if (!personName || !style) {
      return NextResponse.json({ error: 'Person name and style are required' }, { status: 400 });
    }

    // Check if user has AI feature access based on their plan
    const user = await query<any[]>('SELECT plan FROM users WHERE id = ?', [session.userId]);
    if (user.length > 0) {
      const userPlan = user[0].plan || 'free';
      if (!hasFeatureAccess(userPlan, 'hasAI')) {
        return NextResponse.json({ 
          error: 'AI generation is not available on your current plan. Upgrade to premium or ultimate to use AI features.',
          currentPlan: userPlan
        }, { status: 403 });
      }
    }

    // Track AI usage
    await query(
      'INSERT INTO ai_usage (id, user_id, website_id, generated_at) VALUES (?, ?, ?, NOW())',
      [`ai-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, session.userId, websiteId || null]
    );

    // Use OpenAI API for real AI generation
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const prompt = `Generate a ${style} birthday message for ${personName}. ${relationship ? `Relationship: ${relationship}.` : ''} ${aboutThem ? `About them: ${aboutThem}.` : ''} ${memories ? `Memories: ${memories}.` : ''} Keep it heartfelt and personal. Include appropriate emojis.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a creative birthday message writer. Generate heartfelt, personalized birthday messages based on the provided context.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      return NextResponse.json({ error: 'Failed to generate message' }, { status: 500 });
    }

    const data = await response.json();
    const generatedMessage = data.choices[0]?.message?.content || 'Happy Birthday! 🎂';

    return NextResponse.json({ success: true, message: generatedMessage });
  } catch (error) {
    console.error('AI generation error:', error);
    return NextResponse.json({ error: 'Failed to generate message' }, { status: 500 });
  }
}
