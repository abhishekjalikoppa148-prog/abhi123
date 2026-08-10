'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, SkipBack, SkipForward, Music } from 'lucide-react';

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
}

interface PremiumMusicPlayerProps {
  tracks: MusicTrack[];
  autoPlay?: boolean;
}

export default function PremiumMusicPlayer({ tracks, autoPlay = false }: PremiumMusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      const handleTimeUpdate = () => {
        if (audioRef.current) {
          const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setProgress(progress);
        }
      };

      const handleEnded = () => {
        handleNextTrack();
      };

      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('ended', handleEnded);

      return () => {
        audioRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current?.removeEventListener('ended', handleEnded);
      };
    }
  }, [currentTrackIndex]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePreviousTrack = () => {
    setCurrentTrackIndex((prev) => (prev > 0 ? prev - 1 : tracks.length - 1));
    setIsPlaying(false);
    setProgress(0);
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev < tracks.length - 1 ? prev + 1 : 0));
    setIsPlaying(false);
    setProgress(0);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = (parseFloat(e.target.value) / 100) * (audioRef.current?.duration || 0);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  // Visualizer bars (simulated)
  const visualizerBars = Array.from({ length: 20 }, (_, i) => ({
    height: isPlaying ? Math.random() * 100 : 10,
    delay: i * 0.05
  }));

  return (
    <div className="space-y-4">
      
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack?.audioUrl}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Visualizer */}
      <div className="h-16 flex items-center justify-center gap-1 rounded-2xl bg-slate-900/50 overflow-hidden">
        {visualizerBars.map((bar, i) => (
          <div
            key={i}
            className="w-1 bg-gradient-to-t from-rose-500 to-purple-600 rounded-full transition-all duration-300"
            style={{
              height: `${isPlaying ? bar.height : 10}%`,
              animationDelay: `${bar.delay}s`,
              animation: isPlaying ? 'pulse 0.5s ease-in-out infinite' : 'none'
            }}
          />
        ))}
      </div>

      {/* Track Info */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <Music className="w-4 h-4 text-rose-400" />
          <p className="text-white font-semibold">{currentTrack?.title}</p>
        </div>
        <p className="text-xs text-slate-400">{currentTrack?.artist}</p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="w-full h-1 bg-slate-700 rounded-full appearance-none cursor-pointer accent-rose-500"
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}</span>
          <span>{audioRef.current ? formatTime(audioRef.current.duration) : '0:00'}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handlePreviousTrack}
          className="p-3 rounded-full glass-luxury hover:bg-white/10 text-white transition-colors"
        >
          <SkipBack className="w-5 h-5" />
        </button>
        
        <button
          onClick={togglePlay}
          className="p-4 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white transition-all hover:scale-105 shadow-2xl shadow-rose-500/30"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>
        
        <button
          onClick={handleNextTrack}
          className="p-3 rounded-full glass-luxury hover:bg-white/10 text-white transition-colors"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMute}
          className="p-2 rounded-lg glass-luxury hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <Volume2 className="w-4 h-4" />
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="flex-1 h-1 bg-slate-700 rounded-full appearance-none cursor-pointer accent-purple-500"
        />
      </div>

    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
