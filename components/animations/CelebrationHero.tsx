'use client';

import React from 'react';

interface CelebrationHeroProps {
  className?: string;
  play?: boolean;
}

export const CelebrationHero: React.FC<CelebrationHeroProps> = ({
  className = '',
  play = true,
}) => {
  return (
    <svg
      className={className}
      viewBox="0 0 400 200"
      preserveAspectRatio="xMidYMid slice"
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <defs>
        <linearGradient id="balloonGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="balloonGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
        <linearGradient id="balloonGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="100%" stopColor="#93C5FD" />
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
            @keyframes float {
              0%, 100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-10px);
              }
            }
            @keyframes floatSlow {
              0%, 100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-15px);
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
            @keyframes confettiMove {
              0% {
                transform: translateY(-10px) rotate(0deg);
              }
              100% {
                transform: translateY(210px) rotate(360deg);
              }
            }
            @keyframes heartPulse {
              0%, 100% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.1);
              }
            }
            .float {
              animation: float 3s ease-in-out infinite;
              animation-play-state: ${play ? 'running' : 'paused'};
            }
            .float-slow {
              animation: floatSlow 4s ease-in-out infinite;
              animation-play-state: ${play ? 'running' : 'paused'};
            }
            .twinkle {
              animation: twinkle 2s ease-in-out infinite;
              animation-play-state: ${play ? 'running' : 'paused'};
            }
            .confetti {
              animation: confettiMove 5s linear infinite;
              animation-play-state: ${play ? 'running' : 'paused'};
            }
            .heart-pulse {
              transform-origin: center;
              animation: heartPulse 1.5s ease-in-out infinite;
              animation-play-state: ${play ? 'running' : 'paused'};
            }
          `}
        </style>
      </defs>

      {/* Background elements - slower movement */}
      <g className="float-slow" style={{ animationDelay: '0s' }} transform="translate(50, 100)">
        <ellipse cx="0" cy="0" rx="25" ry="30" fill="url(#balloonGradient1)" opacity="0.3" />
        <line x1="0" y1="30" x2="0" y2="60" stroke="#2563EB" strokeWidth="1" opacity="0.3" />
      </g>

      <g className="float-slow" style={{ animationDelay: '1s' }} transform="translate(350, 80)">
        <ellipse cx="0" cy="0" rx="20" ry="25" fill="url(#balloonGradient2)" opacity="0.3" />
        <line x1="0" y1="25" x2="0" y2="50" stroke="#60A5FA" strokeWidth="1" opacity="0.3" />
      </g>

      {/* Main balloons - faster movement */}
      <g className="float" style={{ animationDelay: '0s' }} transform="translate(80, 60)">
        <ellipse cx="0" cy="0" rx="30" ry="35" fill="url(#balloonGradient1)" />
        <ellipse cx="-8" cy="-10" rx="8" ry="10" fill="#93C5FD" opacity="0.4" />
        <line x1="0" y1="35" x2="0" y2="70" stroke="#1E3A8A" strokeWidth="1.5" />
      </g>

      <g className="float" style={{ animationDelay: '0.5s' }} transform="translate(150, 40)">
        <ellipse cx="0" cy="0" rx="25" ry="30" fill="url(#balloonGradient2)" />
        <ellipse cx="-6" cy="-8" rx="6" ry="8" fill="#EFF6FF" opacity="0.4" />
        <line x1="0" y1="30" x2="0" y2="60" stroke="#2563EB" strokeWidth="1.5" />
      </g>

      <g className="float" style={{ animationDelay: '1s' }} transform="translate(250, 50)">
        <ellipse cx="0" cy="0" rx="28" ry="33" fill="url(#balloonGradient3)" />
        <ellipse cx="-7" cy="-9" rx="7" ry="9" fill="#FFFFFF" opacity="0.5" />
        <line x1="0" y1="33" x2="0" y2="65" stroke="#60A5FA" strokeWidth="1.5" />
      </g>

      <g className="float" style={{ animationDelay: '1.5s' }} transform="translate(320, 70)">
        <ellipse cx="0" cy="0" rx="22" ry="27" fill="url(#balloonGradient1)" />
        <ellipse cx="-5" cy="-7" rx="5" ry="7" fill="#93C5FD" opacity="0.4" />
        <line x1="0" y1="27" x2="0" y2="55" stroke="#1E3A8A" strokeWidth="1.5" />
      </g>

      {/* Stars */}
      <g className="twinkle" style={{ animationDelay: '0s' }} transform="translate(100, 30)">
        <polygon
          points="0,-5 1,-2 4,-2 2,0 3,3 0,2 -3,3 -2,0 -4,-2 -1,-2"
          fill="#FCD34D"
          filter="url(#glow)"
        />
      </g>
      <g className="twinkle" style={{ animationDelay: '0.3s' }} transform="translate(200, 20)">
        <polygon
          points="0,-4 0.8,-1.6 3.2,-1.6 1.6,0 2.4,2.4 0,1.2 -2.4,2.4 -1.6,0 -3.2,-1.6 -0.8,-1.6"
          fill="#FCD34D"
          filter="url(#glow)"
        />
      </g>
      <g className="twinkle" style={{ animationDelay: '0.6s' }} transform="translate(300, 35)">
        <polygon
          points="0,-5 1,-2 4,-2 2,0 3,3 0,2 -3,3 -2,0 -4,-2 -1,-2"
          fill="#FCD34D"
          filter="url(#glow)"
        />
      </g>

      {/* Confetti */}
      <g className="confetti" style={{ animationDelay: '0s' }} transform="translate(60, 0)">
        <circle r="3" fill="#2563EB" />
      </g>
      <g className="confetti" style={{ animationDelay: '0.5s' }} transform="translate(120, 0)">
        <rect width="6" height="6" fill="#60A5FA" transform="rotate(45)" />
      </g>
      <g className="confetti" style={{ animationDelay: '1s' }} transform="translate(180, 0)">
        <circle r="2" fill="#93C5FD" />
      </g>
      <g className="confetti" style={{ animationDelay: '1.5s' }} transform="translate(240, 0)">
        <rect width="5" height="5" fill="#EFF6FF" transform="rotate(30)" />
      </g>
      <g className="confetti" style={{ animationDelay: '2s' }} transform="translate(300, 0)">
        <circle r="3" fill="#FCD34D" />
      </g>
      <g className="confetti" style={{ animationDelay: '2.5s' }} transform="translate(340, 0)">
        <rect width="4" height="4" fill="#2563EB" transform="rotate(60)" />
      </g>

      {/* Hearts */}
      <g className="heart-pulse" style={{ animationDelay: '0s' }} transform="translate(130, 90)">
        <path
          d="M0,4 C-4,0 -8,-4 -4,-8 C0,-12 4,-8 0,-4 C-4,-8 0,-12 4,-8 C8,-4 4,0 0,4"
          fill="#EF4444"
          transform="scale(0.8)"
        />
      </g>
      <g className="heart-pulse" style={{ animationDelay: '0.5s' }} transform="translate(270, 85)">
        <path
          d="M0,4 C-4,0 -8,-4 -4,-8 C0,-12 4,-8 0,-4 C-4,-8 0,-12 4,-8 C8,-4 4,0 0,4"
          fill="#EC4899"
          transform="scale(0.6)"
        />
      </g>

      {/* Sparkles */}
      <g className="twinkle" style={{ animationDelay: '0.2s' }} transform="translate(170, 50)">
        <circle r="2" fill="#FFFFFF" filter="url(#glow)" />
      </g>
      <g className="twinkle" style={{ animationDelay: '0.4s' }} transform="translate(230, 45)">
        <circle r="1.5" fill="#FFFFFF" filter="url(#glow)" />
      </g>
      <g className="twinkle" style={{ animationDelay: '0.8s' }} transform="translate(190, 70)">
        <circle r="2" fill="#FFFFFF" filter="url(#glow)" />
      </g>

      {/* Small birthday cake decoration */}
      <g className="float" style={{ animationDelay: '2s' }} transform="translate(380, 150)">
        <rect x="-6" y="0" width="12" height="8" rx="1" fill="#60A5FA" />
        <rect x="-5" y="-3" width="10" height="5" rx="0.5" fill="#93C5FD" />
        <line x1="0" y1="-3" x2="0" y2="-6" stroke="#1E3A8A" strokeWidth="0.5" />
        <ellipse cx="0" cy="-7" rx="1.5" ry="2" fill="#FCD34D" />
      </g>
    </svg>
  );
};
