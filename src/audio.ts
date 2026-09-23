/**
 * Synthesized story sounds. No audio files, no autoplay: the context is
 * created and unlocked on the reader's first interaction, and every sound
 * stays silent if audio is unavailable or reduced motion is requested.
 */

let context: AudioContext | null = null;
let reverb: ConvolverNode | null = null;
let reverbWet: GainNode | null = null;
let wipeBuffer: AudioBuffer | null = null;

/** Runtime guard for browsers without Web Audio. */
function createAudioContext(): AudioContext | null {
  const AudioContextConstructor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  return AudioContextConstructor ? new AudioContextConstructor() : null;
}

/** Builds a short decaying-noise impulse response — a small, warm room. */
function createReverb(audio: AudioContext): ConvolverNode {
  const convolver = audio.createConvolver();
  const length = Math.floor(audio.sampleRate * 0.9);
  const impulse = audio.createBuffer(2, length, audio.sampleRate);
  for (let channel = 0; channel < 2; channel += 1) {
    const samples = impulse.getChannelData(channel);
    for (let i = 0; i < length; i += 1) {
      const decay = Math.pow(1 - i / length, 2.5);
      samples[i] = (Math.random() * 2 - 1) * decay;
    }
  }
  convolver.buffer = impulse;
  return convolver;
}

/** Wires the shared reverb send exactly once, after the context exists. */
function ensureReverb(): void {
  if (context === null) return;
  if (reverb !== null && reverbWet !== null) return;
  reverb = createReverb(context);
  reverbWet = context.createGain();
  reverbWet.gain.value = 0.3;
  reverb.connect(reverbWet);
  reverbWet.connect(context.destination);
}

/** Routes a node dry to the speakers, plus a wet send through the room. */
function connectToOutput(node: AudioNode): void {
  if (context === null) return;
  node.connect(context.destination);
  if (reverb !== null) {
    node.connect(reverb);
  }
}

/** Unlocks audio on the reader's first interaction. Returns the cleanup. */
export function initAudioOnFirstGesture(): () => void {
  const unlock = () => {
    if (context === null) {
      context = createAudioContext();
    }
    if (context !== null) {
      ensureReverb();
      void context.resume();
    }
  };
  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
  return () => {
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };
}

/** Soft two-tone ping through a gentle filter and room — a hushed arrival. */
export function playMessagePing(): void {
  if (context === null || context.state !== "running") return;

  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(740, now);
  oscillator.frequency.exponentialRampToValueAtTime(560, now + 0.35);

  filter.type = "lowpass";
  filter.frequency.value = 1800;

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.04, now + 0.06);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

  oscillator.connect(filter);
  filter.connect(gain);
  connectToOutput(gain);

  oscillator.start(now);
  oscillator.stop(now + 0.6);
}

/** Cached white-noise buffer for the page-turn wipe. */
function getWipeBuffer(): AudioBuffer | null {
  if (context === null) return null;
  if (wipeBuffer === null) {
    const length = Math.floor(context.sampleRate * 0.45);
    wipeBuffer = context.createBuffer(1, length, context.sampleRate);
    const samples = wipeBuffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) {
      samples[i] = Math.random() * 2 - 1;
    }
  }
  return wipeBuffer;
}

/** A paper-wipe breath across the wall when the scene turns. */
export function playWallWipe(): void {
  if (context === null || context.state !== "running") return;
  const buffer = getWipeBuffer();
  if (buffer === null) return;

  const now = context.currentTime;
  const noise = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();

  noise.buffer = buffer;

  filter.type = "bandpass";
  filter.Q.value = 0.8;
  filter.frequency.setValueAtTime(350, now);
  filter.frequency.exponentialRampToValueAtTime(1400, now + 0.45);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.05, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

  noise.connect(filter);
  filter.connect(gain);
  connectToOutput(gain);

  noise.start(now);
  noise.stop(now + 0.5);
}
