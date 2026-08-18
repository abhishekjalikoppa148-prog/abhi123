'use client';

import { useState, useEffect } from 'react';
import { Clock, Sparkles } from 'lucide-react';

interface CountdownTimerProps {
  birthdayDate: string; // YYYY-MM-DD
  personName: string;
  accent?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export default function CountdownTimer({ birthdayDate, personName, accent = '#f43f5e' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const target = new Date(`${birthdayDate}T00:00:00`).getTime();

    const tick = () => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setIsPast(true);
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }

      setIsPast(false);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [birthdayDate]);

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.mins },
    { label: 'Secs', value: timeLeft.secs },
  ];

  return (
    <section className="max-w-2xl mx-auto px-4">
      <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl space-y-6 text-center">
        <div className="flex items-center justify-center gap-2 text-amber-300">
          <Clock className="w-5 h-5" />
          <span className="text-xs font-extrabold uppercase tracking-widest">
            {isPast ? '🎉 The Birthday Has Arrived!' : `Countdown to ${personName}'s Birthday`}
          </span>
          <Sparkles className="w-4 h-4 animate-spin" />
        </div>

        {isPast ? (
          <div className="text-center space-y-2">
            <p className="text-4xl font-black text-white">🎂 Happy Birthday, {personName}! 🎂</p>
            <p className="text-slate-300 text-sm">Today is the big day!</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {units.map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center">
                <div
                  className="w-full aspect-square flex items-center justify-center rounded-2xl bg-white/15 border border-white/20 shadow-inner backdrop-blur-sm"
                  style={{ boxShadow: `0 0 20px ${accent}33` }}
                >
                  <span className="text-3xl sm:text-4xl font-black tabular-nums text-white drop-shadow">
                    {pad(value)}
                  </span>
                </div>
                <span className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-300">
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-slate-400">
          {new Date(birthdayDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </section>
  );
}
