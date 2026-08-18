'use client';

import React, { useState, useEffect } from 'react';

interface PublishSuccessProps {
  className?: string;
  onComplete?: () => void;
  autoPlay?: boolean;
}

export const PublishSuccess: React.FC<PublishSuccessProps> = ({
  className = '',
  onComplete,
  autoPlay = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [showCircle, setShowCircle] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    // Animation sequence
    const circleTimer = setTimeout(() => setShowCircle(true), 100);
    const checkmarkTimer = setTimeout(() => setShowCheckmark(true), 600);
    const particlesTimer = setTimeout(() => setShowParticles(true), 1000);
    const confettiTimer = setTimeout(() => setShowConfetti(true), 1200);
    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, 2000);

    return () => {
      clearTimeout(circleTimer);
      clearTimeout(checkmarkTimer);
      clearTimeout(particlesTimer);
      clearTimeout(confettiTimer);
      clearTimeout(completeTimer);
    };
  }, [isPlaying, onComplete]);

  const replay = () => {
    setShowCircle(false);
    setShowCheckmark(false);
    setShowParticles(false);
    setShowConfetti(false);
    setIsPlaying(true);
  };

  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <style>
            {`
              @keyframes circleDraw {
              0% {
                stroke-dashoffset: 251;
                opacity: 0;
              }
              10% {
                opacity: 1;
              }
              100% {
                stroke-dashoffset: 0;
                opacity: 1;
              }
            }
            @keyframes checkmarkDraw {
              0% {
                stroke-dashoffset: 60;
                opacity: 0;
              }
              10% {
                opacity: 1;
              }
              100% {
                stroke-dashoffset: 0;
                opacity: 1;
              }
            }
            @keyframes particleBurst {
              0% {
                transform: translate(50px, 50px) scale(0);
                opacity: 1;
              }
              100% {
                transform: translate(var(--tx), var(--ty)) scale(1);
                opacity: 0;
              }
            }
            @keyframes confettiFall {
              0% {
                transform: translateY(-10px) rotate(0deg);
                opacity: 1;
              }
              100% {
                transform: translateY(110px) rotate(360deg);
                opacity: 0;
              }
            }
            @keyframes pulse {
              0%, 100% {
                transform: scale(1);
                opacity: 0.8;
              }
              50% {
                transform: scale(1.1);
                opacity: 1;
              }
            }
            .circle-draw {
              stroke-dasharray: 251;
              stroke-dashoffset: 251;
              animation: circleDraw 0.5s ease-out forwards;
            }
            .checkmark-draw {
              stroke-dasharray: 60;
              stroke-dashoffset: 60;
              animation: checkmarkDraw 0.4s ease-out forwards;
            }
            .particle {
              animation: particleBurst 0.8s ease-out forwards;
            }
            .confetti {
              animation: confettiFall 2s ease-out forwards;
            }
            .pulse {
              transform-origin: center;
              animation: pulse 2s ease-in-out infinite;
            }
          `}
          </style>
        </defs>

        {/* Success Circle */}
        {showCircle && (
          <circle
            className="circle-draw pulse"
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#2563EB"
            strokeWidth="3"
            filter="url(#glow)"
          />
        )}

        {/* Checkmark */}
        {showCheckmark && (
          <g className="checkmark-draw" filter="url(#glow)">
            <path
              d="M30 50 L45 65 L70 35"
              fill="none"
              stroke="#10B981"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}

        {/* Celebration Particles */}
        {showParticles && (
          <>
            <g
              className="particle"
              style={{ '--tx': '20px', '--ty': '20px' } as React.CSSProperties}
            >
              <circle r="3" fill="#FCD34D" />
            </g>
            <g
              className="particle"
              style={{ '--tx': '80px', '--ty': '20px' } as React.CSSProperties}
            >
              <circle r="3" fill="#FCD34D" />
            </g>
            <g
              className="particle"
              style={{ '--tx': '20px', '--ty': '80px' } as React.CSSProperties}
            >
              <circle r="3" fill="#FCD34D" />
            </g>
            <g
              className="particle"
              style={{ '--tx': '80px', '--ty': '80px' } as React.CSSProperties}
            >
              <circle r="3" fill="#FCD34D" />
            </g>
            <g
              className="particle"
              style={{ '--tx': '50px', '--ty': '10px' } as React.CSSProperties}
            >
              <polygon
                points="0,-3 1,-1 3,-1 1,1 2,3 0,2 -2,3 -1,1 -3,-1 -1,-1"
                fill="#FCD34D"
              />
            </g>
            <g
              className="particle"
              style={{ '--tx': '50px', '--ty': '90px' } as React.CSSProperties}
            >
              <polygon
                points="0,-3 1,-1 3,-1 1,1 2,3 0,2 -2,3 -1,1 -3,-1 -1,-1"
                fill="#FCD34D"
              />
            </g>
          </>
        )}

        {/* Confetti */}
        {showConfetti && (
          <>
            <g className="confetti" style={{ animationDelay: '0s' }} transform="translate(30, 0)">
              <circle r="2" fill="#2563EB" />
            </g>
            <g className="confetti" style={{ animationDelay: '0.1s' }} transform="translate(50, 0)">
              <rect width="4" height="4" fill="#60A5FA" transform="rotate(45)" />
            </g>
            <g className="confetti" style={{ animationDelay: '0.2s' }} transform="translate(70, 0)">
              <circle r="2" fill="#93C5FD" />
            </g>
            <g className="confetti" style={{ animationDelay: '0.3s' }} transform="translate(40, 0)">
              <rect width="3" height="3" fill="#EFF6FF" transform="rotate(30)" />
            </g>
            <g className="confetti" style={{ animationDelay: '0.4s' }} transform="translate(60, 0)">
              <circle r="2" fill="#FCD34D" />
            </g>
          </>
        )}
      </svg>

      {/* Replay button */}
      {showConfetti && (
        <button
          onClick={replay}
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '4px 12px',
            fontSize: '10px',
            backgroundColor: '#2563EB',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Replay
        </button>
      )}
    </div>
  );
};
