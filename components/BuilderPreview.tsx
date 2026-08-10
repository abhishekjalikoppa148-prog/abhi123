'use client';

import { BirthdayWebsite, TemplateId } from '@/lib/types';
import { TEMPLATES } from '@/lib/sample-data';
import { getDaysUntil } from '@/lib/utils';
import Image from 'next/image';

interface BuilderPreviewProps {
  website: Partial<BirthdayWebsite>;
}

export default function BuilderPreview({ website }: BuilderPreviewProps) {
  const template = TEMPLATES.find(t => t.id === website.templateId) || TEMPLATES[0];
  const daysUntil = getDaysUntil(website.birthdayDate || '');
  const isBirthdayToday = daysUntil === 0;

  return (
    <div className="h-full overflow-y-auto">
      <div className={`relative min-h-full bg-gradient-to-b ${template.bgGradient} p-8 flex flex-col items-center justify-center text-center space-y-8`}>
        
        {/* Opening Gift Box */}
        <div className="animate-float">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-rose-500/30">
            <span className="text-4xl">🎁</span>
          </div>
        </div>

        {/* Opening Message */}
        <div className="glass-luxury p-6 rounded-3xl max-w-md">
          <p className="text-white text-lg font-semibold">
            Hey {website.personName || 'Friend'}...
          </p>
          <p className="text-slate-200 mt-2">
            I have a special surprise for you! ✨
          </p>
        </div>

        {/* Birthday Hero */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-black text-white font-playfair">
            HAPPY BIRTHDAY 🎂
          </h1>
          <h2 className="text-2xl sm:text-4xl font-bold text-white">
            Happy Birthday, {website.personName || 'Friend'} ❤️
          </h2>
          {website.personNickname && (
            <p className="text-xl text-rose-300 font-semibold">
              ({website.personNickname})
            </p>
          )}
          {website.customizations?.showAge !== false && website.personAge && (
            <p className="text-lg text-amber-300">
              Turning {website.personAge}! 🎉
            </p>
          )}
        </div>

        {/* Countdown or Birthday Message */}
        {!isBirthdayToday && daysUntil > 0 ? (
          <div className="glass-luxury p-6 rounded-3xl">
            <p className="text-slate-300 text-sm mb-3">Countdown to Birthday:</p>
            <div className="flex gap-4 justify-center">
              <div className="text-center">
                <p className="text-3xl font-black text-white">{daysUntil}</p>
                <p className="text-xs text-slate-400">Days</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-luxury p-4 rounded-2xl">
            <p className="text-emerald-300 font-semibold text-lg">
              🎉 Today is your special day!
            </p>
          </div>
        )}

        {/* Personal Message */}
        <div className="glass-luxury p-6 rounded-3xl max-w-lg">
          <p className="text-white text-sm sm:text-base whitespace-pre-line leading-relaxed">
            {website.birthdayMessage || 'Your special birthday message will appear here...'}
          </p>
        </div>

        {/* Photo Memories */}
        {website.photos && website.photos.length > 0 && (
          <div className="w-full max-w-2xl">
            <h3 className="text-white font-bold mb-4">Memories 💕</h3>
            <div className="grid grid-cols-2 gap-4">
              {website.photos.slice(0, 4).map((photo) => (
                <div key={photo.id} className="relative aspect-square rounded-2xl overflow-hidden glass-luxury">
                  <Image
                    src={photo.url}
                    alt={photo.caption || 'Memory'}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white text-xs truncate">{photo.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Elements */}
        <div className="flex gap-4 flex-wrap justify-center">
          <button className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold shadow-lg hover:scale-105 transition-transform">
            Make a Wish ✨
          </button>
          <button className="px-6 py-3 rounded-full glass-luxury text-white font-semibold hover:bg-white/20 transition-colors">
            Play Music 🎵
          </button>
        </div>

        {/* Footer Message */}
        <div className="glass-luxury p-6 rounded-3xl max-w-lg">
          <p className="text-white text-sm">
            Once Again, Happy Birthday {website.personName || 'Friend'} ❤️
          </p>
          <p className="text-slate-300 text-xs mt-2">
            May your life be filled with happiness, success, love and unforgettable memories.
          </p>
        </div>

        {/* Creator Signature */}
        <p className="text-slate-400 text-xs">
          Created with ❤️ by {website.creatorName || 'Someone Special'}
        </p>
      </div>
    </div>
  );
}
