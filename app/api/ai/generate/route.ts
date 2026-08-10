import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { style, personName, relationship, aboutThem, memories } = await request.json();

    if (!personName || !style) {
      return NextResponse.json({ error: 'Person name and style are required' }, { status: 400 });
    }

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
        model: 'gpt-3.5-turbo',
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
