'use client';

import { useEffect, useState } from 'react';

export default function ParticleBackground() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number; delay: number; opacity: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 8 + 12,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.2 + 0.2, // 20%-40% opacity
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="particle-bg">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            background: `rgba(214, 180, 119, ${particle.opacity})`, // Champagne gold
            borderRadius: '50%',
          }}
        />
      ))}
    </div>
  );
}
