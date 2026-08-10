'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Gift, Play, ArrowRight, Sparkles } from 'lucide-react';

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showCake, setShowCake] = useState(false);
  const [candlesBlown, setCandlesBlown] = useState(false);

  const demoSteps = [
    { id: 0, title: "Hey Ananya...", subtitle: "Someone made something special for you." },
    { id: 1, title: "Open Your Surprise", subtitle: "Click to reveal your birthday gift 🎁" },
    { id: 2, title: "Happy Birthday!", subtitle: "Wishing you the most amazing day! 🎂" },
    { id: 3, title: "Our Memories", subtitle: "All the beautiful moments we've shared 💕" },
    { id: 4, title: "Make a Wish", subtitle: "Blow out the candles and make your wish ✨" },
    { id: 5, title: "Your Wish Came True!", subtitle: "May all your dreams come true! 🌟" }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < demoSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleOpenSurprise = () => {
    setCurrentStep(2);
  };

  const handleMakeWish = () => {
    setCandlesBlown(true);
    setTimeout(() => setCurrentStep(5), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        
        {/* Demo Header */}
        <div className="fixed top-4 left-4 right-4 flex items-center justify-between z-50">
          <span className="px-3 py-1 rounded-full glass-luxury text-white text-xs font-bold">
            Live Demo
          </span>
          <Link
            href="/builder"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-xs flex items-center gap-2"
          >
            <Gift className="w-4 h-4" /> Create One Like This →
          </Link>
        </div>

        {/* Main Demo Content */}
        <div className="glass-luxury rounded-3xl p-8 sm:p-12 space-y-6 animate-fade-in">
          
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center text-4xl animate-bounce">
                🎁
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white">
                {demoSteps[0].title}
              </h1>
              <p className="text-slate-300 text-lg">{demoSteps[0].subtitle}</p>
              <button
                onClick={handleOpenSurprise}
                className="magnetic-btn ripple px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-lg flex items-center gap-2 mx-auto hover:scale-105 transition-transform"
              >
                <Play className="w-5 h-5" /> Open Your Surprise 🎁
              </button>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-6xl animate-pulse">
                🎁
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white">
                {demoSteps[1].title}
              </h1>
              <p className="text-slate-300 text-lg">{demoSteps[1].subtitle}</p>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-6xl animate-bounce">🎂</div>
              <h1 className="text-4xl sm:text-5xl font-black text-white">
                {demoSteps[2].title}
              </h1>
              <p className="text-slate-300 text-lg">{demoSteps[2].subtitle}</p>
              <div className="p-6 rounded-2xl bg-white/10 space-y-2">
                <p className="text-white text-lg leading-relaxed">
                  "You make every single day brighter with your smile. Today is all about celebrating YOU! May this year bring you endless joy, love, and all your heart's desires. Happy Birthday! ❤️"
                </p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-black text-white">
                {demoSteps[3].title}
              </h1>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square rounded-2xl bg-gradient-to-br from-purple-500/30 to-rose-500/30 border border-white/20 flex items-center justify-center text-4xl">
                    📸
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="relative">
                <div className="text-8xl">🎂</div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`w-2 h-8 rounded-full transition-all duration-500 ${candlesBlown ? 'bg-slate-600 scale-50' : 'bg-amber-500 animate-pulse'}`}
                    />
                  ))}
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white">
                {demoSteps[4].title}
              </h1>
              <button
                onClick={handleMakeWish}
                disabled={candlesBlown}
                className="magnetic-btn ripple px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 text-white font-bold text-lg flex items-center gap-2 mx-auto hover:scale-105 transition-transform disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5" /> {candlesBlown ? 'Wish Made! ✨' : 'Make a Wish'}
              </button>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="text-6xl animate-bounce">🎉</div>
              <h1 className="text-4xl sm:text-5xl font-black text-white">
                {demoSteps[5].title}
              </h1>
              <p className="text-slate-300 text-lg">{demoSteps[5].subtitle}</p>
              <div className="pt-4 space-y-3">
                <Link
                  href="/builder"
                  className="magnetic-btn ripple block w-full px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                >
                  <Gift className="w-5 h-5" /> Create Your Own Birthday Website
                </Link>
                <p className="text-slate-400 text-sm">
                  Free • No payment required • Share on WhatsApp
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2">
          {demoSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentStep ? 'bg-rose-500 scale-125' : 'bg-slate-600'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
