'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Heart, Gift, Share2, Music, QrCode, ArrowUpRight } from 'lucide-react';
import { getWebsiteByIdOrSlug, incrementViews } from '@/lib/store';
import { BirthdayWebsite } from '@/lib/types';
import { TEMPLATES } from '@/lib/sample-data';
import GiftBox from '@/components/GiftBox';
import Cake3D from '@/components/Cake3D';
import ConfettiCanvas from '@/components/ConfettiCanvas';
import AudioPlayer from '@/components/AudioPlayer';
import QRCodeModal from '@/components/QRCodeModal';

import PinkGoldTheme from '@/components/templates/PinkGoldTheme';

export default function BirthdayPublicPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const identifier = resolvedParams.id;

  const [website, setWebsite] = useState<BirthdayWebsite | null>(null);
  const [isOpened, setIsOpened] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const site = getWebsiteByIdOrSlug(identifier);
    if (site) {
      setWebsite(site);
      incrementViews(site.id);
    }
  }, [identifier]);

  if (!website) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4 bg-slate-950 text-white">
        <Gift className="w-12 h-12 text-rose-500 animate-bounce" />
        <h1 className="text-2xl font-bold">Birthday Surprise Loading...</h1>
        <p className="text-xs text-slate-400">Loading personalized birthday webpage...</p>
      </div>
    );
  }

  if (website.templateId === 'pink-gold') {
    return (
      <PinkGoldTheme
        personName={website.personName}
        personNickname={website.personNickname}
        personAge={website.personAge}
        birthdayDate={website.birthdayDate}
        relationship={website.relationship}
        creatorName={website.creatorName}
        customMessage={website.birthdayMessage}
        photos={website.photos}
      />
    );
  }

  const templateDef = TEMPLATES.find(t => t.id === website.templateId) || TEMPLATES[0];

  return (
    <div className={`min-h-screen bg-gradient-to-b ${templateDef.bgGradient} text-white relative font-sans overflow-x-hidden selection:bg-rose-500 selection:text-white`}>
      
      {/* Background audio player */}
      <AudioPlayer track={website.music} autoPlay={isOpened} />

      {/* Screen 1: Interactive Surprise Opening Screen */}
      {!isOpened ? (
        <GiftBox
          personName={website.personName}
          creatorName={website.creatorName}
          onOpen={() => setIsOpened(true)}
        />
      ) : (
        /* Screen 2 & Beyond: Revealed Birthday Page */
        <div className="space-y-16 pb-20 animate-in fade-in duration-1000">
          
          {/* Confetti & Particle Fireworks */}
          <ConfettiCanvas triggerOnMount={true} continuous={true} />

          {/* Top Bar Floating Badge */}
          <div className="pt-6 px-4 flex justify-between items-center max-w-2xl mx-auto">
            <span className="px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" /> Birthday Surprise Website
            </span>

            <button
              onClick={() => setShowQR(true)}
              className="px-3.5 py-1 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-rose-300" /> Share Page
            </button>
          </div>

          {/* GRAND BIRTHDAY REVEAL HEADER */}
          <section className="text-center px-4 pt-6 space-y-6 max-w-3xl mx-auto">
            <div className="inline-block animate-bounce">
              <span className="text-5xl sm:text-7xl">🎂🎈✨</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-amber-300">
                HAPPY BIRTHDAY CELEBRATION
              </h2>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight font-playfair drop-shadow-lg text-white">
                Happy Birthday, {website.personName} ❤️
              </h1>
              {website.personAge && (
                <p className="text-lg font-bold text-rose-200">
                  Cheers to Turning {website.personAge} Years Young! 🥂
                </p>
              )}
            </div>

            {/* Quick Person Traits Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {website.favFood && (
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium border border-white/10">
                  🍕 Lover of {website.favFood}
                </span>
              )}
              {website.favPlace && (
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium border border-white/10">
                  ✈️ Favorite Place: {website.favPlace}
                </span>
              )}
              {website.hobbies && website.hobbies.length > 0 && (
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium border border-white/10">
                  🎸 {website.hobbies.join(', ')}
                </span>
              )}
            </div>
          </section>

          {/* INTERACTIVE CAKE CEREMONY */}
          <section className="max-w-2xl mx-auto px-4 text-center space-y-4">
            <div className="p-6 sm:p-10 rounded-3xl bg-slate-950/60 backdrop-blur-xl border border-white/15 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-2">The Birthday Candle Ceremony 🕯️</h3>
              <Cake3D
                personName={website.personName}
                age={website.personAge || 24}
              />
            </div>
          </section>

          {/* PERSONAL HEARTFELT MESSAGE */}
          <section className="max-w-2xl mx-auto px-4">
            <div className="p-8 sm:p-12 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-4 right-4 text-rose-300 opacity-30 text-5xl">💖</div>
              
              <div className="flex items-center gap-2 text-rose-300 text-xs font-extrabold uppercase tracking-wider">
                <Heart className="w-4 h-4 fill-rose-300" /> A Special Message For You
              </div>

              <div className="whitespace-pre-line text-base sm:text-lg text-slate-100 leading-relaxed font-handwriting text-2xl sm:text-3xl">
                {website.birthdayMessage}
              </div>

              <div className="pt-4 border-t border-white/15 text-right font-bold text-sm text-rose-200">
                — With lots of love, {website.creatorName} ❤️
              </div>
            </div>
          </section>

          {/* MEMORIES GALLERY */}
          {website.photos && website.photos.length > 0 && (
            <section className="max-w-4xl mx-auto px-4 space-y-8">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-white">Unforgettable Memories 📸</h3>
                <p className="text-xs text-slate-300">Moments we cherish together</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {website.photos.map((photo) => (
                  <div 
                    key={photo.id}
                    className="p-3 bg-white rounded-2xl shadow-2xl transform hover:rotate-1 transition-transform duration-300 text-slate-900 space-y-3"
                  >
                    <div className="relative h-56 w-full rounded-xl overflow-hidden bg-slate-100">
                      <Image
                        src={photo.url}
                        alt={photo.caption}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="px-1 space-y-1">
                      <p className="font-handwriting text-xl font-bold leading-tight">{photo.caption}</p>
                      {photo.date && (
                        <span className="text-[10px] text-slate-500 font-semibold block">{photo.date}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* FINAL HEARTFELT MESSAGE */}
          <section className="max-w-2xl mx-auto px-4 text-center space-y-6 pt-6">
            <div className="p-8 rounded-3xl bg-slate-950/80 border border-white/15 shadow-2xl space-y-4">
              <h3 className="text-2xl font-black text-white">Once Again, Happy Birthday {website.personName} ❤️</h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                &ldquo;May your life be filled with happiness, success, love, and beautiful memories that last forever.&rdquo;
              </p>
              
              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => setShowQR(true)}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 text-white font-bold text-xs shadow-xl flex items-center gap-2"
                >
                  <QrCode className="w-4 h-4" /> Share This Birthday Page
                </button>
              </div>
            </div>

            {/* SaaS Platform Footer Tag */}
            <div className="pt-8 text-center text-xs text-slate-400 space-y-2">
              <p>Want to create a birthday surprise website like this?</p>
              <Link
                href="/builder"
                className="inline-flex items-center gap-1 text-rose-400 hover:text-rose-300 font-bold underline"
              >
                Create Your Own Birthday Website on CelebrationCraft <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

        </div>
      )}

      {/* Share & QR Modal */}
      {showQR && (
        <QRCodeModal
          slug={website.slug}
          personName={website.personName}
          onClose={() => setShowQR(false)}
        />
      )}

    </div>
  );
}
