'use client';

import React, { useEffect, useRef, useState } from 'react';

interface TimelineDecorationsProps {
  className?: string;
  isVisible?: boolean;
  progress?: number; // 0 to 1
}

export const TimelineDecorations: React.FC<TimelineDecorationsProps> = ({
  className = '',
  isVisible = true,
  progress = 1,
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setAnimatedProgress(progress);
    }
  }, [isVisible, progress]);

  const timelinePoints = [
    { x: 20, y: 30 },
    { x: 20, y: 50 },
    { x: 20, y: 70 },
    { x: 20, y: 90 },
  ];

  return (
    <svg
      className={className}
      viewBox="0 0 100 120"
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
            @keyframes scaleIn {
              0% {
                transform: scale(0);
                opacity: 0;
              }
              70% {
                transform: scale(1.1);
              }
              100% {
                transform: scale(1);
                opacity: 1;
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
                transform: translateY(-2px);
              }
            }
            .scale-in {
              transform-origin: center;
              animation: scaleIn 0.5s ease-out forwards;
            }
            .sparkle {
              animation: sparkle 1.5s ease-in-out infinite;
            }
            .floating {
              animation: float 2s ease-in-out infinite;
            }
          `}
        </style>
      </defs>

      {/* Timeline Line */}
      <line
        x1="20"
        y1="30"
        x2="20"
        y2="90"
        stroke="#2563EB"
        strokeWidth="2"
        strokeDasharray="60"
        strokeDashoffset={60 * (1 - animatedProgress)}
        strokeLinecap="round"
      />

      {/* Timeline Points */}
      {timelinePoints.map((point, index) => {
        const pointProgress = animatedProgress * 4;
        const isVisible = index < pointProgress;
        const delay = index * 0.2;

        return (
          <g key={index}>
            {/* Point Circle */}
            <g
              className={isVisible ? 'scale-in' : ''}
              style={{
                animationDelay: `${delay}s`,
                opacity: isVisible ? 1 : 0,
              }}
              transform={`translate(${point.x}, ${point.y})`}
            >
              <circle r="6" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2" />
              <circle r="3" fill="#2563EB" />
            </g>

            {/* Decorative elements around point */}
            {isVisible && (
              <>
                {/* Heart */}
                <g
                  className="floating"
                  style={{ animationDelay: `${delay + 0.3}s` }}
                  transform={`translate(${point.x + 10}, ${point.y - 5})`}
                >
                  <path
                    d="M0,3 C-2,0 -4,-3 -2,-6 C0,-9 2,-6 0,-3 C-2,-6 0,-9 2,-6 C4,-3 2,0 0,3"
                    fill="#EF4444"
                    transform="scale(0.5)"
                  />
                </g>

                {/* Star */}
                <g
                  className="sparkle"
                  style={{ animationDelay: `${delay + 0.5}s` }}
                  transform={`translate(${point.x - 8}, ${point.y + 5})`}
                >
                  <polygon
                    points="0,-3 1,-1 3,-1 1,1 2,3 0,2 -2,3 -1,1 -3,-1 -1,-1"
                    fill="#FCD34D"
                    transform="scale(0.6)"
                  />
                </g>
              </>
            )}
          </g>
        );
      })}

      {/* Camera icon decoration */}
      <g
        className={animatedProgress > 0.5 ? 'scale-in' : ''}
        style={{
          animationDelay: '1s',
          opacity: animatedProgress > 0.5 ? 1 : 0,
        }}
        transform="translate(50, 30)"
      >
        <rect x="-8" y="-5" width="16" height="10" rx="2" fill="#60A5FA" />
        <circle cx="0" cy="0" r="3" fill="#EFF6FF" />
        <rect x="-3" y="-7" width="6" height="2" rx="1" fill="#2563EB" />
      </g>

      {/* Photo frame decoration */}
      <g
        className={animatedProgress > 0.75 ? 'scale-in' : ''}
        style={{
          animationDelay: '1.5s',
          opacity: animatedProgress > 0.75 ? 1 : 0,
        }}
        transform="translate(50, 60)"
      >
        <rect x="-10" y="-8" width="20" height="16" rx="2" fill="#EFF6FF" stroke="#2563EB" strokeWidth="1" />
        <rect x="-8" y="-6" width="16" height="12" fill="#93C5FD" opacity="0.5" />
        <circle cx="0" cy="0" r="2" fill="#FFFFFF" />
      </g>

      {/* Connecting decorative elements */}
      {animatedProgress > 0.25 && (
        <g
          className="sparkle"
          style={{ animationDelay: '0.8s' }}
          transform="translate(35, 40)"
          filter="url(#glow)"
        >
          <circle r="2" fill="#FCD34D" />
        </g>
      )}

      {animatedProgress > 0.5 && (
        <g
          className="sparkle"
          style={{ animationDelay: '1.2s' }}
          transform="translate(35, 60)"
          filter="url(#glow)"
        >
          <circle r="2" fill="#FCD34D" />
        </g>
      )}

      {animatedProgress > 0.75 && (
        <g
          className="sparkle"
          style={{ animationDelay: '1.6s' }}
          transform="translate(35, 80)"
          filter="url(#glow)"
        >
          <circle r="2" fill="#FCD34D" />
        </g>
      )}
    </svg>
  );
};
