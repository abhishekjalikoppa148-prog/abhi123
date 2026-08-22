'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="relative p-2.5 rounded-xl transition-all duration-300"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-soft)',
        }}
        aria-label="Theme switcher loading"
      >
        <div className="relative w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-soft)',
      }}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {theme === 'light' ? (
          <Moon className="w-5 h-5 transition-all duration-300" style={{ color: 'var(--text-heading)' }} />
        ) : (
          <Sun className="w-5 h-5 transition-all duration-300" style={{ color: 'var(--text-heading)' }} />
        )}
      </div>
      <div 
        className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          background: theme === 'light' 
            ? 'radial-gradient(circle, rgba(217, 140, 154, 0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(217, 140, 154, 0.15) 0%, transparent 70%)'
        }}
      />
    </button>
  );
}
