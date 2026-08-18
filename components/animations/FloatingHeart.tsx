'use client';

import React from 'react';

interface FloatingHeartProps {
  className?: string;
  variant?: 'red' | 'blue' | 'pink' | 'purple';
  size?: 'small' | 'medium' | 'large';
  play?: boolean;
  delay?: number;
}

export const FloatingHeart: React.FC<FloatingHeartProps> = ({
  className = '',
  variant = 'red',
  size = 'medium',
  play = true,
  delay = 0,
}) => {
  const colors = {
    red: { fill: '#EF4444', stroke: '#DC2626' },
    blue: { fill: '#2563EB', stroke: '#1E3A8A' },
    pink: { fill: '#EC4899', stroke: '#DB2777' },
    purple: { fill: '#8B5CF6', stroke: '#7C3AED' },
  };

  const sizes = {
    small: { scale: 0.6 },
    medium: { scale: 1 },
    large: { scale: 1.5 },
  };

  const color = colors[variant];
  const sizeScale = sizes[size];

  return (
    <svg
      className={className}
      viewBox="0 0 50 50"
      preserveAspectRatio="xMidYMid meet"
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <style>
          {`
            @keyframes heartFloat {
              0% {
                transform: translateY(0) scale(0) rotate(0deg);
                opacity: 0;
              }
              10% {
                opacity: 1;
              }
              50% {
                transform: translateY(-20px) scale(1.2) rotate(5deg);
                opacity: 1;
              }
              90% {
                opacity: 0.5;
              }
              100% {
                transform: translateY(-40px) scale(1) rotate(-5deg);
                opacity: 0;
              }
            }
            .heart {
              transform-origin: center 25px;
              animation: heartFloat 3s ease-out infinite;
              animation-delay: ${delay}s;
              animation-play-state: ${play ? 'running' : 'paused'};
            }
          `}
        </style>
      </defs>

      <g
        className="heart"
        transform={`translate(25, 25) scale(${sizeScale.scale})`}
        filter="url(#glow)"
      >
        <path
          d="M0,8 C-8,0 -16,-8 -8,-16 C0,-24 8,-16 0,-8 C-8,-16 0,-24 8,-16 C16,-8 8,0 0,8"
          fill={color.fill}
          stroke={color.stroke}
          strokeWidth="1"
        />
      </g>
    </svg>
  );
};

// Multi-heart container for creating heart showers
export const HeartShower: React.FC<{
  className?: string;
  count?: number;
  play?: boolean;
}> = ({ className = '', count = 5, play = true }) => {
  const variants: Array<'red' | 'blue' | 'pink' | 'purple'> = ['red', 'blue', 'pink', 'purple'];
  const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];

  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100%' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${10 + (i % 5) * 20}%`,
            top: `${Math.floor(i / 5) * 20}%`,
            width: '30px',
            height: '30px',
          }}
        >
          <FloatingHeart
            variant={variants[i % variants.length]}
            size={sizes[i % sizes.length]}
            play={play}
            delay={i * 0.4}
          />
        </div>
      ))}
    </div>
  );
};
