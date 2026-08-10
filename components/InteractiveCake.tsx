'use client';

import { useState } from 'react';
import { Sparkles, Flame } from 'lucide-react';

interface InteractiveCakeProps {
  age?: number;
  onWishMade?: () => void;
}

export default function InteractiveCake({ age = 1, onWishMade }: InteractiveCakeProps) {
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleMakeWish = () => {
    setCandlesBlown(true);
    setShowConfetti(true);
    
    // Trigger confetti animation
    setTimeout(() => {
      onWishMade?.();
    }, 2000);
  };

  const candleCount = Math.min(age, 10); // Limit to 10 candles for performance

  return (
    <div className="flex flex-col items-center space-y-8">
      
      {/* Cake */}
      <div className="relative">
        {/* Cake Base */}
        <div className="w-48 h-32 rounded-b-3xl bg-gradient-to-b from-amber-400 to-amber-600 relative">
          {/* Frosting */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-pink-300 to-pink-400 rounded-t-3xl">
            {/* Drips */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute top-6 w-4 h-6 bg-pink-400 rounded-b-full"
                style={{ left: `${i * 12 + 4}%` }}
              />
            ))}
          </div>
        </div>

        {/* Candles */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-2">
          {[...Array(candleCount)].map((_, i) => (
            <div key={i} className="relative">
              {/* Candle Body */}
              <div className="w-3 h-12 bg-gradient-to-b from-rose-300 to-rose-500 rounded-t-sm" />
              
              {/* Flame */}
              {!candlesBlown && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 animate-pulse">
                  <Flame className="w-6 h-6 text-amber-400 fill-amber-400" />
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-200 rounded-full blur-sm" />
                </div>
              )}
              
              {candlesBlown && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-400 rounded-full opacity-50" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Make a Wish Button */}
      {!candlesBlown && (
        <button
          onClick={handleMakeWish}
          className="magnetic-btn ripple px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 text-white font-bold text-lg flex items-center gap-2 hover:scale-105 transition-transform shadow-2xl shadow-amber-500/30"
        >
          <Sparkles className="w-5 h-5" /> Make a Wish
        </button>
      )}

      {/* Wish Made Message */}
      {candlesBlown && (
        <div className="text-center space-y-2 animate-fade-in">
          <div className="text-6xl">✨</div>
          <p className="text-2xl font-bold text-white">Your wish has been made!</p>
          <p className="text-slate-300">May all your dreams come true 🌟</p>
        </div>
      )}

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px',
                backgroundColor: ['#f43f5e', '#a855f7', '#fbbf24', '#06b6d4', '#10b981'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

    </div>
  );
}
