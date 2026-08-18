import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: NextRequest) {
  try {
    const { relationship, tone = 'Funny', length = 'Medium' } = await request.json();
    
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      // Fallback wishes when API key is not configured
      const fallbacks: Record<string, string[]> = {
        Funny: [
          `"Happy Birthday! 🎉 I was going to make an awesome joke about you getting older, but then I remembered how much I rely on you. Hope your day is as amazing and hilarious as you are. Let's celebrate soon! 🥂"`,
          `"Happy Birthday! 🎂 You're not getting older, you're just leveling up and increasing in vintage value! Have the best slice of cake today! 🎈"`,
          `"Happy Birthday! 🥳 Don't count the candles, count all the wonderful memories... and how many drinks we're going to have tonight!"`
        ],
        Emotional: [
          `"Happy Birthday! 🌟 Having you in my life has brought so much warmth, laughter, and joy. Thank you for being such an extraordinary soul. May this year shower you with endless happiness and blessings."`,
          `"Wishing the happiest of birthdays to someone who truly lights up every room. Your kindness and strength inspire everyone around you. Here's to another beautiful chapter! 💖"`
        ],
        Romantic: [
          `"Happy Birthday to my favorite person in the entire universe. 🌹 Every moment with you is a celebration, but today is all about honoring the incredible magic you bring to my world. I love you!"`,
          `"To the love of my life on your birthday: you make every single day sweeter and brighter. Cheers to celebrating you today and always! ✨🥂"`
        ],
        Formal: [
          `"Wishing you a very Happy Birthday and a prosperous year ahead. May this upcoming milestone bring continued success, health, and fulfillment to all your endeavors."`,
          `"Warmest congratulations on your birthday! Wishing you continued accomplishments, joy, and wonderful milestones in the coming year."`
        ],
        Casual: [
          `"Happy Birthday! 🎈 Hope you have a super fun day packed with good food, great friends, and plenty of chill vibes. Let's hang out soon!"`,
          `"Hey, Happy Birthday! 🚀 Hope your day is as awesome and relaxed as you are. Enjoy every single moment of your special day!"`
        ]
      };

      const toneList = fallbacks[tone] || fallbacks.Funny;
      const randomWish = toneList[Math.floor(Math.random() * toneList.length)];
      return NextResponse.json({ wish: randomWish.replace(/^["']|["']$/g, "") });
    }

    const aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const prompt = `Write a heartfelt and memorable birthday wish.
Recipient/Relationship: ${relationship || "Friend"}
Tone: ${tone} (e.g. Funny, Emotional, Romantic, Formal, Casual)
Length: ${length} (Short = 1-2 punchy sentences, Medium = 3-4 warm sentences with emojis, Long = full paragraph)

Return ONLY the text of the birthday wish enclosed in quotes, with appropriate celebratory emojis. Do not add intro or outro markdown explanations.`;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
    });

    const text = response.text?.trim() || "";
    if (text) {
      return NextResponse.json({ wish: text.replace(/^["']|["']$/g, "") });
    }

    // Fallback if AI fails
    const fallbacks: Record<string, string[]> = {
      Funny: [
        `"Happy Birthday! 🎉 I was going to make an awesome joke about you getting older, but then I remembered how much I rely on you. Hope your day is as amazing and hilarious as you are. Let's celebrate soon! 🥂"`,
        `"Happy Birthday! 🎂 You're not getting older, you're just leveling up and increasing in vintage value! Have the best slice of cake today! 🎈"`
      ],
      Emotional: [
        `"Happy Birthday! 🌟 Having you in my life has brought so much warmth, laughter, and joy. Thank you for being such an extraordinary soul. May this year shower you with endless happiness and blessings."`
      ],
      Romantic: [
        `"Happy Birthday to my favorite person in the entire universe. 🌹 Every moment with you is a celebration, but today is all about honoring the incredible magic you bring to my world. I love you!"`
      ],
      Formal: [
        `"Wishing you a very Happy Birthday and a prosperous year ahead. May this upcoming milestone bring continued success, health, and fulfillment to all your endeavors."`
      ],
      Casual: [
        `"Happy Birthday! 🎈 Hope you have a super fun day packed with good food, great friends, and plenty of chill vibes. Let's hang out soon!"`
      ]
    };

    const toneList = fallbacks[tone] || fallbacks.Funny;
    const randomWish = toneList[Math.floor(Math.random() * toneList.length)];
    return NextResponse.json({ wish: randomWish.replace(/^["']|["']$/g, "") });

  } catch (error) {
    console.error('[/api/ai/wish-gemini] Error:', error);
    return NextResponse.json({ error: 'Failed to generate wish' }, { status: 500 });
  }
}
