'use client';

import { useState } from 'react';
import { Wand2, RefreshCw, Sparkles, Heart, Laugh, Users, Home, Briefcase, Check, X } from 'lucide-react';

interface AIBirthdayAssistantProps {
  personName: string;
  relationship: string;
  aboutThem: string;
  onMessageGenerated: (message: string) => void;
  initialMessage?: string;
}

type AIStyle = 'emotional' | 'funny' | 'romantic' | 'friendship' | 'family' | 'inspirational' | 'short';

type ModificationType = 'shorter' | 'funnier' | 'more_emotional' | 'more_romantic';

export default function AIBirthdayAssistant({
  personName,
  relationship,
  aboutThem,
  onMessageGenerated,
  initialMessage
}: AIBirthdayAssistantProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStyle, setCurrentStyle] = useState<AIStyle>('emotional');
  const [generatedMessage, setGeneratedMessage] = useState(initialMessage || '');
  const [showOptions, setShowOptions] = useState(false);

  const generateMessage = async (style: AIStyle = currentStyle) => {
    setIsGenerating(true);
    setCurrentStyle(style);
    
    // Simulate AI generation (in production, call the API)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const messages: Record<AIStyle, string> = {
      emotional: `Happy Birthday ${personName}! 🎉\n\nOn this special day, I want you to know how much you mean to me. Your kindness, your smile, and your beautiful soul make the world a better place. May this year bring you all the happiness you deserve and more. Here's to another year of amazing memories together! ❤️`,
      funny: `Happy Birthday ${personName}! 🎂\n\nAnother year older, another year wiser... or so they say! 😂 You're not aging, you're just leveling up in life! May your birthday be filled with cake, laughter, and zero responsibilities. Let's party like it's your birthday (because it IS your birthday)! 🎉`,
      romantic: `Happy Birthday my love, ${personName} ❤️\n\nEvery moment with you feels like a beautiful dream I never want to wake up from. You are my sunshine, my rock, and my everything. Today, on your special day, I want you to feel as special as you make me feel every single day. I love you more than words can say. 💕`,
      friendship: `Happy Birthday ${personName}! 🥂\n\nTo my amazing friend - thank you for being there through all the ups and downs, the laughter, and the crazy adventures. Life is so much better with you in it. Here's to another year of friendship, inside jokes, and unforgettable memories. You deserve the world! 🌟`,
      family: `Happy Birthday ${personName}! 🏡\n\nFamily isn't just about blood, it's about love, support, and being there for each other. You bring so much joy and warmth to our family. Today we celebrate not just your birthday, but the wonderful person you are. May your day be filled with love and blessings! 💖`,
      inspirational: `Happy Birthday ${personName}! 🚀\n\nThis year, may you have the courage to chase your dreams, the strength to overcome challenges, and the wisdom to appreciate every moment. You have incredible potential, and I believe in you. Make this year your best one yet! The world is waiting for your greatness! ✨`,
      short: `Happy Birthday ${personName}! 🎂\n\nWishing you a day filled with love, laughter, and all your favorite things. You deserve the best! 🎉`
    };

    setGeneratedMessage(messages[style]);
    setIsGenerating(false);
    setShowOptions(true);
  };

  const modifyMessage = async (modification: ModificationType) => {
    setIsGenerating(true);
    
    // Simulate modification (in production, call the API)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let modified = generatedMessage;
    
    switch (modification) {
      case 'shorter':
        modified = generatedMessage.split('\n\n')[0] + '\n\nWishing you the happiest birthday! 🎂';
        break;
      case 'funnier':
        modified = generatedMessage.replace(/! /g, '! 😂 ').replace(/🎂/g, '🎂🤣');
        break;
      case 'more_emotional':
        modified = generatedMessage.replace(/❤️/g, '❤️❤️❤️').replace(/💕/g, '💕💕');
        break;
      case 'more_romantic':
        modified = generatedMessage.replace(/love/g, 'deeply love').replace(/special/g, 'extraordinary');
        break;
    }
    
    setGeneratedMessage(modified);
    setIsGenerating(false);
  };

  const useMessage = () => {
    onMessageGenerated(generatedMessage);
    setShowOptions(false);
  };

  const styleOptions: { id: AIStyle; label: string; icon: any; color: string }[] = [
    { id: 'emotional', label: 'Emotional', icon: Heart, color: 'text-rose-400' },
    { id: 'funny', label: 'Funny', icon: Laugh, color: 'text-amber-400' },
    { id: 'romantic', label: 'Romantic', icon: Heart, color: 'text-pink-400' },
    { id: 'friendship', label: 'Friendship', icon: Users, color: 'text-purple-400' },
    { id: 'family', label: 'Family', icon: Home, color: 'text-emerald-400' },
    { id: 'inspirational', label: 'Inspirational', icon: Sparkles, color: 'text-cyan-400' },
    { id: 'short', label: 'Short', icon: Briefcase, color: 'text-slate-400' }
  ];

  const modificationOptions: { id: ModificationType; label: string }[] = [
    { id: 'shorter', label: 'Make shorter' },
    { id: 'funnier', label: 'Make funnier' },
    { id: 'more_emotional', label: 'More emotional' },
    { id: 'more_romantic', label: 'More romantic' }
  ];

  return (
    <div className="space-y-4">
      
      {/* Main Button */}
      <button
        onClick={() => generateMessage()}
        disabled={isGenerating}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
      >
        <Wand2 className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
        {isGenerating ? 'Generating...' : '✨ Birthday AI'}
      </button>

      {/* Style Selection */}
      {!showOptions && (
        <div className="p-4 rounded-2xl glass-luxury space-y-3">
          <p className="text-xs font-semibold text-slate-300">Choose AI Style:</p>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {styleOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => generateMessage(option.id)}
                  disabled={isGenerating}
                  className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
                    currentStyle === option.id
                      ? 'bg-purple-500/20 border border-purple-500/40'
                      : 'bg-slate-900/50 hover:bg-slate-900 border border-slate-700'
                  } disabled:opacity-50`}
                >
                  <Icon className={`w-4 h-4 ${option.color}`} />
                  <span className="text-[10px] text-slate-300">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Generated Message with Options */}
      {showOptions && generatedMessage && (
        <div className="p-4 rounded-2xl glass-luxury space-y-4 animate-fade-in">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Generated Message:</span>
            <button
              onClick={() => setShowOptions(false)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <textarea
            value={generatedMessage}
            onChange={(e) => setGeneratedMessage(e.target.value)}
            rows={6}
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none resize-none"
          />

          {/* Modification Options */}
          <div className="flex flex-wrap gap-2">
            {modificationOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => modifyMessage(option.id)}
                disabled={isGenerating}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                {option.label}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => generateMessage()}
              disabled={isGenerating}
              className="flex-1 py-2 rounded-xl glass-luxury text-slate-300 hover:text-white font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              Regenerate
            </button>
            <button
              onClick={useMessage}
              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-sm flex items-center justify-center gap-1"
            >
              <Check className="w-4 h-4" /> Use This
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
