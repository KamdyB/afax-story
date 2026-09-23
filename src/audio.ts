/**
 * A soft synthesized "ping" for arriving messages. No audio files, no
 * autoplay: the context is created and unlocked on the reader's first
 * interaction, and the ping stays silent if audio is unavailable.
 */

let context: AudioContext | null = null;

/** Runtime guard for browsers without Web Audio. */
function createAudioContext(): AudioContext | null {
  const AudioContextConstructor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  return AudioContextConstructor ? new AudioContextConstructor() : null;
}

/** Unlocks audio on the reader's first interaction. Returns the cleanup. */
export function initAudioOnFirstGesture(): () => void {
  const unlock = () => {
    context ??= createAudioContext();
    void context.resume();
  };
  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
  return () => {
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };
}

/** Soft two-tone ping, like a quiet chat notification. Silent until unlocked. */
export function playMessagePing(): void {
  if (context === null || context.state !== "running") return;

  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(880, now);
  oscillator.frequency.exponentialRampToValueAtTime(660, now + 0.3);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.07, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

  oscillator.connect(gain).connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.4);
}
