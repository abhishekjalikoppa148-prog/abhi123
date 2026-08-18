'use client';

import React, { useEffect, useRef } from 'react';

interface BirthdayConfettiProps {
  className?: string;
  play?: boolean;
  density?: 'low' | 'medium' | 'high';
}

export const BirthdayConfetti: React.FC<BirthdayConfettiProps> = ({
  className = '',
  play = true,
  density = 'medium',
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const particleCount = {
    low: 20,
    medium: 40,
    high: 60,
  }[density];

  const colors = ['#2563EB', '#1E3A8A', '#EFF6FF', '#FFFFFF', '#60A5FA', '#93C5FD'];

  const generateParticles = () => {
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      const type = ['circle', 'rect', 'star', 'ribbon'][Math.floor(Math.random() * 4)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const x = Math.random() * 100;
      const delay = Math.random() * 3;
      const duration = 3 + Math.random() * 2;
      const size = 4 + Math.random() * 8;

      particles.push({ type, color, x, delay, duration, size });
    }
    return particles;
  };

  const particles = generateParticles();

  return (
    <svg
      ref={svgRef}
      className={className}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <defs>
        <style>
          {`
            @keyframes fall {
              0% {
                transform: translateY(-10px) rotate(0deg);
                opacity: 0;
              }
              10% {
                opacity: 1;
              }
              90% {
                opacity: 1;
              }
              100% {
                transform: translateY(110px) rotate(360deg);
                opacity: 0;
              }
            }
            @keyframes sway {
              0%, 100% {
                transform: translateX(0);
              }
              50% {
                transform: translateX(10px);
              }
            }
            @keyframes twinkle {
              0%, 100% {
                opacity: 0.3;
                transform: scale(0.8);
              }
              50% {
                opacity: 1;
                transform: scale(1.2);
              }
            }
            .particle {
              animation: fall var(--duration) ease-in-out infinite;
              animation-delay: var(--delay);
              animation-play-state: ${play ? 'running' : 'paused'};
            }
            .sway {
              animation: sway 2s ease-in-out infinite;
            }
            .sparkle {
              animation: twinkle 1.5s ease-in-out infinite;
            }
          `}
        </style>
      </defs>

      {particles.map((p, i) => {
        const commonProps = {
          key: i,
          style: {
            '--delay': `${p.delay}s`,
            '--duration': `${p.duration}s`,
          } as React.CSSProperties,
          className: 'particle',
        };

        if (p.type === 'circle') {
          return (
            <circle
              {...commonProps}
              cx={p.x}
              cy="0"
              r={p.size / 2}
              fill={p.color}
            />
          );
        }

        if (p.type === 'rect') {
          return (
            <rect
              {...commonProps}
              x={p.x}
              y="0"
              width={p.size}
              height={p.size}
              fill={p.color}
              rx="1"
            />
          );
        }

        if (p.type === 'star') {
          return (
            <g {...commonProps} transform={`translate(${p.x}, 0)`}>
              <polygon
                points="0,-5 1,-1 5,-1 2,1 3,5 0,3 -3,5 -2,1 -5,-1 -1,-1"
                fill={p.color}
                transform={`scale(${p.size / 5})`}
              />
            </g>
          );
        }

        if (p.type === 'ribbon') {
          return (
            <g {...commonProps} transform={`translate(${p.x}, 0)`}>
              <path
                d={`M0,0 Q${p.size / 2},${p.size} 0,${p.size * 2} Q-${p.size / 2},${p.size} 0,${p.size * 4}`}
                stroke={p.color}
                strokeWidth={p.size / 4}
                fill="none"
                strokeLinecap="round"
              />
            </g>
          );
        }

        return null;
      })}

      {/* Sparkles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <g
          key={`sparkle-${i}`}
          className="sparkle"
          style={{
            animationDelay: `${i * 0.2}s`,
            animationPlayState: play ? 'running' : 'paused',
          }}
          transform={`translate(${10 + i * 12}, ${20 + (i % 3) * 20})`}
        >
          <circle r="2" fill="#2563EB" opacity="0.6" />
          <circle r="1" fill="#FFFFFF" opacity="0.8" />
        </g>
      ))}
    </svg>
  );
};
