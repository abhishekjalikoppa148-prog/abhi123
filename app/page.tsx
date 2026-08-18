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
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden min-h-screen flex items-center">
        
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 -z-10">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/birthday-background.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#071225]/90 via-[#071225]/85 to-[#0B1B38]" />
          {/* Subtle blue radial gradients for depth */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#2563EB]/10 via-[#3B82F6]/5 to-transparent rounded-full blur-[120px] -z-10" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-[#E8C878]/5 via-[#3B82F6]/5 to-transparent rounded-full blur-[100px] -z-10" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel shadow-lg text-xs font-semibold text-[#60A5FA] animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-[#E8C878] animate-spin" />
            <span className="text-[#F8FAFC]">#1 Birthday Website Generator — 100% Free Instant Access</span>
            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white font-bold text-[10px] animate-shimmer">NO PAYMENT</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-none max-w-5xl mx-auto animate-fade-in-up text-[#F8FAFC] drop-shadow-[0_0_30px_rgba(96,165,250,0.3)]" style={{animationDelay: '0.1s'}}>
            Create a <span className="text-[#E8C878] drop-shadow-[0_0_20px_rgba(232,200,120,0.5)]">Birthday Surprise</span> They'll Never Forget 🎂
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-[#CBD5E1] max-w-3xl mx-auto font-normal leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Turn your photos, memories and wishes into a beautiful interactive birthday website in minutes.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <Link
              href="/login"
              className="magnetic-btn ripple w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#3B82F6] hover:to-[#60A5FA] text-white font-extrabold text-lg shadow-lg shadow-blue-500/30 flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 cursor-pointer animate-gradient"
            >
              <span>Login to Create Birthday Surprise →</span>
            </Link>

            <Link
              href="/signup"
              className="magnetic-btn w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel border-2 border-[rgba(255,255,255,0.2)] hover:bg-[rgba(59,130,246,0.1)] text-[#F8FAFC] font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <span>Sign Up Free</span>
            </Link>
          </div>

          {/* Trust Message */}
          <div className="pt-4 text-xs text-[#94A3B8] font-medium animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            No coding required • Ready in minutes • Share anywhere
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-6 text-xs text-[#94A3B8] font-medium animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <span className="flex items-center gap-1.5 glass-panel px-3 py-1.5 rounded-full"><ShieldCheck className="w-4 h-4 text-[#60A5FA]" /> Instant Free Link Generation</span>
            <span className="flex items-center gap-1.5 glass-panel px-3 py-1.5 rounded-full"><Smartphone className="w-4 h-4 text-[#60A5FA]" /> WhatsApp & IG Optimized</span>
            <span className="flex items-center gap-1.5 glass-panel px-3 py-1.5 rounded-full"><Star className="w-4 h-4 text-[#E8C878] fill-[#E8C878]" /> 4.9/5 Rating (12,400+ Surprises Created)</span>
          </div>

        </div>
      </section>

      {/* 2. INTERACTIVE DEMO PREVIEW SANDBOX */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-10 rounded-3xl glass-luxury shadow-lg space-y-8 animate-scale-in">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#60A5FA]">Live Preview Engine</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC]">Select a Theme to Test Live</h2>
            </div>

            {/* Template Selector Pills */}
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.slice(0, 4).map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedDemoTemplate(tpl.id)}
                  className={`magnetic-btn px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedDemoTemplate === tpl.id ? 'bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white shadow-lg shadow-blue-500/30 animate-shimmer' : 'glass-panel border border-[rgba(255,255,255,0.12)] text-[#CBD5E1] hover:bg-[rgba(59,130,246,0.1)]'}`}
                >
                  {tpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* Mockup Frame */}
          <div className="relative rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.12)] bg-[#0B1B38] p-6 sm:p-12 min-h-[420px] flex flex-col items-center justify-center text-center space-y-6 card-3d">
            
            <div className={`absolute inset-0 bg-gradient-to-b ${activeTemplate.bgGradient} opacity-90 -z-10`} />

            <span className="px-3 py-1 rounded-full glass-panel text-[#F8FAFC] text-xs font-semibold border border-[rgba(255,255,255,0.2)]">
              {activeTemplate.badge}
            </span>

            <div className="space-y-2">
              <h3 className="text-3xl sm:text-5xl font-black text-[#F8FAFC] font-playfair tracking-tight">
                HAPPY BIRTHDAY, ABHISHEK ❤️
              </h3>
              <p className="text-sm sm:text-base text-[#CBD5E1] max-w-lg mx-auto">
                &ldquo;You make every single day brighter with your smile. Today is all about celebrating YOU!&rdquo;
              </p>
            </div>

            {/* Interactive Demo Elements */}
            <div className="flex items-center gap-4">
              <Link
                href={`/builder?template=${activeTemplate.id}`}
                className="magnetic-btn ripple px-6 py-3 rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#3B82F6] hover:to-[#60A5FA] text-white font-extrabold text-sm shadow-lg flex items-center gap-2 transition-all hover:scale-105"
              >
                <Wand2 className="w-4 h-4" /> Customize & Publish Free
              </Link>
              <Link
                href="/birthday/rohan-special-24"
                className="magnetic-btn px-6 py-3 rounded-full glass-panel hover:bg-[rgba(255,255,255,0.15)] text-[#F8FAFC] font-bold text-sm flex items-center gap-2 transition-all hover:scale-100 border border-[rgba(255,255,255,0.2)]"
              >
                <Play className="w-4 h-4 fill-[#F8FAFC]" /> Test Cake & Music
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 3. FEATURES GRID */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#60A5FA]">Everything Included</span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#F8FAFC]">Packed With Magical Features ✨</h2>
          <p className="text-[#CBD5E1] text-sm sm:text-base">
            No payment required! Simply enter details, pick a theme, upload photos, and generate your free birthday page instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="p-6 rounded-3xl glass-card hover:border-[rgba(59,130,246,0.4)] transition-all hover:-translate-y-1 space-y-4 card-3d group shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB]/20 to-[#3B82F6]/10 border border-[rgba(59,130,246,0.3)] flex items-center justify-center text-[#60A5FA] group-hover:neon-blue transition-all">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#F8FAFC]">Interactive Candle Blowing 🎂</h3>
            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              Visitors tap &ldquo;Make a Wish&rdquo; to blow out candles with real sound effects, firework bursts, and confetti cannons!
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl glass-card hover:border-[rgba(59,130,246,0.4)] transition-all hover:-translate-y-1 space-y-4 card-3d group shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB]/20 to-[#3B82F6]/10 border border-[rgba(59,130,246,0.3)] flex items-center justify-center text-[#60A5FA] group-hover:neon-blue transition-all">
              <Music className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#F8FAFC]">Background Music Player 🎵</h3>
            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              Add birthday songs with auto-play, custom audio uploads, and a premium music visualizer that reacts to beats.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl glass-card hover:border-[rgba(59,130,246,0.4)] transition-all hover:-translate-y-1 space-y-4 card-3d group shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB]/20 to-[#3B82F6]/10 border border-[rgba(59,130,246,0.3)] flex items-center justify-center text-[#60A5FA] group-hover:neon-blue transition-all">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#F8FAFC]">Memory Photo Timeline 💕</h3>
            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              Upload unlimited photos with captions, dates, and memory notes. Beautiful polaroid & gallery layouts.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-3xl glass-card hover:border-[rgba(59,130,246,0.4)] transition-all hover:-translate-y-1 space-y-4 card-3d group shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB]/20 to-[#3B82F6]/10 border border-[rgba(59,130,246,0.3)] flex items-center justify-center text-[#60A5FA] group-hover:neon-blue transition-all">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#F8FAFC]">Polaroid Memory Gallery 📸</h3>
            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              Display special photos with memory dates, handwritten captions, and interactive timeline slideshows.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-3xl glass-card hover:border-[rgba(59,130,246,0.4)] transition-all hover:-translate-y-1 space-y-4 card-3d group shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB]/20 to-[#3B82F6]/10 border border-[rgba(59,130,246,0.3)] flex items-center justify-center text-[#60A5FA] group-hover:neon-blue transition-all">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#F8FAFC]">Downloadable QR Code 🔗</h3>
            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              Generate custom QR code graphics to print on birthday cards, gifts, or share directly on WhatsApp & Instagram.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-3xl glass-card hover:border-[rgba(59,130,246,0.4)] transition-all hover:-translate-y-1 space-y-4 card-3d group shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB]/20 to-[#3B82F6]/10 border border-[rgba(59,130,246,0.3)] flex items-center justify-center text-[#60A5FA] group-hover:neon-blue transition-all">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#F8FAFC]">Surprise Gift Box Opening 🎁</h3>
            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              Starts with an unboxing animation with &ldquo;Hey [Name]... I have a surprise for you!&rdquo; for maximum thrill.
            </p>
          </div>

        </div>
      </section>

      {/* 4. TEMPLATES SHOWCASE */}
      <section id="templates" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#60A5FA]">Design Variety</span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#F8FAFC]">8 Free Birthday Templates 🎨</h2>
          <p className="text-[#CBD5E1] text-sm">
            Handcrafted designs tailored for partners, best friends, parents, kids, and elegant celebrations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEMPLATES.map((tpl) => (
            <div 
              key={tpl.id}
              className="group rounded-3xl glass-card overflow-hidden hover:border-[rgba(59,130,246,0.4)] transition-all hover:-translate-y-1 flex flex-col justify-between card-3d shadow-sm"
            >
              <div className="relative h-44 w-full overflow-hidden bg-[#0B1B38]">
                <Image
                  src={tpl.previewImage}
                  alt={tpl.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B38] via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full glass-panel text-[#F8FAFC] text-[10px] font-bold border border-[rgba(255,255,255,0.2)]">
                  {tpl.badge}
                </span>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-[#F8FAFC] text-base">{tpl.name}</h4>
                  <p className="text-xs text-[#CBD5E1] mt-1">{tpl.description}</p>
                </div>

                <Link
                  href={`/builder?template=${tpl.id}`}
                  className="magnetic-btn ripple w-full py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#3B82F6] hover:to-[#60A5FA] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  Use Free Template <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. AI FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E8C878]">AI-Powered Magic</span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#F8FAFC]">Smart Personalization ✨</h2>
          <p className="text-[#CBD5E1] text-sm sm:text-base">
            Our AI generates personalized birthday wishes and smart content tailored to your loved ones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Feature Card 1 */}
          <div className="p-6 rounded-3xl glass-card hover:border-[rgba(232,200,120,0.4)] transition-all hover:-translate-y-1 space-y-4 card-3d group shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#E8C878]/10 to-transparent rounded-full blur-3xl -z-10" />
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E8C878]/20 to-[#F5DFA0]/10 border border-[rgba(232,200,120,0.3)] flex items-center justify-center text-[#E8C878] group-hover:neon-gold transition-all">
              <Wand2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#F8FAFC]">AI Birthday Wish Generator</h3>
            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              Generate heartfelt, personalized birthday wishes with AI. Choose from emotional, funny, romantic, or inspirational tones.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-[#E8C878] font-semibold">
              <Sparkles className="w-3 h-3" /> Powered by OpenAI GPT
            </div>
          </div>

          {/* AI Feature Card 2 */}
          <div className="p-6 rounded-3xl glass-card hover:border-[rgba(59,130,246,0.4)] transition-all hover:-translate-y-1 space-y-4 card-3d group shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#3B82F6]/10 to-transparent rounded-full blur-3xl -z-10" />
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB]/20 to-[#3B82F6]/10 border border-[rgba(59,130,246,0.3)] flex items-center justify-center text-[#60A5FA] group-hover:neon-blue transition-all">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#F8FAFC]">Smart Content Suggestions</h3>
            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              Get intelligent suggestions for photo captions, memory notes, and personalized messages based on your relationship.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-[#60A5FA] font-semibold">
              <Sparkles className="w-3 h-3" /> Context-Aware AI
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRICING SECTION */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#60A5FA]">Simple Pricing</span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#F8FAFC]">Choose Your Plan 💎</h2>
          <p className="text-[#CBD5E1] text-sm sm:text-base">
            Start free, upgrade when you need more. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Basic Plan */}
          <div className="p-6 rounded-3xl glass-card space-y-6 card-3d shadow-sm">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#F8FAFC]">Basic</h3>
              <p className="text-xs text-[#94A3B8]">Perfect for trying out</p>
            </div>
            <div className="space-y-1">
              <span className="text-4xl font-black text-[#F8FAFC]">Free</span>
              <p className="text-xs text-[#94A3B8]">Forever</p>
            </div>
            <ul className="space-y-3 text-xs text-[#CBD5E1]">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#60A5FA]" /> 3 websites per day</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#60A5FA]" /> Basic templates</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#60A5FA]" /> Photo uploads</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#60A5FA]" /> Music player</li>
            </ul>
            <Link
              href="/builder"
              className="magnetic-btn w-full py-3 rounded-xl glass-panel border border-[rgba(255,255,255,0.2)] text-[#F8FAFC] font-bold text-sm hover:bg-[rgba(59,130,246,0.1)] transition-all"
            >
              Start Free
            </Link>
          </div>

          {/* Premium Plan - Highlighted */}
          <div className="p-6 rounded-3xl glass-luxury space-y-6 card-3d shadow-lg shadow-blue-500/20 border-2 border-[#3B82F6] relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white text-[10px] font-bold uppercase tracking-wider">
              Most Popular
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#F8FAFC]">Premium</h3>
              <p className="text-xs text-[#94A3B8]">For serious creators</p>
            </div>
            <div className="space-y-1">
              <span className="text-4xl font-black text-[#F8FAFC]">₹499</span>
              <p className="text-xs text-[#94A3B8]">per month</p>
            </div>
            <ul className="space-y-3 text-xs text-[#CBD5E1]">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#60A5FA]" /> Unlimited websites</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#60A5FA]" /> All premium templates</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#60A5FA]" /> AI wish generator (50/mo)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#60A5FA]" /> Custom domain support</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#60A5FA]" /> Priority support</li>
            </ul>
            <Link
              href="/pricing"
              className="magnetic-btn ripple w-full py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#3B82F6] hover:to-[#60A5FA] text-white font-bold text-sm shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
            >
              Get Premium
            </Link>
          </div>

          {/* Ultimate Plan - Gold Accent */}
          <div className="p-6 rounded-3xl glass-card space-y-6 card-3d shadow-sm border border-[rgba(232,200,120,0.3)] relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[#E8C878] to-[#F5DFA0] text-[#071225] text-[10px] font-bold uppercase tracking-wider">
              Best Value
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#E8C878]">Ultimate</h3>
              <p className="text-xs text-[#94A3B8]">For power users</p>
            </div>
            <div className="space-y-1">
              <span className="text-4xl font-black text-[#E8C878]">₹999</span>
              <p className="text-xs text-[#94A3B8]">per month</p>
            </div>
            <ul className="space-y-3 text-xs text-[#CBD5E1]">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E8C878]" /> Everything in Premium</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E8C878]" /> Unlimited AI wishes</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E8C878]" /> Advanced analytics</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E8C878]" /> White-label option</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E8C878]" /> Dedicated support</li>
            </ul>
            <Link
              href="/pricing"
              className="magnetic-btn ripple w-full py-3 rounded-xl bg-gradient-to-r from-[#E8C878] to-[#F5DFA0] hover:from-[#F5DFA0] hover:to-[#E8C878] text-[#071225] font-bold text-sm shadow-lg shadow-yellow-500/20 transition-all hover:scale-105"
            >
              Get Ultimate
            </Link>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-center space-y-6 shadow-lg relative overflow-hidden animate-gradient">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent)]" />
          
          <span className="px-4 py-1.5 rounded-full glass-panel text-[#F8FAFC] text-xs font-extrabold uppercase tracking-wider animate-shimmer border border-[rgba(255,255,255,0.3)]">
            Ready to Surprise? 🎁
          </span>

          <h2 className="text-3xl sm:text-5xl font-black text-[#F8FAFC] max-w-2xl mx-auto leading-tight">
            Create Their Birthday Website Free in Less Than 5 Minutes
          </h2>

          <div className="pt-2">
            <Link
              href="/builder"
              className="magnetic-btn ripple inline-flex items-center gap-2 px-8 py-4 rounded-2xl glass-panel text-[#F8FAFC] font-black text-base hover:bg-[rgba(255,255,255,0.15)] shadow-lg transition-transform hover:scale-105 border border-[rgba(255,255,255,0.3)]"
            >
              <Rocket className="w-5 h-5 text-[#E8C878]" /> Start Creating Free Now 🚀
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
