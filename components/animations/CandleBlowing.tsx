'use client';

import React, { useState, useRef } from 'react';

interface CandleBlowingProps {
  className?: string;
  onBlowComplete?: () => void;
}

export const CandleBlowing: React.FC<CandleBlowingProps> = ({
  className = '',
  onBlowComplete,
}) => {
  const [isBlowing, setIsBlowing] = useState(false);
  const [isBlownOut, setIsBlownOut] = useState(false);
  const [showSmoke, setShowSmoke] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  const handleBlow = () => {
    if (isBlownOut) return;
    setIsBlowing(true);

    // Sequence of animations
    setTimeout(() => {
      setShowSmoke(true);
    }, 500);

    setTimeout(() => {
      setIsBlownOut(true);
      setIsBlowing(false);
    }, 800);

    setTimeout(() => {
      setShowSparkles(true);
      onBlowComplete?.();
    }, 1200);
  };

  const reset = () => {
    setIsBlowing(false);
    setIsBlownOut(false);
    setShowSmoke(false);
    setShowSparkles(false);
  };

  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        style={{
          width: '100%',
          height: '100%',
          cursor: isBlownOut ? 'default' : 'pointer',
        }}
        onClick={handleBlow}
      >
        <defs>
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
              @keyframes flameBlow {
                0% {
                  transform: scaleY(1) scaleX(1) translateX(0);
                  opacity: 1;
                }
                30% {
                  transform: scaleY(0.8) scaleX(1.2) translateX(5px);
                  opacity: 0.8;
                }
                60% {
                  transform: scaleY(0.4) scaleX(1.5) translateX(10px);
                  opacity: 0.4;
                }
                100% {
                  transform: scaleY(0) scaleX(2) translateX(15px);
                  opacity: 0;
                }
              }
              @keyframes smokeRise {
                0% {
                  transform: translateY(0) scale(1);
                  opacity: 0.6;
                }
                100% {
                  transform: translateY(-20px) scale(2);
                  opacity: 0;
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
              .flame-normal {
                transform-origin: center bottom;
                animation: flameFlicker 0.3s ease-in-out infinite;
              }
              .flame-blowing {
                transform-origin: center bottom;
                animation: flameBlow 0.8s ease-out forwards;
              }
              .smoke {
                animation: smokeRise 1.5s ease-out forwards;
              }
              .sparkle {
                animation: sparkle 1.5s ease-in-out infinite;
              }
            `}
          </style>
        </defs>

        {/* Candle Body */}
        <g transform="translate(50, 70)">
          <rect
            x="-8"
            y="-25"
            width="16"
            height="25"
            rx="2"
            fill="url(#candleGradient)"
            stroke="#1E3A8A"
            strokeWidth="1"
          />
          
          {/* Wick */}
          <line
            x1="0"
            y1="-25"
            x2="0"
            y2="-28"
            stroke="#1E3A8A"
            strokeWidth="1.5"
          />

          {/* Flame */}
          {!isBlownOut && (
            <g filter="url(#glow)">
              <g className={isBlowing ? 'flame-blowing' : 'flame-normal'}>
                <ellipse
                  cx="0"
                  cy="-35"
                  rx="5"
                  ry="8"
                  fill="#FCD34D"
                />
                <ellipse
                  cx="0"
                  cy="-37"
                  rx="3"
                  ry="5"
                  fill="#F59E0B"
                />
                <ellipse
                  cx="0"
                  cy="-33"
                  rx="2"
                  ry="3"
                  fill="#FEF3C7"
                />
              </g>
            </g>
          )}

          {/* Smoke */}
          {showSmoke && (
            <g className="smoke">
              <ellipse
                cx="0"
                cy="-30"
                rx="4"
                ry="6"
                fill="#9CA3AF"
                opacity="0.4"
              />
              <ellipse
                cx="2"
                cy="-35"
                rx="3"
                ry="5"
                fill="#9CA3AF"
                opacity="0.3"
              />
            </g>
          )}
        </g>

        {/* Sparkles after blow */}
        {showSparkles && (
          <>
            <g className="sparkle" style={{ animationDelay: '0s' }}>
              <circle cx="40" cy="30" r="2" fill="#FCD34D" />
            </g>
            <g className="sparkle" style={{ animationDelay: '0.2s' }}>
              <circle cx="60" cy="25" r="1.5" fill="#FCD34D" />
            </g>
            <g className="sparkle" style={{ animationDelay: '0.4s' }}>
              <circle cx="50" cy="20" r="2" fill="#FCD34D" />
            </g>
            <g className="sparkle" style={{ animationDelay: '0.6s' }}>
              <circle cx="35" cy="35" r="1.5" fill="#FCD34D" />
            </g>
            <g className="sparkle" style={{ animationDelay: '0.8s' }}>
              <circle cx="65" cy="30" r="2" fill="#FCD34D" />
            </g>
          </>
        )}

        {/* Instruction text */}
        {!isBlownOut && !isBlowing && (
          <text
            x="50"
            y="95"
            textAnchor="middle"
            fontSize="8"
            fill="#2563EB"
            opacity="0.7"
          >
            Click to blow
          </text>
        )}
      </svg>

      {/* Reset button */}
      {isBlownOut && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            reset();
          }}
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
          Reset
        </button>
      )}
    </div>
  );
};
