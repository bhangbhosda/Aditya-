/**
 * VedikChantSynth - High fidelity, native Web Audio synthesizer
 * Generates primordial Sanskrit OM vibrations & rhythmic temple bell resonance
 * completely in code with 100% reliability, zero loading time, and zero CORS dependency.
 */
export class VedikChantSynth {
  private ctx: AudioContext | null = null;
  private baseOscs: OscillatorNode[] = [];
  private formantFilters: BiquadFilterNode[] = [];
  private modOscs: OscillatorNode[] = [];
  private mainGain: GainNode | null = null;
  private resonanceFilter: BiquadFilterNode | null = null;
  private bellIntervalHandle: any = null;
  private isSynthesizing: boolean = false;

  constructor() {}

  /**
   * Starts synthesizing the sacred OM drone and periodic temple bells
   */
  public start(volume: number = 0.85) {
    if (this.isSynthesizing) return;
    this.isSynthesizing = true;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        console.error("Web Audio API is not supported by this browser.");
        return;
      }

      this.ctx = new AudioContextClass();
      
      // Main Out Gain Node
      this.mainGain = this.ctx.createGain();
      this.mainGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.mainGain.gain.linearRampToValueAtTime(volume * 0.7, this.ctx.currentTime + 2.5); // Warm fade-in
      this.mainGain.connect(this.ctx.destination);

      // Deep resonant spatial filter (simulate temple space)
      this.resonanceFilter = this.ctx.createBiquadFilter();
      this.resonanceFilter.type = "lowpass";
      this.resonanceFilter.frequency.setValueAtTime(260, this.ctx.currentTime); // keep it extremely warm/subdued
      this.resonanceFilter.Q.setValueAtTime(4.0, this.ctx.currentTime);
      this.resonanceFilter.connect(this.mainGain);

      // Primordial "OM" fundamental Sanskrit frequencies
      // Sacred frequencies: 136.1 Hz (Cosmic OM) and its octaves/harmonics
      const baseFreq = 136.1; 
      const components = [
        { mult: 0.5, type: "sine", gain: 0.8 },   // Sub-bass resonance (68 Hz)
        { mult: 1.0, type: "sawtooth", gain: 0.45 }, // Fundamental "OM"
        { mult: 1.5, type: "sine", gain: 0.3 },     // Perfect fifth
        { mult: 2.0, type: "sawtooth", gain: 0.25 }, // Octave multiplier
        { mult: 3.0, type: "triangle", gain: 0.15 }  // Higher harmonics
      ];

      components.forEach((comp) => {
        if (!this.ctx || !this.resonanceFilter) return;

        const osc = this.ctx.createOscillator();
        osc.type = comp.type as OscillatorType;
        osc.frequency.setValueAtTime(baseFreq * comp.mult, this.ctx.currentTime);

        const compGain = this.ctx.createGain();
        compGain.gain.setValueAtTime(comp.gain * 0.18, this.ctx.currentTime);

        // Vocal Formant modeling filters (Biquad bandpass chain mimics vocal tract vocalizations "Ooo-Mmm")
        const formantBiquad = this.ctx.createBiquadFilter();
        formantBiquad.type = "bandpass";
        
        // Human vocal bandpass resonance frequencies for "O" vowel (F1 ~ 420Hz, F2 ~ 800Hz)
        const initialFormantFreq = comp.mult >= 2.0 ? 800 : 380;
        formantBiquad.frequency.setValueAtTime(initialFormantFreq, this.ctx.currentTime);
        formantBiquad.Q.setValueAtTime(3.5, this.ctx.currentTime);

        // Slow rhythmic breathing modulation to drift from "ooo" to "mmm" vocals automatically
        const breather = this.ctx.createOscillator();
        breather.type = "sine";
        breather.frequency.setValueAtTime(0.08, this.ctx.currentTime); // Very slow breath (12.5s cycles)
        
        const breatherGain = this.ctx.createGain();
        breatherGain.gain.setValueAtTime(140, this.ctx.currentTime); // frequency swing of formant filter

        breather.connect(breatherGain);
        breatherGain.connect(formantBiquad.frequency);

        // Connect up the audio nodes
        osc.connect(compGain);
        compGain.connect(formantBiquad);
        formantBiquad.connect(this.resonanceFilter);

        // Start modules
        osc.start(0);
        breather.start(0);

        this.baseOscs.push(osc);
        this.formantFilters.push(formantBiquad);
        this.modOscs.push(breather);
      });

      // Rhythmic Sacred Temple Bell (Trigger once immediately, then periodically)
      const playTempleBell = () => {
        if (!this.ctx || !this.mainGain || this.ctx.state === "closed") return;

        // Base sine bell and secondary high ringing harmonic
        const chimeFrequencies = [520, 1040, 1560]; 
        const chimeGains = [0.15, 0.08, 0.03];

        chimeFrequencies.forEach((freq, i) => {
          if (!this.ctx || !this.mainGain) return;
          
          const bellOsc = this.ctx.createOscillator();
          bellOsc.type = "sine";
          bellOsc.frequency.setValueAtTime(freq, this.ctx.currentTime);

          const bellEnv = this.ctx.createGain();
          bellEnv.gain.setValueAtTime(0, this.ctx.currentTime);
          bellEnv.gain.linearRampToValueAtTime(chimeGains[i] * 0.8, this.ctx.currentTime + 0.005);
          // Long spiritual exponential decay representing continuous sustain
          bellEnv.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 8.5);

          bellOsc.connect(bellEnv);
          bellEnv.connect(this.mainGain);

          bellOsc.start(0);
          bellOsc.stop(this.ctx.currentTime + 9.0);
        });
      };

      // Trigger bell chime instantly
      playTempleBell();

      // Set bell interval handle (every 14 seconds)
      this.bellIntervalHandle = setInterval(() => {
        playTempleBell();
      }, 14000);

    } catch (err) {
      console.warn("Vedic synth initialization bypass error:", err);
    }
  }

  /**
   * Safe clean-up of oscillators and audio context
   */
  public stop() {
    if (!this.isSynthesizing) return;
    this.isSynthesizing = false;

    if (this.bellIntervalHandle) {
      clearInterval(this.bellIntervalHandle);
      this.bellIntervalHandle = null;
    }

    // Stop and teardown all audio processing nodes
    this.baseOscs.forEach((osc) => {
      try { osc.stop(); } catch (e) {}
    });
    this.modOscs.forEach((osc) => {
      try { osc.stop(); } catch (e) {}
    });

    this.baseOscs = [];
    this.modOscs = [];
    this.formantFilters = [];

    if (this.ctx) {
      try {
        this.ctx.close();
      } catch (e) {}
      this.ctx = null;
    }
  }
}
