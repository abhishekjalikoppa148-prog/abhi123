// Web Audio API celebratory melody synthesizer for background music and confetti chimes

class AudioCelebrationPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timer: any = null;
  private noteIndex: number = 0;
  private volume: number = 0.25;

  private notes = [
    { freq: 261.63, dur: 0.35, pause: 0.1 }, // C4
    { freq: 261.63, dur: 0.35, pause: 0.1 }, // C4
    { freq: 293.66, dur: 0.6, pause: 0.15 }, // D4
    { freq: 261.63, dur: 0.6, pause: 0.15 }, // C4
    { freq: 349.23, dur: 0.6, pause: 0.15 }, // F4
    { freq: 329.63, dur: 1.0, pause: 0.3 },  // E4

    { freq: 261.63, dur: 0.35, pause: 0.1 }, // C4
    { freq: 261.63, dur: 0.35, pause: 0.1 }, // C4
    { freq: 293.66, dur: 0.6, pause: 0.15 }, // D4
    { freq: 261.63, dur: 0.6, pause: 0.15 }, // C4
    { freq: 392.00, dur: 0.6, pause: 0.15 }, // G4
    { freq: 349.23, dur: 1.0, pause: 0.3 },  // F4

    { freq: 261.63, dur: 0.35, pause: 0.1 }, // C4
    { freq: 261.63, dur: 0.35, pause: 0.1 }, // C4
    { freq: 523.25, dur: 0.6, pause: 0.15 }, // C5
    { freq: 440.00, dur: 0.6, pause: 0.15 }, // A4
    { freq: 349.23, dur: 0.6, pause: 0.15 }, // F4
    { freq: 329.63, dur: 0.6, pause: 0.15 }, // E4
    { freq: 293.66, dur: 0.9, pause: 0.3 },  // D4

    { freq: 466.16, dur: 0.35, pause: 0.1 }, // Bb4
    { freq: 466.16, dur: 0.35, pause: 0.1 }, // Bb4
    { freq: 440.00, dur: 0.6, pause: 0.15 }, // A4
    { freq: 349.23, dur: 0.6, pause: 0.15 }, // F4
    { freq: 392.00, dur: 0.6, pause: 0.15 }, // G4
    { freq: 349.23, dur: 1.2, pause: 0.8 },  // F4
  ];

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playChime() {
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
    osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.35); // D6

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.65);
  }

  public playPop() {
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.08);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  private playNextMelodyNote() {
    if (!this.isPlaying) return;
    this.initCtx();
    if (!this.ctx) return;

    const note = this.notes[this.noteIndex];
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Warm rhodes-like timbre
    osc.type = 'sine';
    osc.frequency.setValueAtTime(note.freq, now);

    // Subtle harmonic warmth
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(note.freq * 2, now);
    const gain2 = this.ctx.createGain();
    gain2.gain.setValueAtTime(this.volume * 0.15, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + note.dur);

    gain.gain.setValueAtTime(this.volume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + note.dur);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + note.dur);
    osc2.stop(now + note.dur);

    this.noteIndex = (this.noteIndex + 1) % this.notes.length;
    const nextInterval = (note.dur + note.pause) * 1000;

    this.timer = setTimeout(() => {
      this.playNextMelodyNote();
    }, nextInterval);
  }

  public toggleMusic(callback?: (playing: boolean) => void) {
    if (this.isPlaying) {
      this.pause();
      if (callback) callback(false);
      return false;
    } else {
      this.play();
      if (callback) callback(true);
      return true;
    }
  }

  public play() {
    this.initCtx();
    this.isPlaying = true;
    this.playNextMelodyNote();
  }

  public pause() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
  }

  public isCurrentlyPlaying() {
    return this.isPlaying;
  }
}

export const celebrationAudio = new AudioCelebrationPlayer();
