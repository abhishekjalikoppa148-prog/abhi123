export type AIStyle = 
  | 'emotional'
  | 'funny'
  | 'romantic'
  | 'friendship'
  | 'family'
  | 'cute'
  | 'inspirational'
  | 'short'
  | 'long';

export interface AIGenerateOptions {
  personName: string;
  personNickname?: string;
  relationship?: string;
  age?: number;
  hobbies?: string[];
  favPlace?: string;
  favFood?: string;
  style: AIStyle;
}

export function generateAIBirthdayWish(options: AIGenerateOptions): string {
  const { personName, personNickname, relationship = 'friend', age, hobbies = [], favPlace, favFood, style } = options;
  const name = personNickname ? `${personName} (${personNickname})` : personName;
  const ageStr = age ? ` Turning ${age} looks so breathtakingly good on you!` : '';
  const hobbyStr = hobbies.length > 0 ? ` May your year be packed with endless ${hobbies.join(', ')} and adventures.` : '';
  const placeStr = favPlace ? ` Here is to another year of dreaming big and visiting ${favPlace}!` : '';
  const foodStr = favFood ? ` Hope you get to eat endless ${favFood} today without any guilt!` : '';

  switch (style) {
    case 'emotional':
      return `Dearest ${name}, ❤️\n\n` +
        `On your special day, I wanted to take a moment to tell you how truly deeply blessed I am to have you in my life as my cherished ${relationship}.${ageStr}\n\n` +
        `Every smile you share, every laugh we have, and every memory we make is a treasure I hold close to my heart.${hobbyStr}\n\n` +
        `May your year ahead bring you peace, unmatched joy, and all the quiet wonders your gentle soul deserves. Happy Birthday! 🎂✨`;

    case 'funny':
      return `Happy Birthday to my favorite human, ${name}! 🥳🎉\n\n` +
        `Another year older, wiser, and slightly closer to needing reading glasses!${ageStr}\n\n` +
        `I promise not to make any old-age jokes today, mostly because I know how sensitive senior citizens can be! 😂${foodStr}\n\n` +
        `May your day be filled with laughter, zero adult responsibilities, and tons of cake. Keep shining like the glorious chaos you are! 🎁`;

    case 'romantic':
      return `To the love of my life, ${name} ❤️\n\n` +
        `Happy Birthday, my darling. You are the sweetest song in my heart and the brightest light in my world.${ageStr}\n\n` +
        `Every single day with you feels like a celebration, but today is extra special because the world was gifted YOU.${placeStr}\n\n` +
        `I promise to love you, hold your hand, and celebrate you today, tomorrow, and forever. Yours always and eternally. 🌹✨`;

    case 'friendship':
      return `Happy Birthday to my absolute bestie, ${name}! 🥂🔥\n\n` +
        `Life would be so incredibly boring without you! Thank you for being the partner-in-crime, the secret-keeper, and the one who always gets my jokes.${hobbyStr}\n\n` +
        `Here’s to another 365 days of unforgettable memories, late-night chats, and pure madness.${foodStr}\n\n` +
        `Have the most magnificent birthday ever! You deserve all the happiness in the universe! 💖🎉`;

    case 'family':
      return `Happy Birthday ${name}! 👨‍👩‍👧‍👦❤️\n\n` +
        `Family is life’s greatest gift, and having you as part of mine makes every single day brighter and warmer.${ageStr}\n\n` +
        `Thank you for your infinite love, kindness, and all the sacrifices you make to keep our family smiling.${hobbyStr}\n\n` +
        `May God shower you with health, everlasting happiness, and boundless success this year and always. We love you so much! 🎂🎁`;

    case 'cute':
      return `Happy Birthday, cutie ${name}! 🧸✨\n\n` +
        `Wishing the sweetest, happiest, and sparkliest birthday to someone who lights up every room they walk into! 💕\n\n` +
        `May your birthday be overflowing with cute surprises, fluffy hugs, delicious treats, and magical moments!${foodStr}\n\n` +
        `Stay adorable, stay awesome, and never stop spreading your sunshine! 🍰🎈`;

    case 'inspirational':
      return `Happy Birthday, ${name}! 🌟\n\n` +
        `As you enter this new chapter of life, remember that you possess unbelievable strength, talent, and passion.${ageStr}\n\n` +
        `Never stop chasing your wildest dreams, exploring new horizons, and pushing boundaries.${placeStr}${hobbyStr}\n\n` +
        `May this new year bring groundbreaking opportunities, unwavering courage, and boundless fulfillment. The world is yours to conquer! 🚀🎆`;

    case 'short':
      return `Happy Birthday, ${name}! 🎂✨\n\n` +
        `Wishing you an extraordinary day filled with love, laughter, and your favorite things!${ageStr} Have the best year yet! 🎉❤️`;

    case 'long':
    default:
      return `Dearest ${name}, 💖\n\n` +
        `Today isn't just another calendar date—it is the celebration of a truly remarkable soul who makes the world brighter simply by being in it.${ageStr}\n\n` +
        `From our laughter-filled moments to quiet conversations, every memory with you as my ${relationship} is something I cherish deeply.${hobbyStr}${placeStr}\n\n` +
        `On your birthday, my biggest wish for you is that you get everything your heart desires: happiness that knows no bounds, health that never fails, and dreams that come true one by one.${foodStr}\n\n` +
        `Blow out your candles, make a big wish, and know that you are loved beyond measure. Happy Birthday! 🎂🥳🎁✨`;
  }
}
