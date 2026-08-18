import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { hasFeatureAccess } from '@/lib/limits';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { style, personName, relationship, aboutThem, memories, websiteId } =
      await request.json();

    if (!personName || !style) {
      return NextResponse.json(
        { error: 'Person name and style are required' },
        { status: 400 }
      );
    }

    // Check if user has AI feature access based on their plan
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('plan')
      .eq('id', session.userId)
      .single();
    
    const userPlan = (user as any)?.plan || 'free';

    if (!hasFeatureAccess(userPlan as any, 'hasAI')) {
      return NextResponse.json(
        {
          error:
            'AI generation is not available on your current plan. Upgrade to premium or ultimate to use AI features.',
          currentPlan: userPlan,
        },
        { status: 403 }
      );
    }

    const prompt = `Generate a ${style} birthday message for ${personName}. ${
      relationship ? `Relationship: ${relationship}.` : ''
    } ${aboutThem ? `About them: ${aboutThem}.` : ''} ${
      memories ? `Memories: ${memories}.` : ''
    } Keep it heartfelt and personal. Include appropriate emojis.`;

    let generatedMessage = 'Happy Birthday! 🎂';

    // Use OpenAI API if key is present
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey && apiKey !== 'mock_openai_key') {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'You are a creative birthday message writer. Generate heartfelt, personalized birthday messages based on the provided context.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        generatedMessage =
          data.choices?.[0]?.message?.content || generatedMessage;
      } else {
        console.error('OpenAI API response error:', await response.text());
      }
    } else {
      // Offline / fallback template generator
      const { generateAIBirthdayWish } = await import('@/lib/ai-generator');
      generatedMessage = await generateAIBirthdayWish({
        personName,
        relationship,
        style: style as any,
        customInfo: aboutThem,
      } as any);
    }

    // Track AI usage in Supabase
    await supabaseAdmin.from('ai_usage').insert({
      id: `ai-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      user_id: session.userId,
      website_id: websiteId || null,
      used_today: 1,
      reset_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
    } as any);

    return NextResponse.json({ success: true, message: generatedMessage });
  } catch (error) {
    console.error('AI generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate message' },
      { status: 500 }
    );
  }
}
