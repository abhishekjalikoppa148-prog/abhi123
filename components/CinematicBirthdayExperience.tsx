'use client';

import { useState, useEffect } from 'react';
import { Gift, Sparkles, Heart, Play } from 'lucide-react';

interface CinematicBirthdayExperienceProps {
  personName: string;
  creatorName: string;
  relationship: string;
  birthdayMessage: string;
  photos: any[];
  onComplete: () => void;
}

type CinematicStep = 'opening' | 'gift' | 'reveal' | 'message' | 'memories' | 'final';

export default function CinematicBirthdayExperience({
  personName,
  creatorName,
  relationship,
  birthdayMessage,
  photos,
  onComplete
}: CinematicBirthdayExperienceProps) {
  const [currentStep, setCurrentStep] = useState<CinematicStep>('opening');
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowNext(true), 2000);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleNext = () => {
    const steps: CinematicStep[] = ['opening', 'gift', 'reveal', 'message', 'memories', 'final'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
      setShowNext(false);
    } else {
      onComplete();
    }
  };

  const getOpeningMessage = () => {
    const relationshipLower = relationship.toLowerCase();
    if (relationshipLower.includes('partner') || relationshipLower.includes('love')) {
      return `Hey ${personName}...`;
    } else if (relationshipLower.includes('friend')) {
      return `Hey ${personName}...`;
    } else if (relationshipLower.includes('family') || relationshipLower.includes('mom') || relationshipLower.includes('dad')) {
      return `Hey ${personName}...`;
    }
    return `Hey ${personName}...`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      
      {/* Opening */}
      {currentStep === 'opening' && (
        <div className="text-center space-y-6 animate-fade-in">
          <div className="text-6xl animate-bounce">🎁</div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            {getOpeningMessage()}
          </h1>
          <p className="text-slate-300 text-lg">Someone made something special for you.</p>
          {showNext && (
            <button
              onClick={handleNext}
              className="magnetic-btn ripple px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-lg flex items-center gap-2 mx-auto hover:scale-105 transition-transform"
            >
              <Play className="w-5 h-5" /> Open Your Surprise 🎁
            </button>
          )}
        </div>
      )}

      {/* Gift */}
      {currentStep === 'gift' && (
        <div className="text-center space-y-6 animate-scale-in">
          <div className="w-40 h-40 mx-auto rounded-3xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-8xl animate-pulse shadow-2xl shadow-amber-500/30">
            🎁
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Your Gift</h1>
          <p className="text-slate-300 text-lg">A special birthday surprise awaits...</p>
          {showNext && (
            <button
              onClick={handleNext}
              className="magnetic-btn ripple px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-lg flex items-center gap-2 mx-auto hover:scale-105 transition-transform"
            >
              <Sparkles className="w-5 h-5" /> Reveal Surprise
            </button>
          )}
        </div>
      )}

      {/* Birthday Reveal */}
      {currentStep === 'reveal' && (
        <div className="text-center space-y-6 animate-fade-in">
          <div className="text-8xl animate-bounce">🎂</div>
          <h1 className="text-4xl sm:text-6xl font-black text-white">Happy Birthday!</h1>
          <p className="text-2xl text-rose-300 font-semibold">{personName}</p>
          {showNext && (
            <button
              onClick={handleNext}
              className="magnetic-btn ripple px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-lg flex items-center gap-2 mx-auto hover:scale-105 transition-transform"
            >
              <Heart className="w-5 h-5" /> Read Message
            </button>
          )}
        </div>
      )}

      {/* Message */}
      {currentStep === 'message' && (
        <div className="max-w-2xl mx-auto text-center space-y-6 animate-fade-in">
          <div className="p-8 rounded-3xl glass-luxury">
            <h2 className="text-xl font-bold text-white mb-4">A Special Message for You</h2>
            <p className="text-lg text-slate-200 leading-relaxed whitespace-pre-line">
              {birthdayMessage}
            </p>
          </div>
          {showNext && (
            <button
              onClick={handleNext}
              className="magnetic-btn ripple px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-lg flex items-center gap-2 mx-auto hover:scale-105 transition-transform"
            >
              <Sparkles className="w-5 h-5" /> View Memories
            </button>
          )}
        </div>
      )}

      {/* Memories */}
      {currentStep === 'memories' && (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <h2 className="text-3xl font-black text-white text-center">Our Memories Together</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {photos.slice(0, 6).map((photo, index) => (
              <div
                key={index}
                className="aspect-square rounded-2xl bg-gradient-to-br from-purple-500/30 to-rose-500/30 border border-white/20 flex items-center justify-center text-4xl animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                📸
              </div>
            ))}
          </div>
          {showNext && (
            <div className="text-center">
              <button
                onClick={handleNext}
                className="magnetic-btn ripple px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-lg flex items-center gap-2 mx-auto hover:scale-105 transition-transform"
              >
                <Heart className="w-5 h-5" /> Finish
              </button>
            </div>
          )}
        </div>
      )}

      {/* Final */}
      {currentStep === 'final' && (
        <div className="text-center space-y-6 animate-fade-in">
          <div className="text-8xl animate-bounce">🎉</div>
          <h1 className="text-4xl sm:text-5xl font-black text-white">
            Make a Wish!
          </h1>
          <p className="text-slate-300 text-lg max-w-lg mx-auto">
            May all your dreams come true. This birthday website was created with love just for you.
          </p>
          <button
            onClick={onComplete}
            className="magnetic-btn ripple px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-lg flex items-center gap-2 mx-auto hover:scale-105 transition-transform"
          >
            <Sparkles className="w-5 h-5" /> Continue to Celebration
          </button>
        </div>
      )}

    </div>
  );
}
