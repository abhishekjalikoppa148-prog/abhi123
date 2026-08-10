'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music, Play, Pause } from 'lucide-react';
import { MusicTrack } from '@/lib/types';

interface AudioPlayerProps {
  track: MusicTrack;
  autoPlay?: boolean;
}

export default function AudioPlayer({ track }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Play synth melody fallback if audio element blocks
          setIsPlaying(true);
        });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <audio
        ref={audioRef}
        src={track.audioUrl}
        loop
        preload="auto"
        onEnded={() => setIsPlaying(false)}
      />

      <div className="flex items-center gap-2 p-2 px-3 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-2xl text-slate-200 text-xs">
        
        {/* Track Info Badge */}
        <div className="flex items-center gap-2 pr-2 border-r border-slate-700 max-w-[130px] sm:max-w-[180px]">
          <div className={`w-7 h-7 rounded-full bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`}>
            <Music className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex flex-col truncate">
            <span className="font-semibold text-white truncate">{track.title}</span>
            <span className="text-[10px] text-slate-400 truncate">{track.artist}</span>
          </div>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="p-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white transition-transform hover:scale-105"
          title={isPlaying ? 'Pause Music' : 'Play Music'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
        </button>

        {/* Mute Button */}
        <button
          onClick={toggleMute}
          className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Volume Slider */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-14 sm:w-16 accent-rose-500 h-1 bg-slate-700 rounded-lg cursor-pointer hidden sm:block"
        />
      </div>
    </div>
  );
}
