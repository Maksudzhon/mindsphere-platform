/**
 * Audio synthesis for subtle tactile UI micro-interactions
 * Powered strictly by the native Web Audio API (zero extra bundle size)
 */

class SoundSystem {
  private ctx: AudioContext | null = null;
  private enabled: boolean = false;

  constructor() {
    // Check localStorage for user preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mindsphere_sound_enabled');
      this.enabled = saved === 'true';
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('mindsphere_sound_enabled', String(this.enabled));
    }
    return this.enabled;
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playClick(freq = 240, duration = 0.02) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + duration);

      // Very subtle, quiet tactile micro-click (not musical)
      gain.gain.setValueAtTime(0.012, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio not permitted or context closed
    }
  }

  /**
   * Hover sounds completely removed - kept as no-op for backward compatibility
   */
  public playHover() {
    // Disabled: Childish hover sound effects removed per user request
  }

  /**
   * Musical chimes completely removed - kept as no-op
   */
  public playChime() {
    // Disabled: Childish musical chime arpeggios removed per user request
  }
}

export const soundFx = new SoundSystem();
