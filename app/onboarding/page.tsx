'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, Sparkles, Home, GraduationCap, Briefcase, Cake, ArrowRight, Gift, CheckCircle2 } from 'lucide-react';
import { RELATIONSHIP_OPTIONS, getRecommendedTemplates } from '@/lib/template-recommendation';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [relationship, setRelationship] = useState<string>('');
  const [personName, setPersonName] = useState('');
  const [aboutThem, setAboutThem] = useState('');
  const [memories, setMemories] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = () => {
    // Redirect to builder with pre-filled data
    const params = new URLSearchParams();
    params.set('template', selectedTemplate);
    params.set('name', personName);
    params.set('relationship', relationship);
    params.set('about', aboutThem);
    params.set('memories', memories);
    
    router.push(`/builder?${params.toString()}`);
  };

  const recommendedTemplates = relationship ? getRecommendedTemplates(relationship as any) : [];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl glass-luxury rounded-3xl p-8 sm:p-12 space-y-8">
        
        {/* Progress */}
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step >= i ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white' : 'bg-slate-800 text-slate-500'
              }`}>
                {step > i ? <CheckCircle2 className="w-4 h-4" /> : i}
              </div>
              {i < 5 && <div className={`flex-1 h-1 rounded-full ${step > i ? 'bg-gradient-to-r from-rose-500 to-purple-600' : 'bg-slate-800'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Who is this for? */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Who are you creating this birthday surprise for?</h2>
              <p className="text-slate-400 mt-2">This helps us recommend the perfect template for you.</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {RELATIONSHIP_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => { setRelationship(option.id); handleNext(); }}
                  className={`p-4 rounded-2xl border-2 transition-all text-center ${
                    relationship === option.id
                      ? 'border-rose-500 bg-rose-500/10'
                      : 'border-slate-700 hover:border-slate-600 bg-slate-900/50'
                  }`}
                >
                  <span className="text-3xl block mb-2">{option.emoji}</span>
                  <span className="text-sm font-semibold text-white">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: What's their name? */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">What's their name?</h2>
              <p className="text-slate-400 mt-2">We'll personalize everything with their name.</p>
            </div>
            
            <input
              type="text"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              placeholder="Enter their name..."
              className="w-full px-6 py-4 rounded-2xl glass-luxury text-white text-lg focus:border-rose-500 focus:outline-none"
            />

            <div className="flex justify-between">
              <button onClick={handleBack} className="px-6 py-3 rounded-xl glass-luxury text-slate-300 hover:text-white font-bold">
                Back
              </button>
              <button onClick={handleNext} disabled={!personName} className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold disabled:opacity-50">
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Tell us about them */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Tell us a little about them</h2>
              <p className="text-slate-400 mt-2">This helps our AI create personalized messages.</p>
            </div>
            
            <textarea
              value={aboutThem}
              onChange={(e) => setAboutThem(e.target.value)}
              placeholder="e.g. They love music, enjoy traveling, have a great sense of humor..."
              rows={4}
              className="w-full px-6 py-4 rounded-2xl glass-luxury text-white text-lg focus:border-rose-500 focus:outline-none resize-none"
            />

            <div className="flex justify-between">
              <button onClick={handleBack} className="px-6 py-3 rounded-xl glass-luxury text-slate-300 hover:text-white font-bold">
                Back
              </button>
              <button onClick={handleNext} className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold">
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Add memories */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Add special memories</h2>
              <p className="text-slate-400 mt-2">Share some favorite moments you've shared together.</p>
            </div>
            
            <textarea
              value={memories}
              onChange={(e) => setMemories(e.target.value)}
              placeholder="e.g. Our trip to Goa, their graduation day, birthday celebrations..."
              rows={4}
              className="w-full px-6 py-4 rounded-2xl glass-luxury text-white text-lg focus:border-rose-500 focus:outline-none resize-none"
            />

            <div className="flex justify-between">
              <button onClick={handleBack} className="px-6 py-3 rounded-xl glass-luxury text-slate-300 hover:text-white font-bold">
                Back
              </button>
              <button onClick={handleNext} className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold">
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Choose style */}
        {step === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Choose a style</h2>
              <p className="text-slate-400 mt-2">Based on your selection, we recommend these templates:</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {recommendedTemplates.map((templateId) => (
                <button
                  key={templateId}
                  onClick={() => setSelectedTemplate(templateId)}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    selectedTemplate === templateId
                      ? 'border-rose-500 bg-rose-500/10'
                      : 'border-slate-700 hover:border-slate-600 bg-slate-900/50'
                  }`}
                >
                  <span className="font-semibold text-white capitalize">{templateId}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <button onClick={handleBack} className="px-6 py-3 rounded-xl glass-luxury text-slate-300 hover:text-white font-bold">
                Back
              </button>
              <button onClick={handleComplete} disabled={!selectedTemplate} className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold disabled:opacity-50 flex items-center gap-2">
                <Gift className="w-5 h-5" /> Create Birthday Website
              </button>
            </div>
          </div>
        )}

        {/* Skip option */}
        <div className="text-center pt-4 border-t border-slate-800">
          <Link href="/builder" className="text-sm text-slate-400 hover:text-white transition-colors">
            Skip onboarding and go to full builder →
          </Link>
        </div>

      </div>
    </div>
  );
}
