'use client';

import { useState } from 'react';
import { Sparkles, Edit2, X, Play } from 'lucide-react';

interface PersonalizedOpeningProps {
  creatorName: string;
  relationship: string;
  personName: string;
  customMessage?: string;
  onMessageChange?: (message: string) => void;
}

const getDefaultMessage = (creator: string, rel: string, name: string): string => {
  const relLower = rel.toLowerCase();
  
  if (relLower.includes('partner') || relLower.includes('love')) {
    return `Hey ${name}... I have something special to share with you. ❤️`;
  } else if (relLower.includes('friend')) {
    return `Hey ${name}! Get ready for something amazing! 🎉`;
  } else if (relLower.includes('parent') || relLower.includes('mom') || relLower.includes('dad')) {
    return `To my wonderful ${name}... You mean the world to me. 🌟`;
  } else if (relLower.includes('sibling') || relLower.includes('brother') || relLower.includes('sister')) {
    return `Hey ${name}! Your sibling made this just for you! 💝`;
  } else if (relLower.includes('colleague') || relLower.includes('coworker')) {
    return `Happy Birthday ${name}! Wishing you the best! 🎂`;
  } else {
    return `Hey ${name}! Someone special made this birthday surprise just for you! 🎁`;
  }
};

export default function PersonalizedOpening({
  creatorName,
  relationship,
  personName,
  customMessage,
  onMessageChange
}: PersonalizedOpeningProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(customMessage || getDefaultMessage(creatorName, relationship, personName));

  const handleSave = () => {
    onMessageChange?.(message);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-rose-400" />
          <h3 className="text-lg font-bold text-white">Opening Message</h3>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          {isEditing ? <X className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
        </button>
      </div>

      {!isEditing ? (
        <div className="p-6 rounded-2xl glass-luxury text-center space-y-4">
          <div className="text-6xl animate-bounce">🎁</div>
          <p className="text-xl sm:text-2xl font-semibold text-white">{message}</p>
          <p className="text-sm text-slate-400">- {creatorName}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your personalized opening message..."
            rows={4}
            className="w-full px-4 py-3 rounded-2xl glass-luxury text-white text-sm focus:border-rose-500 focus:outline-none resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={() => { setMessage(getDefaultMessage(creatorName, relationship, personName)); }}
              className="flex-1 py-2 rounded-xl glass-luxury text-slate-300 hover:text-white font-bold text-sm"
            >
              Reset to Default
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-sm"
            >
              Save Message
            </button>
          </div>
        </div>
      )}

      {/* Preview */}
      {!isEditing && (
        <div className="text-center">
          <button className="magnetic-btn px-6 py-3 rounded-xl glass-luxury text-slate-300 hover:text-white font-bold text-sm flex items-center gap-2 mx-auto hover:scale-105 transition-transform">
            <Play className="w-4 h-4" /> Preview Opening
          </button>
        </div>
      )}
    </div>
  );
}
