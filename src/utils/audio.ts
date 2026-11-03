/**
 * Procedural Web Audio Engine for HEAVENLY-RUN
 * Zero external audio file dependencies.
 * Generates thematic ambient soundscapes, 3D can interaction sounds (metallic chime & fizz),
 * and guitar synthesizers.
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private currentAmbientNode: { stop: () => void } | null = null;
  private currentAmbientPage: string | null = null;
  private isPlayingRiff = false;
  private riffTimeouts: number[] = [];
  private isMuted = false;
  private userVolume = 0.5;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.userVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.userVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.userVolume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.userVolume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.userVolume, this.ctx.currentTime, 0.05);
    }
    if (this.isMuted) {
      this.stopRiff();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * CANS INTERACTION AUDIO: Gentle Metallic Aluminium Resonance
   */
  public playCanMetallicChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1480, now);
    osc1.frequency.exponentialRampToValueAtTime(1120, now + 0.35);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(2240, now);
    osc2.frequency.exponentialRampToValueAtTime(1680, now + 0.25);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.45);
    osc2.stop(now + 0.45);
  }

  /**
   * CANS INTERACTION AUDIO: Carbonated Soda/Energy Beverage Fizz Burst
   */
  public playCanFizz() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 0.3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(4200, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start();
  }

  /**
   * THEMATIC PAGE SOUNDSCAPES
   * Never autoplay - only triggered when user engages sound
   */
  public startThematicAmbient(page: 'home' | 'flavours' | 'mystery' | 'faq') {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.ambientGain) return;

    if (this.currentAmbientPage === page && this.currentAmbientNode) {
      return;
    }

    this.stopThematicAmbient();
    this.currentAmbientPage = page;
    const now = this.ctx.currentTime;

    if (page === 'home') {
      // Cosmic Space Drone
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, now); // Deep A1
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(110.5, now); // Shimmering overtone

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 1.5);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain);

      osc1.start(now);
      osc2.start(now);

      this.currentAmbientNode = {
        stop: () => {
          if (!this.ctx) return;
          gain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
          setTimeout(() => {
            try {
              osc1.stop();
              osc2.stop();
            } catch {}
          }, 600);
        },
      };
    } else if (page === 'flavours') {
      // Celestial Effervescent Aura
      const osc = this.ctx.createOscillator();
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);

      lfo.frequency.setValueAtTime(0.8, now); // Gentle pulsation
      lfoGain.gain.setValueAtTime(15, now);
      lfo.connect(osc.frequency);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 1.0);

      osc.connect(gain);
      gain.connect(this.ambientGain);

      osc.start(now);
      lfo.start(now);

      this.currentAmbientNode = {
        stop: () => {
          if (!this.ctx) return;
          gain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
          setTimeout(() => {
            try {
              osc.stop();
              lfo.stop();
            } catch {}
          }, 600);
        },
      };
    } else if (page === 'mystery') {
      // Atmospheric suspenseful dark concert drone
      const osc = this.ctx.createOscillator();
      const sub = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(41.2, now); // Deep Low E
      sub.type = 'sine';
      sub.frequency.setValueAtTime(82.4, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 1.2);

      osc.connect(filter);
      sub.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain);

      osc.start(now);
      sub.start(now);

      this.currentAmbientNode = {
        stop: () => {
          if (!this.ctx) return;
          gain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
          setTimeout(() => {
            try {
              osc.stop();
              sub.stop();
            } catch {}
          }, 600);
        },
      };
    }
  }

  public stopThematicAmbient() {
    if (this.currentAmbientNode) {
      this.currentAmbientNode.stop();
      this.currentAmbientNode = null;
    }
    this.currentAmbientPage = null;
  }

  /**
   * Synthesize an electric guitar pluck with distortion / overdrive character
   */
  public playGuitarNote(freq: number, duration: number, distortion = true) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(freq * 0.5, now);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 2.2, now);
    filter.Q.setValueAtTime(3.5, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.45, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.2, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    if (distortion) {
      const waveshaper = this.ctx.createWaveShaper();
      waveshaper.curve = this.makeDistortionCurve(40) as any;
      waveshaper.oversample = '4x';

      osc.connect(waveshaper);
      subOsc.connect(waveshaper);
      waveshaper.connect(filter);
    } else {
      osc.connect(filter);
      subOsc.connect(filter);
    }

    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + duration + 0.05);
    subOsc.stop(now + duration + 0.05);
  }

  private makeDistortionCurve(amount = 20): Float32Array {
    const k = amount;
    const nSamples = 44100;
    const curve = new Float32Array(nSamples);
    const deg = Math.PI / 180;
    for (let i = 0; i < nSamples; ++i) {
      const x = (i * 2) / nSamples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  /**
   * Play an electric guitar riff sequence
   */
  public playRiff(riffType: 'solo-intro' | 'heavy-chords' | 'celestial-tap', onEnd?: () => void) {
    if (this.isMuted) return;
    this.stopRiff();
    this.initContext();
    this.isPlayingRiff = true;

    const E2 = 82.41;
    const G2 = 98.0;
    const A2 = 110.0;
    const B2 = 123.47;
    const D3 = 146.83;
    const E3 = 164.81;
    const G3 = 196.0;
    const A3 = 220.0;
    const B3 = 246.94;
    const D4 = 293.66;
    const E4 = 329.63;
    const G4 = 392.0;
    const A4 = 440.0;
    const B4 = 493.88;
    const D5 = 587.33;
    const E5 = 659.25;

    let notes: { f: number; d: number; gap: number }[] = [];

    if (riffType === 'solo-intro') {
      notes = [
        { f: E3, d: 0.2, gap: 150 },
        { f: G3, d: 0.2, gap: 150 },
        { f: A3, d: 0.25, gap: 180 },
        { f: B3, d: 0.3, gap: 200 },
        { f: D4, d: 0.2, gap: 160 },
        { f: E4, d: 0.45, gap: 300 },
        { f: G4, d: 0.2, gap: 150 },
        { f: A4, d: 0.2, gap: 150 },
        { f: B4, d: 0.35, gap: 260 },
        { f: D5, d: 0.25, gap: 200 },
        { f: E5, d: 0.9, gap: 750 },
      ];
    } else if (riffType === 'heavy-chords') {
      notes = [
        { f: E2, d: 0.4, gap: 240 },
        { f: E2, d: 0.2, gap: 140 },
        { f: G2, d: 0.3, gap: 220 },
        { f: A2, d: 0.5, gap: 320 },
        { f: E2, d: 0.4, gap: 240 },
        { f: D3, d: 0.3, gap: 200 },
        { f: E3, d: 0.8, gap: 600 },
        { f: B2, d: 0.4, gap: 260 },
        { f: A2, d: 0.7, gap: 600 },
      ];
    } else {
      notes = [
        { f: E4, d: 0.15, gap: 110 },
        { f: B4, d: 0.15, gap: 110 },
        { f: E5, d: 0.25, gap: 160 },
        { f: D5, d: 0.15, gap: 110 },
        { f: B4, d: 0.15, gap: 110 },
        { f: A4, d: 0.2, gap: 140 },
        { f: G4, d: 0.2, gap: 140 },
        { f: E4, d: 0.4, gap: 250 },
        { f: A4, d: 0.2, gap: 130 },
        { f: D5, d: 0.3, gap: 200 },
        { f: E5, d: 0.8, gap: 700 },
      ];
    }

    let accumulatedTime = 0;
    notes.forEach((item, index) => {
      const timeoutId = window.setTimeout(() => {
        if (!this.isPlayingRiff) return;
        this.playGuitarNote(item.f, item.d, true);

        if (index === notes.length - 1) {
          const finishId = window.setTimeout(() => {
            this.isPlayingRiff = false;
            onEnd?.();
          }, item.d * 1000 + 200);
          this.riffTimeouts.push(finishId);
        }
      }, accumulatedTime);

      this.riffTimeouts.push(timeoutId);
      accumulatedTime += item.gap;
    });
  }

  public stopRiff() {
    this.isPlayingRiff = false;
    this.riffTimeouts.forEach((t) => clearTimeout(t));
    this.riffTimeouts = [];
  }

  public isRiffPlaying(): boolean {
    return this.isPlayingRiff;
  }
}

export const audioSynth = new AudioSynthesizer();
