'use client';

import React from 'react';

interface QRCodeCelebrationProps {
  className?: string;
  play?: boolean;
}

export const QRCodeCelebration: React.FC<QRCodeCelebrationProps> = ({
  className = '',
  play = true,
}) => {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      preserveAspectRatio="xMidYMid meet"
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <style>
          {`
            @keyframes framePulse {
              0%, 100% {
                transform: scale(1);
                opacity: 0.8;
              }
              50% {
                transform: scale(1.05);
                opacity: 1;
              }
            }
            @keyframes glowExpand {
              0%, 100% {
                transform: scale(0.8);
                opacity: 0.3;
              }
              50% {
                transform: scale(1.2);
                opacity: 0.6;
              }
            }
            @keyframes starTwinkle {
              0%, 100% {
                opacity: 0.3;
                transform: scale(0.8) rotate(0deg);
              }
              50% {
                opacity: 1;
                transform: scale(1.2) rotate(180deg);
              }
            }
            @keyframes sparkleMove {
              0% {
                transform: translate(0, 0) scale(0);
                opacity: 0;
              }
              50% {
                opacity: 1;
                transform: translate(5px, -5px) scale(1);
              }
              100% {
                transform: translate(10px, -10px) scale(0);
                opacity: 0;
              }
            }
            .frame-pulse {
              transform-origin: center;
              animation: framePulse 2s ease-in-out infinite;
              animation-play-state: ${play ? 'running' : 'paused'};
            }
            .glow-expand {
              transform-origin: center;
              animation: glowExpand 3s ease-in-out infinite;
              animation-play-state: ${play ? 'running' : 'paused'};
            }
            .star-twinkle {
              transform-origin: center;
              animation: starTwinkle 2s ease-in-out infinite;
              animation-play-state: ${play ? 'running' : 'paused'};
            }
            .sparkle {
              animation: sparkleMove 1.5s ease-out infinite;
              animation-play-state: ${play ? 'running' : 'paused'};
            }
          `}
        </style>
      </defs>

      {/* Outer glow */}
      <g className="glow-expand" filter="url(#glow)">
        <rect
          x="25"
          y="25"
          width="70"
          height="70"
          rx="8"
          fill="none"
          stroke="#2563EB"
          strokeWidth="3"
          opacity="0.3"
        />
      </g>

      {/* Main frame */}
      <g className="frame-pulse">
        <rect
          x="30"
          y="30"
          width="60"
          height="60"
          rx="6"
          fill="none"
          stroke="#2563EB"
          strokeWidth="2"
        />
        
        {/* Corner decorations */}
        <path
          d="M30,40 L30,30 L40,30"
          fill="none"
          stroke="#60A5FA"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M80,30 L90,30 L90,40"
          fill="none"
          stroke="#60A5FA"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M90,80 L90,90 L80,90"
          fill="none"
          stroke="#60A5FA"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M40,90 L30,90 L30,80"
          fill="none"
          stroke="#60A5FA"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      {/* Inner decorative frame */}
      <rect
        x="35"
        y="35"
        width="50"
        height="50"
        rx="4"
        fill="none"
        stroke="#93C5FD"
        strokeWidth="1"
        opacity="0.5"
      />

      {/* Stars around the frame */}
      <g className="star-twinkle" style={{ animationDelay: '0s' }} transform="translate(20, 30)">
        <polygon
          points="0,-4 1,-1 4,-1 2,1 3,4 0,2 -3,4 -2,1 -4,-1 -1,-1"
          fill="#FCD34D"
          filter="url(#glow)"
        />
      </g>

      <g className="star-twinkle" style={{ animationDelay: '0.3s' }} transform="translate(100, 30)">
        <polygon
          points="0,-4 1,-1 4,-1 2,1 3,4 0,2 -3,4 -2,1 -4,-1 -1,-1"
          fill="#FCD34D"
          filter="url(#glow)"
        />
      </g>

      <g className="star-twinkle" style={{ animationDelay: '0.6s' }} transform="translate(20, 90)">
        <polygon
          points="0,-4 1,-1 4,-1 2,1 3,4 0,2 -3,4 -2,1 -4,-1 -1,-1"
          fill="#FCD34D"
          filter="url(#glow)"
        />
      </g>

      <g className="star-twinkle" style={{ animationDelay: '0.9s' }} transform="translate(100, 90)">
        <polygon
          points="0,-4 1,-1 4,-1 2,1 3,4 0,2 -3,4 -2,1 -4,-1 -1,-1"
          fill="#FCD34D"
          filter="url(#glow)"
        />
      </g>

      {/* Sparkles */}
      <g className="sparkle" style={{ animationDelay: '0s' }} transform="translate(25, 60)">
        <circle r="2" fill="#FFFFFF" filter="url(#glow)" />
      </g>
      <g className="sparkle" style={{ animationDelay: '0.2s' }} transform="translate(95, 60)">
        <circle r="2" fill="#FFFFFF" filter="url(#glow)" />
      </g>
      <g className="sparkle" style={{ animationDelay: '0.4s' }} transform="translate(60, 25)">
        <circle r="2" fill="#FFFFFF" filter="url(#glow)" />
      </g>
      <g className="sparkle" style={{ animationDelay: '0.6s' }} transform="translate(60, 95)">
        <circle r="2" fill="#FFFFFF" filter="url(#glow)" />
      </g>

      {/* Corner accent dots */}
      <circle cx="30" cy="30" r="3" fill="#2563EB" opacity="0.6" />
      <circle cx="90" cy="30" r="3" fill="#2563EB" opacity="0.6" />
      <circle cx="90" cy="90" r="3" fill="#2563EB" opacity="0.6" />
      <circle cx="30" cy="90" r="3" fill="#2563EB" opacity="0.6" />

      {/* Note: The actual QR code should be rendered separately */}
      {/* This component only provides the decorative frame animation */}
    </svg>
  );
};
