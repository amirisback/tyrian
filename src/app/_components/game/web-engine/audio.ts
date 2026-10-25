/**
 * Web Audio API Retro Sound & FM Synthesizer
 * Emulates vintage OPL2/Sound Blaster 16 FM synthesis and chiptune sound effects.
 */
export class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private noiseBuffer: AudioBuffer | null = null;
  private bgmOscs: OscillatorNode[] = [];
  private bgmGains: GainNode[] = [];
  private bgmInterval: ReturnType<typeof setInterval> | null = null;
  private bgmPlaying: boolean = false;

  constructor() {
    // Initialized lazily upon user interaction to satisfy browser autoplay policy
  }

  private initContext(): boolean {
    if (this.ctx) {
      if (this.ctx.state === "suspended") {
        void this.ctx.resume();
      }
      return true;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return false;

      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Pre-generate 1-second white noise buffer for explosions
      const bufferSize = this.ctx.sampleRate;
      this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      return true;
    } catch {
      return false;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.35, this.ctx.currentTime);
    }
    if (muted) {
      this.stopBgm();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playLaser(weaponType: "pulse" | "vulcan" | "plasma" | "sonic" = "pulse") {
    if (this.isMuted || !this.initContext() || !this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (weaponType === "pulse") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.exponentialRampToValueAtTime(110, t + 0.08);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.linearRampToValueAtTime(0.01, t + 0.08);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.09);
    } else if (weaponType === "vulcan") {
      osc.type = "square";
      osc.frequency.setValueAtTime(640, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.05);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.linearRampToValueAtTime(0.01, t + 0.05);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.06);
    } else if (weaponType === "plasma") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(60, t + 0.14);
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.linearRampToValueAtTime(0.01, t + 0.14);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.15);
    } else {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(1200, t);
      osc.frequency.exponentialRampToValueAtTime(220, t + 0.12);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.linearRampToValueAtTime(0.01, t + 0.12);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.13);
    }
  }

  public playEnemyLaser() {
    if (this.isMuted || !this.initContext() || !this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(420, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.07);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.07);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  public playExplosion(intensity: "small" | "medium" | "boss" = "medium") {
    if (this.isMuted || !this.initContext() || !this.ctx || !this.masterGain || !this.noiseBuffer) return;

    const t = this.ctx.currentTime;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";

    const gain = this.ctx.createGain();

    let duration = 0.25;
    if (intensity === "small") {
      filter.frequency.setValueAtTime(800, t);
      filter.frequency.exponentialRampToValueAtTime(80, t + 0.15);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.linearRampToValueAtTime(0.01, t + 0.18);
      duration = 0.2;
    } else if (intensity === "medium") {
      filter.frequency.setValueAtTime(600, t);
      filter.frequency.exponentialRampToValueAtTime(50, t + 0.35);
      gain.gain.setValueAtTime(0.5, t);
      gain.gain.linearRampToValueAtTime(0.01, t + 0.38);
      duration = 0.4;
    } else {
      filter.frequency.setValueAtTime(1000, t);
      filter.frequency.exponentialRampToValueAtTime(30, t + 0.9);
      gain.gain.setValueAtTime(0.8, t);
      gain.gain.linearRampToValueAtTime(0.01, t + 0.95);
      duration = 1.0;
    }

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
    noise.stop(t + duration);
  }

  public playShieldHit() {
    if (this.isMuted || !this.initContext() || !this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.08);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.09);
  }

  public playPowerup() {
    if (this.isMuted || !this.initContext() || !this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = t + idx * 0.045;

      osc.type = "square";
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.18, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.09);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(noteTime);
      osc.stop(noteTime + 0.1);
    });
  }

  public playSuperbomb() {
    if (this.isMuted || !this.initContext() || !this.ctx || !this.masterGain || !this.noiseBuffer) return;

    const t = this.ctx.currentTime;

    // Sub-bass sine sweep
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = "sine";
    sub.frequency.setValueAtTime(240, t);
    sub.frequency.exponentialRampToValueAtTime(20, t + 0.8);
    subGain.gain.setValueAtTime(0.8, t);
    subGain.gain.linearRampToValueAtTime(0.01, t + 0.85);
    sub.connect(subGain);
    subGain.connect(this.masterGain);
    sub.start(t);
    sub.stop(t + 0.9);

    // Filtered noise shockwave
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1400, t);
    filter.frequency.exponentialRampToValueAtTime(60, t + 0.8);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.7, t);
    noiseGain.gain.linearRampToValueAtTime(0.01, t + 0.8);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start(t);
    noise.stop(t + 0.85);
  }

  public playBossWarning() {
    if (this.isMuted || !this.initContext() || !this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startT = t + i * 0.22;

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(350, startT);
      osc.frequency.exponentialRampToValueAtTime(620, startT + 0.15);

      gain.gain.setValueAtTime(0.3, startT);
      gain.gain.linearRampToValueAtTime(0.01, startT + 0.18);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(startT);
      osc.stop(startT + 0.2);
    }
  }

  /**
   * Procedural Tyrian Arcade Chiptune Soundtrack Loop
   * Recreates the epic driving synth-bassline and arpeggios of Tyrian Episode 1
   */
  public startBgm() {
    if (this.isMuted || this.bgmPlaying || !this.initContext() || !this.ctx || !this.masterGain) return;
    this.bgmPlaying = true;

    // Bassline and arpeggio scale notes in Hz (D Minor key)
    const bassline = [146.83, 146.83, 174.61, 196.0, 130.81, 130.81, 164.81, 174.61]; // D3, D3, F3, G3, C3, C3, E3, F3
    const leadNotes = [293.66, 349.23, 440.0, 523.25, 440.0, 392.0, 349.23, 329.63]; // D4, F4, A4, C5, A4, G4, F4, E4

    let step = 0;
    const tempoMs = 150; // 100 BPM 16th notes

    this.bgmInterval = setInterval(() => {
      if (!this.ctx || !this.masterGain || this.isMuted) return;

      const t = this.ctx.currentTime;

      // Bass synth
      const bassFreq = bassline[step % bassline.length];
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = "sawtooth";
      bassOsc.frequency.setValueAtTime(bassFreq, t);
      bassGain.gain.setValueAtTime(0.08, t);
      bassGain.gain.exponentialRampToValueAtTime(0.005, t + 0.12);

      const bassFilter = this.ctx.createBiquadFilter();
      bassFilter.type = "lowpass";
      bassFilter.frequency.setValueAtTime(450, t);

      bassOsc.connect(bassFilter);
      bassFilter.connect(bassGain);
      bassGain.connect(this.masterGain);
      bassOsc.start(t);
      bassOsc.stop(t + 0.13);

      // Lead arpeggio on alternate beats
      if (step % 2 === 0) {
        const leadFreq = leadNotes[(step / 2) % leadNotes.length];
        const leadOsc = this.ctx.createOscillator();
        const leadGain = this.ctx.createGain();
        leadOsc.type = "square";
        leadOsc.frequency.setValueAtTime(leadFreq, t);
        leadGain.gain.setValueAtTime(0.05, t);
        leadGain.gain.exponentialRampToValueAtTime(0.002, t + 0.18);

        leadOsc.connect(leadGain);
        leadGain.connect(this.masterGain);
        leadOsc.start(t);
        leadOsc.stop(t + 0.2);
      }

      step++;
    }, tempoMs);
  }

  public stopBgm() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    this.bgmOscs.forEach((osc) => {
      try { osc.stop(); } catch {}
    });
    this.bgmOscs = [];
    this.bgmGains = [];
    this.bgmPlaying = false;
  }
}
