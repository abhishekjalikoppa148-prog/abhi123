'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, Gift, Music, Heart, ArrowRight, ShieldCheck, 
  CheckCircle2, Star, Smartphone, Eye, QrCode, Wand2, Play, Flame, Rocket
} from 'lucide-react';
import { TEMPLATES } from '@/lib/sample-data';

export default function LandingPage() {
  const [selectedDemoTemplate, setSelectedDemoTemplate] = useState('romantic');

  const activeTemplate = TEMPLATES.find(t => t.id === selectedDemoTemplate) || TEMPLATES[0];

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        
        {/* Enhanced Glow Spheres - Blue Theme */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-400/30 via-blue-500/20 to-blue-300/20 rounded-full blur-[140px] -z-10 animate-pulse-glow" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-gradient-to-br from-blue-500/20 via-blue-400/15 to-transparent rounded-full blur-[100px] -z-10 animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-[250px] h-[250px] bg-gradient-to-tr from-blue-300/15 via-blue-400/10 to-transparent rounded-full blur-[80px] -z-10 animate-float-slow" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-200 shadow-lg text-xs font-semibold text-blue-600 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-blue-500 animate-spin" />
            <span className="text-gradient-blue">#1 Birthday Website Generator — 100% Free Instant Access</span>
            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-[10px] animate-shimmer">NO PAYMENT</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-none max-w-5xl mx-auto animate-fade-in-up text-slate-900" style={{animationDelay: '0.1s'}}>
            Create a Birthday Surprise They'll Never Forget 🎂
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Turn your photos, memories and wishes into a beautiful interactive birthday website in minutes.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <Link
              href="/login"
              className="magnetic-btn ripple w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-extrabold text-lg shadow-lg shadow-blue-500/30 flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 cursor-pointer animate-gradient"
            >
              <span>Login to Create Birthday Surprise →</span>
            </Link>

            <Link
              href="/signup"
              className="magnetic-btn w-full sm:w-auto px-8 py-4 rounded-2xl bg-white border-2 border-blue-500 hover:bg-blue-50 text-blue-600 font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <span>Sign Up Free</span>
            </Link>
          </div>

          {/* Trust Message */}
          <div className="pt-4 text-xs text-slate-500 font-medium animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            No coding required • Ready in minutes • Share anywhere
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-6 text-xs text-slate-500 font-medium animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <span className="flex items-center gap-1.5 bg-white border border-blue-200 px-3 py-1.5 rounded-full"><ShieldCheck className="w-4 h-4 text-blue-500" /> Instant Free Link Generation</span>
            <span className="flex items-center gap-1.5 bg-white border border-blue-200 px-3 py-1.5 rounded-full"><Smartphone className="w-4 h-4 text-blue-500" /> WhatsApp & IG Optimized</span>
            <span className="flex items-center gap-1.5 bg-white border border-blue-200 px-3 py-1.5 rounded-full"><Star className="w-4 h-4 text-blue-500 fill-blue-500" /> 4.9/5 Rating (12,400+ Surprises Created)</span>
          </div>

        </div>
      </section>

      {/* 2. INTERACTIVE DEMO PREVIEW SANDBOX */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-blue-200 shadow-lg space-y-8 animate-scale-in">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gradient-blue">Live Preview Engine</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Select a Theme to Test Live</h2>
            </div>

            {/* Template Selector Pills */}
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.slice(0, 4).map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedDemoTemplate(tpl.id)}
                  className={`magnetic-btn px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedDemoTemplate === tpl.id ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 animate-shimmer' : 'bg-white border border-blue-200 text-slate-600 hover:bg-blue-50'}`}
                >
                  {tpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* Mockup Frame */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-950 p-6 sm:p-12 min-h-[420px] flex flex-col items-center justify-center text-center space-y-6 card-3d">
            
            <div className={`absolute inset-0 bg-gradient-to-b ${activeTemplate.bgGradient} opacity-90 -z-10`} />

            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
              {activeTemplate.badge}
            </span>

            <div className="space-y-2">
              <h3 className="text-3xl sm:text-5xl font-black text-white font-playfair tracking-tight">
                HAPPY BIRTHDAY, ANANYA ❤️
              </h3>
              <p className="text-sm sm:text-base text-slate-200 max-w-lg mx-auto">
                &ldquo;You make every single day brighter with your smile. Today is all about celebrating YOU!&rdquo;
              </p>
            </div>

            {/* Interactive Demo Elements */}
            <div className="flex items-center gap-4">
              <Link
                href={`/builder?template=${activeTemplate.id}`}
                className="magnetic-btn ripple px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-extrabold text-sm shadow-lg flex items-center gap-2 transition-all hover:scale-105"
              >
                <Wand2 className="w-4 h-4" /> Customize & Publish Free
              </Link>
              <Link
                href="/birthday/rohan-special-24"
                className="magnetic-btn px-6 py-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-bold text-sm flex items-center gap-2 transition-all hover:scale-100 border border-white/30"
              >
                <Play className="w-4 h-4 fill-white" /> Test Cake & Music
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 3. FEATURES GRID */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-gradient-blue">Everything Included</span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900">Packed With Magical Features ✨</h2>
          <p className="text-slate-600 text-sm sm:text-base">
            No payment required! Simply enter details, pick a theme, upload photos, and generate your free birthday page instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-white border border-blue-200 hover:border-blue-400 transition-all hover:-translate-y-1 space-y-4 card-3d group shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-500 group-hover:neon-blue transition-all">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Interactive Candle Blowing 🎂</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Visitors tap &ldquo;Make a Wish&rdquo; to blow out candles with real sound effects, firework bursts, and confetti cannons!
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-white border border-blue-200 hover:border-blue-400 transition-all hover:-translate-y-1 space-y-4 card-3d group shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-500 group-hover:neon-blue transition-all">
              <Music className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Background Music Player 🎵</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Add birthday songs with auto-play, custom audio uploads, and a premium music visualizer that reacts to beats.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-white border border-blue-200 hover:border-blue-400 transition-all hover:-translate-y-1 space-y-4 card-3d group shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-500 group-hover:neon-blue transition-all">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Memory Photo Timeline 💕</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload unlimited photos with captions, dates, and memory notes. Beautiful polaroid & gallery layouts.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-3xl bg-white border border-blue-200 hover:border-blue-400 transition-all hover:-translate-y-1 space-y-4 card-3d group shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-500 group-hover:neon-blue transition-all">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Polaroid Memory Gallery 📸</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Display special photos with memory dates, handwritten captions, and interactive timeline slideshows.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-3xl bg-white border border-blue-200 hover:border-blue-400 transition-all hover:-translate-y-1 space-y-4 card-3d group shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-500 group-hover:neon-blue transition-all">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Downloadable QR Code 🔗</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Generate custom QR code graphics to print on birthday cards, gifts, or share directly on WhatsApp & Instagram.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-3xl bg-white border border-blue-200 hover:border-blue-400 transition-all hover:-translate-y-1 space-y-4 card-3d group shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-500 group-hover:neon-blue transition-all">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Surprise Gift Box Opening 🎁</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Starts with an unboxing animation with &ldquo;Hey [Name]... I have a surprise for you!&rdquo; for maximum thrill.
            </p>
          </div>

        </div>
      </section>

      {/* 4. TEMPLATES SHOWCASE */}
      <section id="templates" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-gradient-blue">Design Variety</span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900">8 Free Birthday Templates 🎨</h2>
          <p className="text-slate-600 text-sm">
            Handcrafted designs tailored for partners, best friends, parents, kids, and elegant celebrations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEMPLATES.map((tpl) => (
            <div 
              key={tpl.id}
              className="group rounded-3xl bg-white border border-blue-200 overflow-hidden hover:border-blue-400 transition-all hover:-translate-y-1 flex flex-col justify-between card-3d shadow-sm"
            >
              <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                <Image
                  src={tpl.previewImage}
                  alt={tpl.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full glass-luxury text-white text-[10px] font-bold border border-white/20">
                  {tpl.badge}
                </span>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">{tpl.name}</h4>
                  <p className="text-xs text-slate-600 mt-1">{tpl.description}</p>
                </div>

                <Link
                  href={`/builder?template=${tpl.id}`}
                  className="magnetic-btn ripple w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  Use Free Template <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 text-center space-y-6 shadow-lg relative overflow-hidden animate-gradient">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent)]" />
          
          <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-extrabold uppercase tracking-wider animate-shimmer border border-white/30">
            Ready to Surprise? 🎁
          </span>

          <h2 className="text-3xl sm:text-5xl font-black text-white max-w-2xl mx-auto leading-tight">
            Create Their Birthday Website Free in Less Than 5 Minutes
          </h2>

          <div className="pt-2">
            <Link
              href="/builder"
              className="magnetic-btn ripple inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-blue-600 font-black text-base hover:bg-blue-50 shadow-lg transition-transform hover:scale-105"
            >
              <Rocket className="w-5 h-5 text-blue-600" /> Start Creating Free Now 🚀
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
