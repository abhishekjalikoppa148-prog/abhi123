'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { 
  Sparkles, Heart, Gift, Share2, Volume2, VolumeX, 
  Clock, Flame, Star, Award, Smile, Compass, ChevronDown, X
} from 'lucide-react';

export interface PinkGoldThemeProps {
  personName?: string;
  personNickname?: string;
  personAge?: number;
  birthdayDate?: string;
  relationship?: string;
  creatorName?: string;
  customMessage?: string;
  photos?: { id: string; url: string; caption: string; date?: string }[];
}

export default function PinkGoldTheme({
  personName = 'Sophia',
  personNickname = 'Sophi',
  personAge = 24,
  birthdayDate = '2026-08-25',
  relationship = 'Best Friend',
  creatorName = 'Aarav',
  customMessage,
  photos = [
    {
      id: 'p1',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop',
      caption: 'Beach sunset adventures with you! 🌅',
      date: 'Summer 2025'
    },
    {
      id: 'p2',
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop',
      caption: 'Late night laughter & coffee talks ☕✨',
      date: 'Autumn 2025'
    },
    {
      id: 'p3',
      url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop',
      caption: 'Spontaneous road trips & endless songs 🎵🚗',
      date: 'Spring 2026'
    },
    {
      id: 'p4',
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop',
      caption: 'Radiant smile that brightens any day 💖',
      date: 'Birthday Memory'
    }
  ]
}: PinkGoldThemeProps) {
  // Candle states: 3 candles lit by default
  const [candlesLit, setCandlesLit] = useState<boolean[]>([true, true, true]);
  const [allBlownOut, setAllBlownOut] = useState(false);
  const [showSurpriseModal, setShowSurpriseModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Countdown timer calculation
  const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 8, minutes: 42, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#FFB6C1', '#8B5CF6', '#F5C542', '#EC4899', '#FFE4E8']
    });
  };

  // Trigger fireworks effect
  const triggerFireworks = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#F5C542', '#FFB6C1', '#8B5CF6']
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#F5C542', '#EC4899', '#7C3AED']
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  // Handle extinguishing individual candle
  const blowCandle = (index: number) => {
    const updated = [...candlesLit];
    updated[index] = false;
    setCandlesLit(updated);

    triggerConfetti();

    if (updated.every(c => !c)) {
      setAllBlownOut(true);
      triggerFireworks();
    }
  };

  // Blow all candles out at once
  const blowAllCandles = () => {
    setCandlesLit([false, false, false]);
    setAllBlownOut(true);
    triggerFireworks();
  };

  // Relight candles
  const resetCandles = () => {
    setCandlesLit([true, true, true]);
    setAllBlownOut(false);
  };

  const defaultMsg = customMessage || (
    `Dearest ${personName}, ❤️\n\n` +
    `On your special day, I wanted to create something truly magical to celebrate the extraordinary person you are. ` +
    `Your smile brings warmth to every room, your kindness inspires everyone around you, and your energy makes life an unforgettable adventure.\n\n` +
    `May this year bring you boundless joy, breathtaking travels, beautiful music, and all the dreams your gentle heart desires. ` +
    `Thank you for being my cherished ${relationship}. Happy Birthday! 🥂✨`
  );

  const reasons = [
    {
      title: "Radiant & Electric Energy",
      desc: "You light up every room you walk into with your irresistible smile and positive vibes.",
      icon: Star,
      color: "from-pink-400 to-rose-400"
    },
    {
      title: "Golden Heart & Kind Soul",
      desc: "Your genuine compassion and caring nature make everyone feel deeply loved and valued.",
      icon: Heart,
      color: "from-purple-400 to-indigo-400"
    },
    {
      title: "Unmatched Sense of Humor",
      desc: "Life with you is packed with endless inside jokes, uncontrollable laughter, and fun.",
      icon: Smile,
      color: "from-amber-400 to-yellow-500"
    },
    {
      title: "Dream Chaser & Go-Getter",
      desc: "Your ambition and passion inspire me to work harder and dream bigger every day.",
      icon: Compass,
      color: "from-fuchsia-400 to-pink-500"
    },
    {
      title: "Creative & Unique Vision",
      desc: "You see beauty in the simple things and bring artistic magic into everything you touch.",
      icon: Sparkles,
      color: "from-violet-400 to-purple-500"
    },
    {
      title: "Making Every Moment Magical",
      desc: "Whether it's a simple coffee date or a long trip, memories with you are pure treasure.",
      icon: Award,
      color: "from-amber-300 to-rose-400"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#2D1B36] font-sans relative overflow-x-hidden selection:bg-[#FFB6C1] selection:text-[#2D1B36]">
      
      {/* BACKGROUND FLOATING ELEMENTS: Balloons, Hearts & Stars */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-12 left-8 text-3xl animate-float-slow opacity-60">🎈</div>
        <div className="absolute top-32 right-12 text-3xl animate-float opacity-70">💖</div>
        <div className="absolute top-2/3 left-16 text-4xl animate-float-slow opacity-50">✨</div>
        <div className="absolute bottom-24 right-20 text-3xl animate-float opacity-60">🎈</div>
        <div className="absolute top-1/2 right-1/4 text-2xl animate-sparkle opacity-80">⭐</div>
        <div className="absolute top-1/4 left-1/3 text-2xl animate-float opacity-60">🌸</div>
        
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-pink-200/40 via-purple-200/30 to-amber-200/40 rounded-full blur-[150px] -z-10" />
      </div>

      {/* TOP NAVIGATION BAR */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-[#FFF8F0]/80 border-b border-pink-200/60 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FFB6C1] via-[#8B5CF6] to-[#F5C542] flex items-center justify-center text-white font-bold text-xs shadow-md">
            👑
          </span>
          <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#2D1B36]">
            {personName}&apos;s Birthday Surprise ✨
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAudioPlaying(!isAudioPlaying)}
            className="p-2 rounded-full bg-white/80 hover:bg-pink-100 border border-pink-200 text-[#8B5CF6] transition-colors shadow-sm cursor-pointer"
            title={isAudioPlaying ? "Mute Background Music" : "Play Background Music"}
          >
            {isAudioPlaying ? <Volume2 className="w-4 h-4 text-pink-500 animate-pulse" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: `Happy Birthday ${personName}!`, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Birthday webpage link copied to clipboard! 📋✨');
              }
            }}
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#8B5CF6] to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-500/20 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" /> Share Surprise
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-12 sm:pt-20 pb-16 px-4 text-center max-w-4xl mx-auto space-y-8">
        
        {/* Floating Crown / Cake Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-pink-200 shadow-lg text-xs font-bold text-[#8B5CF6] animate-bounce">
          <Sparkles className="w-4 h-4 text-[#F5C542]" />
          <span>CELEBRATING {personName.toUpperCase()}&apos;S SPECIAL DAY</span>
          <span className="px-2 py-0.5 rounded-full bg-[#FFB6C1] text-[#2D1B36] font-black text-[10px]">TURNING {personAge}</span>
        </div>

        {/* Large Animated Heading */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none text-[#2D1B36]">
            Happy Birthday, <br />
            <span className="bg-gradient-to-r from-pink-500 via-[#8B5CF6] to-[#F5C542] bg-clip-text text-transparent drop-shadow-sm">
              {personName} {personNickname ? `(${personNickname})` : ''} 🎂✨
            </span>
          </h1>
          <p className="text-lg sm:text-2xl text-[#8B5CF6] font-bold italic tracking-wide">
            &ldquo;Today is all about celebrating YOU!&rdquo; 💖
          </p>
        </div>

        {/* Hero Glowing Cake Illustration */}
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 mx-auto my-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-300 via-purple-300 to-amber-200 rounded-full blur-3xl opacity-70 animate-pulse-glow" />
          <div className="relative z-10 w-full h-full rounded-3xl bg-white/80 backdrop-blur-md border-2 border-pink-200 shadow-2xl flex flex-col items-center justify-center p-6 space-y-2">
            <span className="text-6xl sm:text-7xl animate-float">🎂</span>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#8B5CF6] bg-pink-100 px-3 py-1 rounded-full border border-pink-200">
              Blow Candles Below 🕯️
            </span>
          </div>
        </div>

        {/* Call to Action Button */}
        <div className="pt-2">
          <button
            onClick={() => {
              triggerConfetti();
              document.getElementById('countdown-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-[#8B5CF6] to-[#F5C542] hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-lg shadow-xl shadow-pink-500/25 flex items-center justify-center gap-3 mx-auto transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-[#F5C542] animate-spin" />
            <span>Start the Celebration 🎉</span>
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="pt-8 flex justify-center text-pink-400 animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* SECTION 1: ANIMATED BIRTHDAY COUNTDOWN */}
      <section id="countdown-section" className="relative z-10 py-12 px-4 max-w-4xl mx-auto">
        <div className="glass-cream-card rounded-3xl p-6 sm:p-10 border border-pink-200/80 shadow-xl space-y-6 text-center">
          
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-widest text-[#8B5CF6] flex items-center justify-center gap-1.5">
              <Clock className="w-4 h-4 text-[#F5C542]" /> Celebration Timer
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2D1B36]">
              Countdown to {personName}&apos;s Birthday Year ⏳✨
            </h2>
          </div>

          <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-xl mx-auto pt-2">
            {[
              { label: 'Days', val: timeLeft.days },
              { label: 'Hours', val: timeLeft.hours },
              { label: 'Mins', val: timeLeft.minutes },
              { label: 'Secs', val: timeLeft.seconds }
            ].map((unit, idx) => (
              <div key={idx} className="bg-white/90 rounded-2xl p-3 sm:p-5 border border-pink-200 shadow-md text-center">
                <span className="block text-2xl sm:text-4xl font-black text-[#8B5CF6] font-mono">
                  {String(unit.val).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-extrabold uppercase text-slate-500 tracking-wider">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs font-semibold text-[#8B5CF6]">
            Every second is a reminder of how awesome you are! 💖
          </p>
        </div>
      </section>

      {/* SECTION 2: PHOTO MEMORIES GALLERY */}
      <section className="relative z-10 py-12 px-4 max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full bg-pink-100 border border-pink-300 text-xs font-extrabold text-pink-600 uppercase tracking-wider">
            📸 Treasury of Moments
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2D1B36]">
            Photo Memories With {personName} 💕
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Click any picture to expand and view precious memories captured together.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {photos.map((photo, idx) => (
            <div
              key={photo.id || idx}
              onClick={() => setSelectedPhoto(photo.url)}
              className="glass-cream-card glass-cream-card-hover p-4 rounded-3xl cursor-pointer space-y-3 relative group"
            >
              {/* Gold Pin Accent */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#F5C542] border-2 border-white shadow-md z-20" />
              
              <div className="relative h-56 w-full rounded-2xl overflow-hidden border border-pink-100">
                <Image
                  src={photo.url}
                  alt={photo.caption}
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="space-y-1 text-center">
                <p className="text-xs font-bold text-[#2D1B36] line-clamp-2">{photo.caption}</p>
                {photo.date && (
                  <span className="text-[10px] font-semibold text-[#8B5CF6] block">{photo.date}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: SPECIAL HANDWRITTEN MESSAGE */}
      <section className="relative z-10 py-12 px-4 max-w-3xl mx-auto">
        <div className="relative bg-white/90 rounded-3xl p-8 sm:p-12 border-2 border-pink-200 shadow-2xl space-y-6">
          
          {/* Wax Seal Icon */}
          <div className="absolute -top-6 right-8 w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-[#8B5CF6] border-2 border-white shadow-lg flex items-center justify-center text-white text-lg">
            💌
          </div>

          <div className="space-y-2 border-b border-pink-100 pb-4">
            <span className="text-xs font-extrabold text-[#8B5CF6] uppercase tracking-widest">
              A Personal Letter For You
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2D1B36]">
              Dear {personName}, 🌹
            </h2>
          </div>

          {/* Message Text with Handwritten styling */}
          <div className="text-lg sm:text-xl font-handwriting leading-relaxed text-[#2D1B36] whitespace-pre-line tracking-wide">
            {defaultMsg}
          </div>

          <div className="pt-4 border-t border-pink-100 flex items-center justify-between text-xs font-bold text-[#8B5CF6]">
            <span>Crafted with infinite love ❤️</span>
            <span>— {creatorName}</span>
          </div>
        </div>
      </section>

      {/* SECTION 4: REASONS YOU'RE SPECIAL */}
      <section className="relative z-10 py-12 px-4 max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full bg-purple-100 border border-purple-300 text-xs font-extrabold text-[#8B5CF6] uppercase tracking-wider">
            ⭐ Why You Are One Of A Kind
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2D1B36]">
            6 Reasons You&apos;re So Special 💖
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-cream-card glass-cream-card-hover p-6 rounded-3xl space-y-3 border border-pink-200"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-md`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold text-[#2D1B36]">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 5: INTERACTIVE BIRTHDAY CAKE & CANDLE BLOWING */}
      <section className="relative z-10 py-12 px-4 max-w-3xl mx-auto">
        <div className="glass-cream-card rounded-3xl p-8 sm:p-12 border-2 border-pink-300 shadow-2xl text-center space-y-8 relative overflow-hidden">
          
          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-xs font-extrabold text-[#F5C542] uppercase tracking-wider">
              🕯️ Interactive Candle Blowing
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2D1B36]">
              Make A Wish & Blow Out Candles! 🎂
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Tap each candle flame below to blow it out and trigger a fireworks burst!
            </p>
          </div>

          {/* Interactive Cake with Candles */}
          <div className="py-6 flex flex-col items-center justify-center space-y-6">
            
            {/* Candle Container */}
            <div className="flex justify-center items-end gap-8 h-20">
              {candlesLit.map((isLit, i) => (
                <div
                  key={i}
                  onClick={() => blowCandle(i)}
                  className="flex flex-col items-center cursor-pointer group"
                  title="Click to blow candle out!"
                >
                  {/* Flame */}
                  {isLit ? (
                    <div className="w-5 h-7 bg-gradient-to-t from-amber-500 via-yellow-400 to-white rounded-full animate-flame shadow-lg shadow-amber-400/80 group-hover:scale-125 transition-transform" />
                  ) : (
                    <div className="w-2 h-4 bg-slate-300 rounded-full opacity-60 animate-pulse text-[10px] flex items-center justify-center text-slate-500">
                      💨
                    </div>
                  )}

                  {/* Candle Stick */}
                  <div className="w-4 h-12 bg-gradient-to-b from-pink-300 via-purple-300 to-pink-400 rounded-t-md border border-pink-400 shadow-md" />
                </div>
              ))}
            </div>

            {/* Cake Base */}
            <div className="w-56 sm:w-64 h-24 bg-gradient-to-r from-pink-300 via-purple-200 to-amber-200 rounded-b-3xl border-b-4 border-pink-400 shadow-xl flex items-center justify-center relative">
              <span className="text-xs font-black uppercase text-[#2D1B36] tracking-widest bg-white/80 px-4 py-1.5 rounded-full shadow-sm border border-pink-200">
                {allBlownOut ? "✨ Wish Granted! 🎉" : `Happy ${personAge}th Birthday!`}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={blowAllCandles}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-[#8B5CF6] hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-xs shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Flame className="w-4 h-4 text-amber-300" /> Blow All Candles Out 💨
            </button>

            {allBlownOut && (
              <button
                onClick={resetCandles}
                className="px-6 py-3 rounded-full bg-white hover:bg-pink-100 border border-pink-300 text-[#8B5CF6] font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>Relight Candles 🕯️</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 6: SURPRISE BUTTON & FIREWORKS REVEAL */}
      <section className="relative z-10 py-12 px-4 max-w-3xl mx-auto text-center">
        <div className="glass-cream-card rounded-3xl p-8 sm:p-12 border border-pink-200 shadow-xl space-y-6">
          <span className="text-4xl animate-bounce block">🎁</span>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2D1B36]">
              A Hidden Birthday Gift For {personName} 💖
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Tap the surprise button below to unlock secret birthday wishes and fireworks!
            </p>
          </div>

          <button
            onClick={() => {
              triggerFireworks();
              setShowSurpriseModal(true);
            }}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-[#F5C542] via-pink-500 to-[#8B5CF6] hover:scale-105 text-white font-extrabold text-base shadow-xl shadow-amber-400/30 flex items-center justify-center gap-2.5 mx-auto transition-transform cursor-pointer"
          >
            <Gift className="w-5 h-5 text-white animate-bounce" />
            <span>Open Birthday Surprise Gift Box ✨</span>
          </button>
        </div>
      </section>

      {/* SECTION 7: FINAL GRAND FINALE SECTION */}
      <section className="relative z-10 pt-12 pb-24 px-4 max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <span className="text-6xl sm:text-7xl animate-bounce inline-block">👑🥳✨</span>
          <h2 className="text-4xl sm:text-6xl font-black text-[#2D1B36] tracking-tight">
            Happy Birthday, {personName}! 💖
          </h2>
          <p className="text-base sm:text-xl text-[#8B5CF6] font-extrabold max-w-xl mx-auto">
            May your year ahead be packed with endless adventures, peace, laughter, and unbelievable success! 🥂✨
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={triggerFireworks}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-[#8B5CF6] text-white font-extrabold text-xs shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" /> Trigger Celebration Fireworks 🎆
          </button>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-6 py-3 rounded-full bg-white border border-pink-200 text-[#8B5CF6] font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span>Back to Top ⬆️</span>
          </button>
        </div>
      </section>

      {/* MODAL 1: SURPRISE GIFT POPUP */}
      {showSurpriseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 border-2 border-pink-300 shadow-2xl text-center space-y-6 animate-in zoom-in-95">
            <button
              onClick={() => setShowSurpriseModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-pink-100 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-400 to-[#8B5CF6] flex items-center justify-center text-3xl mx-auto shadow-lg text-white">
              🎁
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-[#2D1B36]">
                Surprise Wish Unlocked! ✨
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-semibold">
                &ldquo;You make the world infinitely brighter, sweeter, and happier just by being in it. Always stay true to yourself!&rdquo; 💖
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200 text-xs font-bold text-[#8B5CF6]">
              🎉 Celebration Fireworks Activated!
            </div>

            <button
              onClick={() => setShowSurpriseModal(false)}
              className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 to-[#8B5CF6] text-white font-extrabold text-xs shadow-md cursor-pointer"
            >
              Close & Celebrate 🥳
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: EXPANDED PHOTO MEMORY */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md cursor-pointer animate-in fade-in"
        >
          <div className="relative max-w-2xl w-full h-[70vh] rounded-3xl overflow-hidden border-2 border-pink-300 shadow-2xl">
            <Image
              src={selectedPhoto}
              alt="Expanded Memory"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}
