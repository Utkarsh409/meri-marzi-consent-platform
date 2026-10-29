// Audio Engine: Web Speech Synthesis, Web Audio Synthesizer, & Waveform Visualizer
// 100% Client-side, Offline-capable, Zero external audio files required

class AudioEngine {
  constructor() {
    this.synth = window.speechSynthesis || null;
    this.voices = [];
    this.currentUtterance = null;
    this.isSpeaking = false;
    this.speechRate = 0.95; // Default slightly slower for clarity among rural citizens
    this.audioCtx = null;
    this.visualizerAnimationId = null;
    this.onStateChange = null;

    if (this.synth) {
      this.loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  setSpeechRate(rate) {
    this.speechRate = Math.max(0.7, Math.min(1.4, Number(rate) || 1.0));
  }

  // Find best available voice for language
  findVoice(langCode = 'hi-IN') {
    if (!this.voices || this.voices.length === 0) {
      this.loadVoices();
    }
    // Match exact language or prefix
    const normalized = langCode.toLowerCase().replace('_', '-');
    const exactMatch = this.voices.find(v => v.lang.toLowerCase().replace('_', '-') === normalized);
    if (exactMatch) return exactMatch;

    const prefix = normalized.split('-')[0];
    const prefixMatch = this.voices.find(v => v.lang.toLowerCase().startsWith(prefix));
    if (prefixMatch) return prefixMatch;

    // Fallback Indian English or default voice
    const indianEnglish = this.voices.find(v => v.lang.toLowerCase().includes('in'));
    if (indianEnglish) return indianEnglish;

    return this.voices[0] || null;
  }

  speak(text, langCode = 'hi-IN', onStart, onEnd, onError) {
    if (!this.synth) {
      console.warn('SpeechSynthesis not supported on this device');
      if (onError) onError('SpeechSynthesis unsupported');
      return;
    }

    this.stop(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = this.speechRate;
    utterance.pitch = 1.0;

    const voice = this.findVoice(langCode);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (this.onStateChange) this.onStateChange({ isSpeaking: true });
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (this.onStateChange) this.onStateChange({ isSpeaking: false });
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (this.onStateChange) this.onStateChange({ isSpeaking: false });
      if (onError) onError(e);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (this.onStateChange) this.onStateChange({ isSpeaking: false });
    }
  }

  // --- Web Audio API UI Sound Synthesizers ---

  // Friendly tap sound
  playClickSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      console.debug('Audio click tone error', e);
    }
  }

  // Mic recording start chime
  playMicStartSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      console.debug('Mic start sound error', e);
    }
  }

  // Dignity Verification Harmonic Chime (Celebratory warm chord)
  playSuccessChime() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Major triad)
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = ctx.currentTime + idx * 0.08;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.8);
      });
    } catch (e) {
      console.debug('Success chime error', e);
    }
  }

  // Gentle Caution Chime (for Blind 'Yes' or Misconceptions)
  playCautionChime() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [587.33, 440]; // D5 down to A4
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.12;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.35);
      });
    } catch (e) {
      console.debug('Caution chime error', e);
    }
  }

  // --- Dynamic Waveform Visualizer on Canvas ---
  startWaveform(canvas, isActiveCallback) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const isActive = isActiveCallback ? isActiveCallback() : false;
      const barCount = 32;
      const barWidth = width / barCount;

      for (let i = 0; i < barCount; i++) {
        let barHeight = 4;
        if (isActive) {
          // Dynamic organic undulating wave
          const wave1 = Math.sin(phase + i * 0.3) * 0.5 + 0.5;
          const wave2 = Math.cos(phase * 1.5 + i * 0.2) * 0.5 + 0.5;
          barHeight = 6 + (wave1 * wave2) * (height - 12);
        }

        const x = i * barWidth;
        const y = (height - barHeight) / 2;

        // Gradient from Saffron to Emerald Green
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isActive) {
          gradient.addColorStop(0, '#ff9933'); // Saffron
          gradient.addColorStop(1, '#10b981'); // Emerald
        } else {
          gradient.addColorStop(0, 'rgba(148, 163, 184, 0.4)');
          gradient.addColorStop(1, 'rgba(148, 163, 184, 0.2)');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x + 2, y, barWidth - 4, barHeight, 3);
        ctx.fill();
      }

      phase += isActive ? 0.12 : 0.02;
      this.visualizerAnimationId = requestAnimationFrame(render);
    };

    if (this.visualizerAnimationId) {
      cancelAnimationFrame(this.visualizerAnimationId);
    }
    render();
  }

  stopWaveform() {
    if (this.visualizerAnimationId) {
      cancelAnimationFrame(this.visualizerAnimationId);
      this.visualizerAnimationId = null;
    }
  }
}

export const audioEngine = new AudioEngine();
