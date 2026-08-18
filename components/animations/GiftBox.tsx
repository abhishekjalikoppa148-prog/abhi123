'use client';

import React, { useState } from 'react';

interface GiftBoxProps {
  className?: string;
  onOpen?: () => void;
}

export const GiftBox: React.FC<GiftBoxProps> = ({
  className = '',
  onOpen,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showLight, setShowLight] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsShaking(true);

    setTimeout(() => {
      setIsShaking(false);
      setIsOpen(true);
      setShowLight(true);
    }, 500);

    setTimeout(() => {
      setShowConfetti(true);
    }, 800);

    setTimeout(() => {
      setShowHeart(true);
      onOpen?.();
    }, 1200);
  };

  const reset = () => {
    setIsOpen(false);
    setIsShaking(false);
    setShowLight(false);
    setShowConfetti(false);
    setShowHeart(false);
  };

  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        style={{
          width: '100%',
          height: '100%',
          cursor: isOpen ? 'default' : 'pointer',
        }}
        onClick={handleOpen}
      >
        <defs>
          <linearGradient id="boxGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
          <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EFF6FF" />
            <stop offset="100%" stopColor="#93C5FD" />
          </linearGradient>
          <linearGradient id="lidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <style>
            {`
              @keyframes shake {
                0%, 100% {
                  transform: translateX(0) rotate(0);
                }
                25% {
                  transform: translateX(-3px) rotate(-2deg);
                }
                75% {
                  transform: translateX(3px) rotate(2deg);
                }
              }
              @keyframes lidOpen {
                0% {
                  transform: translateY(0) rotate(0);
                }
                100% {
                  transform: translateY(-15px) rotate(-20deg);
                }
              }
              @keyframes lightPulse {
                0%, 100% {
                  opacity: 0.3;
                  transform: scale(0.8);
                }
                50% {
                  opacity: 0.8;
                  transform: scale(1.2);
                }
              }
              @keyframes confettiFall {
                0% {
                  transform: translateY(-10px) rotate(0deg);
                  opacity: 1;
                }
                100% {
                  transform: translateY(50px) rotate(360deg);
                  opacity: 0;
                }
              }
              @keyframes heartFloat {
                0% {
                  transform: translateY(0) scale(0);
                  opacity: 0;
                }
                50% {
                  transform: translateY(-10px) scale(1.2);
                  opacity: 1;
                }
                100% {
                  transform: translateY(-20px) scale(1);
                  opacity: 0.8;
                }
              }
              .shaking {
                animation: shake 0.1s ease-in-out 5;
                transform-origin: center 60px;
              }
              .lid-opening {
                transform-origin: center 45px;
                animation: lidOpen 0.5s ease-out forwards;
              }
              .light {
                animation: lightPulse 1s ease-in-out infinite;
                transform-origin: center 50px;
              }
              .confetti {
                animation: confettiFall 1.5s ease-out forwards;
              }
              .heart {
                animation: heartFloat 2s ease-out forwards;
              }
            `}
          </style>
        </defs>

        <g className={isShaking ? 'shaking' : ''}>
          {/* Box Body */}
          <rect
            x="25"
            y="50"
            width="50"
            height="35"
            rx="3"
            fill="url(#boxGradient)"
            stroke="#1E3A8A"
            strokeWidth="1"
          />

          {/* Vertical Ribbon */}
          <rect
            x="47"
            y="50"
            width="6"
            height="35"
            fill="url(#ribbonGradient)"
          />

          {/* Box Lid */}
          <g className={isOpen ? 'lid-opening' : ''}>
            <rect
              x="22"
              y="45"
              width="56"
              height="12"
              rx="2"
              fill="url(#lidGradient)"
              stroke="#1E3A8A"
              strokeWidth="1"
            />
            {/* Horizontal Ribbon on Lid */}
            <rect
              x="22"
              y="49"
              width="56"
              height="4"
              fill="url(#ribbonGradient)"
            />
            {/* Bow */}
            <ellipse
              cx="50"
              cy="45"
              rx="8"
              ry="4"
              fill="url(#ribbonGradient)"
              stroke="#93C5FD"
              strokeWidth="0.5"
            />
          </g>

          {/* Light from inside */}
          {showLight && (
            <g className="light" filter="url(#glow)">
              <ellipse
                cx="50"
                cy="55"
                rx="20"
                ry="10"
                fill="#FCD34D"
                opacity="0.5"
              />
            </g>
          )}

          {/* Confetti */}
          {showConfetti && (
            <>
              <g className="confetti" style={{ animationDelay: '0s' }}>
                <circle cx="40" cy="45" r="2" fill="#FCD34D" />
              </g>
              <g className="confetti" style={{ animationDelay: '0.1s' }}>
                <rect x="55" y="45" width="4" height="4" fill="#60A5FA" />
              </g>
              <g className="confetti" style={{ animationDelay: '0.2s' }}>
                <circle cx="45" cy="48" r="1.5" fill="#93C5FD" />
              </g>
              <g className="confetti" style={{ animationDelay: '0.3s' }}>
                <polygon points="60,45 62,48 65,45 62,42" fill="#FCD34D" />
              </g>
              <g className="confetti" style={{ animationDelay: '0.4s' }}>
                <circle cx="50" cy="47" r="2" fill="#FFFFFF" />
              </g>
              <g className="confetti" style={{ animationDelay: '0.5s' }}>
                <rect x="35" y="46" width="3" height="3" fill="#2563EB" />
              </g>
            </>
          )}

          {/* Heart */}
          {showHeart && (
            <g className="heart" transform="translate(50, 35)">
              <path
                d="M0,5 C-5,0 -10,-5 -5,-10 C0,-15 5,-10 0,-5 C-5,-10 0,-15 5,-10 C10,-5 5,0 0,5"
                fill="#EF4444"
                stroke="#DC2626"
                strokeWidth="0.5"
              />
            </g>
          )}
        </g>

        {/* Instruction text */}
        {!isOpen && !isShaking && (
          <text
            x="50"
            y="95"
            textAnchor="middle"
            fontSize="8"
            fill="#2563EB"
            opacity="0.7"
          >
            Click to open
          </text>
        )}
      </svg>

      {/* Reset button */}
      {isOpen && (
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
