'use client';

import { useState } from 'react';
import { Gift, Sparkles } from 'lucide-react';

interface GiftBoxProps {
  personName: string;
  creatorName?: string;
  onOpen: () => void;
}

export default function GiftBox({ personName, creatorName, onOpen }: GiftBoxProps) {
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    setOpening(true);
    setTimeout(() => {
      onOpen();
    }, 900);
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-12 relative overflow-hidden">
      
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-purple-950/60 to-slate-950 -z-10" />
      <div className="absolute w-96 h-96 rounded-full bg-rose-600/20 blur-3xl -z-10 animate-pulse-glow" />

      {/* Floating Sparkles */}
      <div className="absolute top-10 left-10 text-amber-400 opacity-60 animate-sparkle">✨</div>
      <div className="absolute top-20 right-12 text-rose-400 opacity-70 animate-sparkle" style={{ animationDelay: '0.7s' }}>💖</div>
      <div className="absolute bottom-16 left-16 text-purple-400 opacity-60 animate-sparkle" style={{ animationDelay: '1.2s' }}>🎁</div>

      {/* Main Text */}
      <div className="max-w-md space-y-4 mb-10">
        <span className="px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Special Birthday Delivery
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          Hey <span className="bg-gradient-to-r from-rose-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">{personName}</span>...
        </h1>
        
        <p className="text-base text-slate-300 font-medium">
          {creatorName ? `${creatorName} created a special surprise website just for you!` : 'I have a special birthday surprise for you!'} 🎁
        </p>
      </div>

      {/* Interactive Gift Box Graphic */}
      <div 
        onClick={handleOpen}
        className="group cursor-pointer my-4 relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center transform transition-transform hover:scale-105"
      >
        <div className={`relative w-full h-full flex flex-col items-center justify-center transition-all duration-700 ${opening ? 'scale-125 opacity-0 rotate-12' : 'animate-gift-bounce'}`}>
          
          {/* Gift Box SVG */}
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
            {/* Box Body */}
            <rect x="35" y="80" width="130" height="90" rx="8" fill="#e11d48" />
            
            {/* Box Body Vertical Ribbon */}
            <rect x="88" y="80" width="24" height="90" fill="#f59e0b" />
            
            {/* Box Body Shadow Accent */}
            <path d="M 35 150 L 165 150 L 165 170 C 165 174, 161 170, 157 170 L 43 170 C 39 170, 35 174, 35 170 Z" fill="#be123c" opacity="0.6" />

            {/* Box Lid */}
            <rect 
              x="25" 
              y="60" 
              width="150" 
              height="28" 
              rx="6" 
              fill="#f43f5e" 
              className={`transition-transform duration-500 origin-bottom-left ${opening ? '-translate-y-16 -rotate-45' : ''}`}
            />
            {/* Lid Ribbon */}
            <rect 
              x="88" 
              y="60" 
              width="24" 
              height="28" 
              fill="#fbbf24" 
              className={`transition-transform duration-500 origin-bottom-left ${opening ? '-translate-y-16 -rotate-45' : ''}`}
            />

            {/* Ribbon Bow on top */}
            <g className={`transition-transform duration-500 origin-center ${opening ? '-translate-y-20 -rotate-45 opacity-50' : ''}`}>
              <ellipse cx="78" cy="50" rx="20" ry="12" fill="#f59e0b" transform="rotate(-25 78 50)" />
              <ellipse cx="122" cy="50" rx="20" ry="12" fill="#f59e0b" transform="rotate(25 122 50)" />
              <circle cx="100" cy="54" r="8" fill="#d97706" />
            </g>
          </svg>

          {/* Touch indicator ripple */}
          <div className="absolute -bottom-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-[11px] text-amber-300 font-semibold flex items-center gap-1 shadow-lg">
            <Gift className="w-3.5 h-3.5" /> Tap to Open Gift
          </div>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={handleOpen}
        disabled={opening}
        className="mt-8 px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 via-purple-600 to-amber-400 hover:from-rose-600 hover:to-amber-500 text-white font-extrabold text-lg shadow-2xl shadow-rose-500/30 flex items-center gap-2 transform transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
        {opening ? 'Unwrapping Surprise...' : 'Open Your Surprise ✨'}
      </button>

    </div>
  );
}
