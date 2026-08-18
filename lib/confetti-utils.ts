import confetti from 'canvas-confetti';
import { celebrationAudio } from './audio-synth';

export function fireCelebrationConfetti() {
  celebrationAudio.playPop();
  
  // Left side burst
  confetti({
    particleCount: 60,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.7 },
    colors: ['#f43f5e', '#fbbf24', '#38bdf8', '#a855f7', '#34d399']
  });

  // Right side burst
  confetti({
    particleCount: 60,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 0.7 },
    colors: ['#f43f5e', '#fbbf24', '#38bdf8', '#a855f7', '#34d399']
  });

  // Center fireworks star burst
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { x: 0.5, y: 0.4 },
      shapes: ['star', 'circle'],
      colors: ['#ffd700', '#ff69b4', '#00ffff', '#ff4500']
    });
  }, 250);
}

export function fireHeartConfetti() {
  celebrationAudio.playChime();
  confetti({
    particleCount: 50,
    spread: 80,
    origin: { x: 0.5, y: 0.6 },
    colors: ['#e11d48', '#fb7185', '#fda4af', '#f43f5e']
  });
}
