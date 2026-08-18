'use client';

import React, { useRef } from 'react';

interface BirthdayCakeProps {
  className?: string;
  play?: boolean;
}

export const BirthdayCake: React.FC<BirthdayCakeProps> = ({
  className = '',
  play = true,
}) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <defs>
        <linearGradient id="cakeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="100%" stopColor="#93C5FD" />
        </linearGradient>
        <linearGradient id="frostingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#EFF6FF" />
        </linearGradient>
        <linearGradient id="candleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <style>
          {`
            @keyframes cakeScale {
              0%, 100% {
                transform: scale(0.95);
              }
              50% {
                transform: scale(1);
              }
            }
            @keyframes flameFlicker {
              0%, 100% {
                transform: scaleY(1) scaleX(1);
                opacity: 1;
              }
              25% {
                transform: scaleY(1.1) scaleX(0.9);
                opacity: 0.9;
              }
              50% {
                transform: scaleY(0.9) scaleX(1.1);
                opacity: 1;
              }
              75% {
                transform: scaleY(1.05) scaleX(0.95);
                opacity: 0.95;
              }
            }
            @keyframes sparkle {
              0%, 100% {
                opacity: 0;
                transform: scale(0);
              }
              50% {
                opacity: 1;
                transform: scale(1);
              }
            }
            @keyframes float {
              0%, 100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-3px);
              }
            }
            .cake-group {
              transform-origin: center 70px;
              animation: cakeScale 3s ease-in-out infinite;
              animation-play-state: ${play ? 'running' : 'paused'};
            }
            .flame {
              transform-origin: center bottom;
              animation: flameFlicker 0.3s ease-in-out infinite;
              animation-play-state: ${play ? 'running' : 'paused'};
            }
            .sparkle {
              animation: sparkle 2s ease-in-out infinite;
              animation-play-state: ${play ? 'running' : 'paused'};
            }
            .floating {
              animation: float 2s ease-in-out infinite;
              animation-play-state: ${play ? 'running' : 'paused'};
            }
          `}
        </style>
      </defs>

      <g className="cake-group">
        {/* Cake Base */}
        <rect
          x="20"
          y="60"
          width="60"
          height="30"
          rx="4"
          fill="url(#cakeGradient)"
          stroke="#2563EB"
          strokeWidth="1"
        />

        {/* Cake Layer */}
        <rect
          x="25"
          y="45"
          width="50"
          height="20"
          rx="3"
          fill="url(#cakeGradient)"
          stroke="#2563EB"
          strokeWidth="1"
        />

        {/* Frosting Top */}
        <path
          d="M25 45 Q30 40 35 45 Q40 38 45 45 Q50 40 55 45 Q60 38 65 45 Q70 40 75 45"
          fill="url(#frostingGradient)"
          stroke="#EFF6FF"
          strokeWidth="1"
        />

        {/* Frosting Drips */}
        <path
          d="M30 45 L30 50 Q32 52 34 50 L34 45"
          fill="url(#frostingGradient)"
          stroke="#EFF6FF"
          strokeWidth="0.5"
        />
        <path
          d="M45 45 L45 52 Q47 54 49 52 L49 45"
          fill="url(#frostingGradient)"
          stroke="#EFF6FF"
          strokeWidth="0.5"
        />
        <path
          d="M60 45 L60 50 Q62 52 64 50 L64 45"
          fill="url(#frostingGradient)"
          stroke="#EFF6FF"
          strokeWidth="0.5"
        />

        {/* Candle */}
        <g transform="translate(50, 45)">
          <rect
            x="-3"
            y="-15"
            width="6"
            height="15"
            rx="1"
            fill="url(#candleGradient)"
            stroke="#1E3A8A"
            strokeWidth="0.5"
          />
          
          {/* Wick */}
          <line
            x1="0"
            y1="-15"
            x2="0"
            y2="-18"
            stroke="#1E3A8A"
            strokeWidth="1"
          />

          {/* Flame */}
          <g className="flame" filter="url(#glow)">
            <ellipse
              cx="0"
              cy="-22"
              rx="3"
              ry="5"
              fill="#FCD34D"
            />
            <ellipse
              cx="0"
              cy="-24"
              rx="2"
              ry="3"
              fill="#F59E0B"
            />
          </g>
        </g>

        {/* Decorative Stars */}
        <g className="floating" style={{ animationDelay: '0s' }}>
          <polygon
            points="15,55 16,58 19,58 17,60 18,63 15,61 12,63 13,60 11,58 14,58"
            fill="#2563EB"
            opacity="0.6"
            transform="scale(0.8)"
          />
        </g>
        <g className="floating" style={{ animationDelay: '0.5s' }}>
          <polygon
            points="85,50 86,53 89,53 87,55 88,58 85,56 82,58 83,55 81,53 84,53"
            fill="#2563EB"
            opacity="0.6"
            transform="scale(0.6)"
          />
        </g>

        {/* Sparkles */}
        <g className="sparkle" style={{ animationDelay: '0s' }}>
          <circle cx="35" cy="35" r="1.5" fill="#FCD34D" />
        </g>
        <g className="sparkle" style={{ animationDelay: '0.3s' }}>
          <circle cx="65" cy="40" r="1" fill="#FCD34D" />
        </g>
        <g className="sparkle" style={{ animationDelay: '0.6s' }}>
          <circle cx="50" cy="30" r="1.2" fill="#FCD34D" />
        </g>
        <g className="sparkle" style={{ animationDelay: '0.9s' }}>
          <circle cx="25" cy="50" r="1" fill="#FCD34D" />
        </g>
        <g className="sparkle" style={{ animationDelay: '1.2s' }}>
          <circle cx="75" cy="55" r="1.2" fill="#FCD34D" />
        </g>
      </g>
    </svg>
  );
};
