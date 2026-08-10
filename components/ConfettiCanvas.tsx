'use client';

import { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  triggerOnMount?: boolean;
  continuous?: boolean;
}

export default function ConfettiCanvas({ triggerOnMount = true, continuous = false }: ConfettiProps) {
  
  const fireConfettiBurst = useCallback(() => {
    try {
      // First burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Left & right cannons
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 }
        });
      }, 250);
    } catch {
      // Fallback
    }
  }, []);

  const fireFireworks = useCallback(() => {
    try {
      const count = 200;
      const defaults = {
        origin: { y: 0.7 }
      };

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    } catch {
      // Fallback
    }
  }, []);

  useEffect(() => {
    if (triggerOnMount) {
      fireConfettiBurst();
    }

    let interval: NodeJS.Timeout | null = null;
    if (continuous) {
      interval = setInterval(() => {
        fireFireworks();
      }, 3500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [triggerOnMount, continuous, fireConfettiBurst, fireFireworks]);

  return null;
}

export function triggerGlobalFireworks() {
  try {
    const end = Date.now() + 2 * 1000;
    const colors = ['#f43f5e', '#a855f7', '#f59e0b', '#06b6d4', '#ec4899'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch {
    // fallback
  }
}
