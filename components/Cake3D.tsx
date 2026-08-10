'use client';

import { useState } from 'react';
import { Sparkles, Wind, RefreshCw } from 'lucide-react';
import { triggerGlobalFireworks } from './ConfettiCanvas';

interface Cake3DProps {
  personName: string;
  age?: number;
  onWishMade?: () => void;
}

export default function Cake3D({ personName, age = 24, onWishMade }: Cake3DProps) {
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [isWishing, setIsWishing] = useState(false);

  // Play synthetic celebration chime & applause using Web Audio API
  const playCelebrationSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Arpeggio notes
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);

        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + i * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.8);
      });
    } catch {
      // Audio synth optional
    }
  };

  const handleMakeWish = () => {
    if (candlesBlown) return;
    setIsWishing(true);

    setTimeout(() => {
      setCandlesBlown(true);
      setIsWishing(false);
      playCelebrationSound();
      triggerGlobalFireworks();
      if (onWishMade) onWishMade();
    }, 600);
  };

  const resetCandles = () => {
    setCandlesBlown(false);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 my-6">
      
      {/* Cake Container */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
        
        {/* Glow backdrop */}
        <div className={`absolute inset-0 rounded-full blur-3xl transition-opacity duration-700 ${candlesBlown ? 'bg-purple-600/20' : 'bg-amber-500/30 animate-pulse'}`} />

        {/* 3D SVG Cake */}
        <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-2xl relative z-10">
          
          {/* Cake Stand / Plate */}
          <ellipse cx="150" cy="245" rx="125" ry="25" fill="#1e293b" stroke="#475569" strokeWidth="4" />
          <ellipse cx="150" cy="240" rx="115" ry="20" fill="#334155" />
          <ellipse cx="150" cy="235" rx="100" ry="15" fill="#f8fafc" opacity="0.9" />

          {/* Bottom Cake Layer */}
          <rect x="65" y="160" width="170" height="65" rx="12" fill="#e11d48" />
          <path d="M 65 190 Q 90 215, 115 190 T 165 190 T 215 190 T 235 190 L 235 225 C 235 230, 225 235, 150 235 C 75 235, 65 230, 65 225 Z" fill="#9f1239" />
          
          {/* Frosting drips bottom */}
          <path d="M 65 160 Q 75 180, 85 160 Q 95 185, 105 160 Q 120 190, 135 160 Q 150 180, 165 160 Q 180 185, 195 160 Q 210 180, 220 160 Q 230 175, 235 160 L 235 170 C 235 170, 220 185, 150 185 C 80 185, 65 170, 65 170 Z" fill="#fff1f2" />

          {/* Top Cake Layer */}
          <rect x="85" y="110" width="130" height="55" rx="10" fill="#8b5cf6" />
          <path d="M 85 135 Q 110 155, 150 155 Q 190 155, 215 135 L 215 165 C 215 168, 190 175, 150 175 C 110 175, 85 168, 85 165 Z" fill="#6d28d9" />

          {/* Frosting Top Layer */}
          <ellipse cx="150" cy="110" rx="65" ry="18" fill="#fdf4ff" />

          {/* Strawberries / Decorations */}
          <circle cx="100" cy="108" r="7" fill="#ef4444" />
          <circle cx="130" cy="115" r="7" fill="#ef4444" />
          <circle cx="170" cy="115" r="7" fill="#ef4444" />
          <circle cx="200" cy="108" r="7" fill="#ef4444" />

          {/* Age Badge */}
          <rect x="130" y="130" width="40" height="24" rx="6" fill="#f59e0b" />
          <text x="150" y="147" textAnchor="middle" fill="#78350f" fontSize="14" fontWeight="bold">
            {age}
          </text>

          {/* Candles */}
          {/* Candle 1 (Left) */}
          <rect x="110" y="70" width="8" height="40" rx="2" fill="#38bdf8" />
          <path d="M 110 75 L 118 75 L 118 78 L 110 78 Z" fill="#0284c7" />
          
          {/* Candle 2 (Center) */}
          <rect x="146" y="62" width="8" height="48" rx="2" fill="#f43f5e" />
          <path d="M 146 68 L 154 68 L 154 71 L 146 71 Z" fill="#be123c" />

          {/* Candle 3 (Right) */}
          <rect x="182" y="70" width="8" height="40" rx="2" fill="#a855f7" />
          <path d="M 182 75 L 190 75 L 190 78 L 182 78 Z" fill="#7e22ce" />

          {/* Candle Wicks */}
          <line x1="114" y1="70" x2="114" y2="64" stroke="#475569" strokeWidth="2" />
          <line x1="150" y1="62" x2="150" y2="54" stroke="#475569" strokeWidth="2" />
          <line x1="186" y1="70" x2="186" y2="64" stroke="#475569" strokeWidth="2" />

          {/* Candle Flames */}
          {!candlesBlown ? (
            <>
              {/* Flame 1 */}
              <g className="animate-flame" style={{ transformOrigin: '114px 54px' }}>
                <path d="M 114 42 Q 122 52, 114 62 Q 106 52, 114 42 Z" fill="#f59e0b" />
                <path d="M 114 47 Q 118 53, 114 60 Q 110 53, 114 47 Z" fill="#fef08a" />
              </g>
              {/* Flame 2 */}
              <g className="animate-flame" style={{ transformOrigin: '150px 44px', animationDelay: '0.2s' }}>
                <path d="M 150 32 Q 159 43, 150 54 Q 141 43, 150 32 Z" fill="#f59e0b" />
                <path d="M 150 37 Q 155 44, 150 52 Q 145 44, 150 37 Z" fill="#fef08a" />
              </g>
              {/* Flame 3 */}
              <g className="animate-flame" style={{ transformOrigin: '186px 54px', animationDelay: '0.4s' }}>
                <path d="M 186 42 Q 194 52, 186 62 Q 178 52, 186 42 Z" fill="#f59e0b" />
                <path d="M 186 47 Q 190 53, 186 60 Q 182 53, 186 47 Z" fill="#fef08a" />
              </g>
            </>
          ) : (
            /* Smoke puffs when blown out */
            <g className="animate-pulse opacity-75">
              <circle cx="114" cy="55" r="5" fill="#94a3b8" />
              <circle cx="118" cy="45" r="7" fill="#cbd5e1" />
              <circle cx="150" cy="45" r="6" fill="#94a3b8" />
              <circle cx="152" cy="35" r="9" fill="#cbd5e1" />
              <circle cx="186" cy="55" r="5" fill="#94a3b8" />
              <circle cx="190" cy="45" r="7" fill="#cbd5e1" />
            </g>
          )}

        </svg>
      </div>

      {/* Action Button */}
      <div className="flex flex-col items-center gap-3">
        {!candlesBlown ? (
          <button
            onClick={handleMakeWish}
            disabled={isWishing}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 hover:from-amber-500 hover:to-purple-700 text-white font-extrabold text-base shadow-xl shadow-amber-500/25 flex items-center gap-2 transform transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Wind className={`w-5 h-5 ${isWishing ? 'animate-spin' : ''}`} />
            {isWishing ? 'Blowing Candles...' : 'Make a Wish ✨'}
          </button>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="px-6 py-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-sm flex items-center gap-2 animate-bounce">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Wish Granted for {personName}! 🎉
            </div>
            <button
              onClick={resetCandles}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 underline pt-1"
            >
              <RefreshCw className="w-3 h-3" /> Relight Candles
            </button>
          </div>
        )}
        
        <p className="text-xs text-slate-400 text-center max-w-xs">
          {!candlesBlown 
            ? 'Click "Make a Wish" to blow out the candles and launch celebration fireworks!' 
            : 'Candles blown! May all your wishes come true.'}
        </p>
      </div>
    </div>
  );
}
