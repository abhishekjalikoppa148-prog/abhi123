import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: NextRequest) {
  try {
    const { honoreeName = 'Emma', age = 5, theme = 'Magical', relationship = 'Daughter' } = await request.json();
    
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      // Default intelligent response when API key is not configured
      return NextResponse.json({
        title: `${honoreeName}'s ${age ? `${age}th ` : ''}Birthday Celebration`,
        shortDesc: `Join us for an unforgettable celebration honoring ${honoreeName}! There will be delicious food, great music, laughter, and lots of love.`,
        recommendedTemplate: Number(age) < 13 ? 'magical-fairyland' : Number(age) >= 50 ? 'golden-jubilee' : 'elegant',
        suggestedSong: 'Golden Hour Vibes & Celebrations',
        highlights: ['Welcome Cocktails & Mocktails', 'Grand Cake Cutting', 'Live Memory Wall & Photo Booth'],
        venue: 'Grand Horizon Ballroom & Garden Terrace',
        time: '4:00 PM - 9:00 PM',
        suggestedWishes: [
          `Happy Birthday ${honoreeName}! Wishing you a fabulous year ahead! 🎂`,
          `Can't wait to toast to ${honoreeName}'s milestone celebration! 🥂`
        ]
      });
    }

    const aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const prompt = `Generate celebration details for a birthday website in JSON format.
Honoree: ${honoreeName}
Age turning: ${age}
Theme preference: ${theme}
Relationship: ${relationship}

Respond in JSON with this format:
{
  "title": "Emma's 5th Birthday",
  "shortDesc": "Join us for a magical afternoon celebrating Emma's 5th birthday! There will be cake, games, and lots of fun.",
  "recommendedTemplate": "Romantic Hearts",
  "suggestedSong": "Celebration Pop Medley",
  "highlights": ["Bouncy Castle Adventure", "Magical Cupcake Station", "Balloon Art & Sparklers"],
  "venue": "The Secret Garden Oasis, 742 Evergreen Terrace",
  "time": "3:00 PM - 7:00 PM",
  "suggestedWishes": [
    "Happy 5th Birthday Emma! Keep shining bright!",
    "Can't wait to celebrate the most magical 5-year-old!"
  ]
}`;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return NextResponse.json(parsed);

  } catch (error) {
    console.error('[/api/ai/autofill-site] Error:', error);
    
    // Fallback response on error
    const { honoreeName = 'Emma', age = 5 } = await request.json().catch(() => ({ honoreeName: 'Emma', age: 5 }));
    
    return NextResponse.json({
      title: `${honoreeName}'s ${age ? `${age}th ` : ''}Birthday Celebration`,
      shortDesc: `Join us for an unforgettable celebration honoring ${honoreeName}! There will be delicious food, great music, laughter, and lots of love.`,
      recommendedTemplate: Number(age) < 13 ? 'magical-fairyland' : Number(age) >= 50 ? 'golden-jubilee' : 'elegant',
      suggestedSong: 'Golden Hour Vibes & Celebrations',
      highlights: ['Welcome Cocktails & Mocktails', 'Grand Cake Cutting', 'Live Memory Wall & Photo Booth'],
      venue: 'Grand Horizon Ballroom & Garden Terrace',
      time: '4:00 PM - 9:00 PM',
      suggestedWishes: [
        `Happy Birthday ${honoreeName}! Wishing you a fabulous year ahead! 🎂`,
        `Can't wait to toast to ${honoreeName}'s milestone celebration! 🥂`
      ]
    });
  }
}
