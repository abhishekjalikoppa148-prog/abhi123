'use client';

import { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

interface BirthdayCountdownProps {
  birthdayDate: string;
  timezone?: string;
  onComplete?: () => void;
}

export default function BirthdayCountdown({ birthdayDate, timezone = 'UTC', onComplete }: BirthdayCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isBirthday, setIsBirthday] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const birthday = new Date(birthdayDate);
      
      // Set birthday to current year if it's already passed
      const currentYear = now.getFullYear();
      birthday.setFullYear(currentYear);
      
      if (birthday < now) {
        birthday.setFullYear(currentYear + 1);
      }

      const difference = birthday.getTime() - now.getTime();

      if (difference <= 0) {
        setIsBirthday(true);
        onComplete?.();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [birthdayDate, onComplete]);

  if (isBirthday) {
    return (
      <div className="text-center space-y-4 animate-fade-in">
        <div className="text-6xl">🎂</div>
        <h2 className="text-3xl font-black text-white">Happy Birthday!</h2>
        <p className="text-slate-300">Today is the special day!</p>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6">
      <div className="flex items-center justify-center gap-2 text-slate-400">
        <Clock className="w-5 h-5" />
        <span className="text-sm font-medium">Countdown to Birthday</span>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { value: timeLeft.days, label: 'Days' },
          { value: timeLeft.hours, label: 'Hours' },
          { value: timeLeft.minutes, label: 'Minutes' },
          { value: timeLeft.seconds, label: 'Seconds' }
        ].map((item) => (
          <div key={item.label} className="p-4 rounded-2xl glass-luxury space-y-2">
            <div className="text-3xl sm:text-4xl font-black text-white">
              {String(item.value).padStart(2, '0')}
            </div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              {item.label}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
        <Calendar className="w-4 h-4" />
        <span>Timezone: {timezone}</span>
      </div>
    </div>
  );
}
