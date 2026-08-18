'use client';

import React from 'react';

interface CountdownDecorationsProps {
  className?: string;
  play?: boolean;
}

export const CountdownDecorations: React.FC<CountdownDecorationsProps> = ({
  className = '',
  play = true,
}) => {
  return (
    <svg
      className={className}
      viewBox="0 0 200 100"
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
            @keyframes float {
              0%, 100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-5px);
              }
            }
            @keyframes rotate {
              0%, 100% {
                transform: rotate(0deg);
              }
              50% {
                transform: rotate(10deg);
              }
            }
            @keyframes pulse {
              0%, 100% {
                opacity: 0.6;
                transform: scale(1);
              }
              50% {
                opacity: 1;
                transform: scale(1.1);
              }
            }
            @keyframes twinkle {
              0%, 100% {
                opacity: 0.3;
              }
              50% {
                opacity: 1;
              }
            }
            .floating {
              animation: float 3s ease-in-out infinite;
              animation-play-state: ${play ? 'running' : 'paused'};
            }
            .rotating {
              transform-origin: center;
              animation: rotate 4s ease-in-out infinite;
              animation-play-state: ${play ? 'running' : 'paused'};
            }
            .pulsing {
              transform-origin: center;
              animation: pulse 2s ease-in-out infinite;
              animation-play-state: ${play ? 'running' : 'paused'};
            }
            .twinkling {
              animation: twinkle 1.5s ease-in-out infinite;
              animation-play-state: ${play ? 'running' : 'paused'};
            }
          `}
        </style>
      </defs>

      {/* Left side decorations */}
      <g className="floating" style={{ animationDelay: '0s' }}>
        <polygon
          points="20,30 22,35 27,35 23,38 25,43 20,40 15,43 17,38 13,35 18,35"
          fill="#2563EB"
          opacity="0.7"
        />
      </g>

      <g className="rotating" style={{ animationDelay: '0.5s' }} transform="translate(40, 50)">
        <circle r="8" fill="none" stroke="#60A5FA" strokeWidth="1.5" />
        <circle r="4" fill="#EFF6FF" opacity="0.5" />
      </g>

      <g className="pulsing" style={{ animationDelay: '1s' }} transform="translate(15, 70)">
        <polygon
          points="0,-6 2,-2 6,-2 3,1 4,5 0,3 -4,5 -3,1 -6,-2 -2,-2"
          fill="#FCD34D"
        />
      </g>

      {/* Right side decorations */}
      <g className="floating" style={{ animationDelay: '0.3s' }} transform="translate(180, 30)">
        <polygon
          points="0,-6 2,-2 6,-2 3,1 4,5 0,3 -4,5 -3,1 -6,-2 -2,-2"
          fill="#2563EB"
          opacity="0.7"
        />
      </g>

      <g className="rotating" style={{ animationDelay: '0.8s' }} transform="translate(160, 50)">
        <circle r="8" fill="none" stroke="#60A5FA" strokeWidth="1.5" />
        <circle r="4" fill="#EFF6FF" opacity="0.5" />
      </g>

      <g className="pulsing" style={{ animationDelay: '1.3s' }} transform="translate(185, 70)">
        <polygon
          points="0,-6 2,-2 6,-2 3,1 4,5 0,3 -4,5 -3,1 -6,-2 -2,-2"
          fill="#FCD34D"
        />
      </g>

      {/* Top decorations */}
      <g className="floating" style={{ animationDelay: '0.2s' }} transform="translate(100, 15)">
        <circle r="5" fill="#93C5FD" opacity="0.6" />
      </g>

      <g className="floating" style={{ animationDelay: '0.7s' }} transform="translate(70, 20)">
        <circle r="3" fill="#FFFFFF" opacity="0.8" />
      </g>

      <g className="floating" style={{ animationDelay: '1s' }} transform="translate(130, 20)">
        <circle r="4" fill="#60A5FA" opacity="0.5" />
      </g>

      {/* Sparkles */}
      <g className="twinkling" style={{ animationDelay: '0s' }} transform="translate(30, 40)">
        <circle r="2" fill="#FCD34D" filter="url(#glow)" />
      </g>
      <g className="twinkling" style={{ animationDelay: '0.3s' }} transform="translate(170, 40)">
        <circle r="2" fill="#FCD34D" filter="url(#glow)" />
      </g>
      <g className="twinkling" style={{ animationDelay: '0.6s' }} transform="translate(50, 80)">
        <circle r="1.5" fill="#FCD34D" filter="url(#glow)" />
      </g>
      <g className="twinkling" style={{ animationDelay: '0.9s' }} transform="translate(150, 80)">
        <circle r="1.5" fill="#FCD34D" filter="url(#glow)" />
      </g>

      {/* Small birthday icons */}
      <g className="floating" style={{ animationDelay: '1.2s' }} transform="translate(60, 25)">
        {/* Mini cake icon */}
        <rect x="-4" y="0" width="8" height="6" rx="1" fill="#60A5FA" />
        <rect x="-3" y="-2" width="6" height="4" rx="0.5" fill="#93C5FD" />
        <line x1="0" y1="-2" x2="0" y2="-4" stroke="#1E3A8A" strokeWidth="0.5" />
        <ellipse cx="0" cy="-5" rx="1.5" ry="2" fill="#FCD34D" />
      </g>

      <g className="floating" style={{ animationDelay: '1.5s' }} transform="translate(140, 25)">
        {/* Mini candle icon */}
        <rect x="-1.5" y="-2" width="3" height="8" rx="0.5" fill="#2563EB" />
        <ellipse cx="0" cy="-4" rx="2" ry="3" fill="#FCD34D" />
      </g>
    </svg>
  );
};
