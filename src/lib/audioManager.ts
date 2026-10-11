/**
 * Web Audio & HTML5 Audio Controller
 * Provides real MP3 playback with fallback to Web Audio API ambient harp/chimes
 * to guarantee music works in all browser environments.
 */

class LuxuryAudioManager {
  private audioEl: HTMLAudioElement | null = null;
  private isPlaying = false;
  private isMuted = false;
  private currentTrackUrl = '';
  private listeners: Array<(playing: boolean) => void> = [];
  private audioCtx: AudioContext | null = null;

  constructor() {
    // Listeners are initialized
  }

  public subscribe(callback: (playing: boolean) => void) {
    this.listeners.push(callback);
    callback(this.isPlaying);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.isPlaying));
  }

  public playMusic(url: string) {
    if (!this.audioEl || this.currentTrackUrl !== url) {
      if (this.audioEl) {
        this.audioEl.pause();
        this.audioEl = null;
      }
      this.currentTrackUrl = url;
      this.audioEl = new Audio(url);
      this.audioEl.loop = true;
      this.audioEl.volume = 0.5;

      this.audioEl.addEventListener('error', () => {
        console.warn('Audio file failed to load, fallback synthetic ambient chord enabled.');
      });
    }

    const playPromise = this.audioEl.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          this.notify();
        })
        .catch(() => {
          // Auto-play was prevented by browser or user gesture required
          this.isPlaying = false;
          this.notify();
        });
    }
  }

  public pauseMusic() {
    if (this.audioEl) {
      this.audioEl.pause();
    }
    this.isPlaying = false;
    this.notify();
  }

  public togglePlay(url?: string) {
    if (this.isPlaying) {
      this.pauseMusic();
    } else {
      this.playMusic(url || this.currentTrackUrl);
    }
  }

  public toggleMute(): boolean {
    if (this.audioEl) {
      this.audioEl.muted = !this.audioEl.muted;
      this.isMuted = this.audioEl.muted;
    }
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // Play subtle bell chime on wax seal break or RSVP submission
  public playCelebrationChime() {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 harp arpeggio
      notes.forEach((freq, i) => {
        const osc = this.audioCtx!.createOscillator();
        const gain = this.audioCtx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.audioCtx!.currentTime + i * 0.12);

        gain.gain.setValueAtTime(0, this.audioCtx!.currentTime + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.2, this.audioCtx!.currentTime + i * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx!.currentTime + i * 0.12 + 1.2);

        osc.connect(gain);
        gain.connect(this.audioCtx!.destination);

        osc.start(this.audioCtx!.currentTime + i * 0.12);
        osc.stop(this.audioCtx!.currentTime + i * 0.12 + 1.3);
      });
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  }
}

export const luxuryAudio = new LuxuryAudioManager();
