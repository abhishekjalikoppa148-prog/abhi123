'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Sparkles, Gift, ArrowRight } from 'lucide-react';

interface PostPaymentProgressProps {
  onComplete: () => void;
  websiteUrl?: string;
}

export default function PostPaymentProgress({ onComplete, websiteUrl }: PostPaymentProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 0, title: 'Payment confirmed', icon: CheckCircle2 },
    { id: 1, title: 'Photos processed', icon: Sparkles },
    { id: 2, title: 'Birthday design generated', icon: Gift },
    { id: 3, title: 'Website published', icon: CheckCircle2 },
    { id: 4, title: 'Share link created', icon: CheckCircle2 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        clearInterval(timer);
        setTimeout(onComplete, 1000);
      }
    }, 800);

    return () => clearInterval(timer);
  }, [currentStep, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="w-full max-w-md glass-luxury rounded-3xl p-8 space-y-6 animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30 animate-pulse">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white">🎉 Payment Successful!</h2>
          <p className="text-slate-400 text-sm">Creating your birthday website...</p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= currentStep;
            const isCurrent = index === currentStep;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                  isCompleted ? 'bg-emerald-500/10' : 'bg-slate-900/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-emerald-500' : isCurrent ? 'bg-rose-500 animate-pulse' : 'bg-slate-700'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : isCurrent ? (
                    <Circle className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500" />
                  )}
                </div>
                <span className={`text-sm font-medium ${
                  isCompleted ? 'text-emerald-400' : isCurrent ? 'text-white' : 'text-slate-500'
                }`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Completion Message */}
        {currentStep === steps.length - 1 && (
          <div className="text-center space-y-4 animate-fade-in">
            <div className="text-4xl">🎂</div>
            <h3 className="text-xl font-bold text-white">Your Birthday Website Is Ready!</h3>
            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-sm hover:from-rose-600 hover:to-purple-700 transition-all"
              >
                View Website <ArrowRight className="w-4 h-4" />
              </a>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
