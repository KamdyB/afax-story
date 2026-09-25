import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const STORAGE_KEY = "afax-ambience";
/** The file is pre-quieted; this is the in-app ceiling on top of it. */
const TARGET_VOLUME = 1.0;
const FADE_MS = 900;

interface FadeToken {
  current: number | null;
}

/** Glides an element to a target volume; pauses it when fading to zero. */
function fadeElement(
  audio: HTMLAudioElement,
  target: number,
  fadeRef: FadeToken,
): void {
  if (fadeRef.current !== null) {
    window.clearInterval(fadeRef.current);
  }
  const startVolume = audio.volume;
  const startedAt = performance.now();
  fadeRef.current = window.setInterval(() => {
    const t = Math.min(1, (performance.now() - startedAt) / FADE_MS);
    audio.volume = startVolume + (target - startVolume) * t;
    if (t >= 1) {
      if (fadeRef.current !== null) window.clearInterval(fadeRef.current);
      fadeRef.current = null;
      if (target === 0) audio.pause();
    }
  }, 50);
}

/** Remembers the reader's choice. Playback always waits for a gesture. */
function getInitialPreference(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

export default function AmbienceToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const [on, setOn] = useState<boolean>(getInitialPreference);

  // If the reader left ambience on, resume it on their next gesture —
  // browsers never allow playback before one.
  useEffect(() => {
    const audio = audioRef.current;
    if (!on || !audio || !audio.paused) return;
    const resume = () => {
      if (!audio.paused) return;
      audio.volume = 0;
      void audio.play().catch(() => {
        /* stays silent rather than erroring */
      });
      fadeElement(audio, TARGET_VOLUME, fadeRef);
    };
    window.addEventListener("pointerdown", resume, { once: true });
    window.addEventListener("keydown", resume, { once: true });
    return () => {
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
    };
  }, [on]);

  const toggle = () => {
    const audio = audioRef.current;
    const next = !on;
    setOn(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
    } catch {
      /* preference is session-only if storage is blocked */
    }
    if (!audio) return;
    if (next) {
      audio.volume = 0;
      void audio.play().catch(() => {
        /* blocked until a gesture; the resume listener retries */
      });
      fadeElement(audio, TARGET_VOLUME, fadeRef);
    } else {
      fadeElement(audio, 0, fadeRef);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}audio/ambience-forest.mp3`}
        loop
        preload="auto"
      />
      <button
        type="button"
        className={`theme-toggle ambience-toggle${
          on ? " ambience-toggle--on" : ""
        }`}
        onClick={toggle}
        aria-pressed={on}
        aria-label={on ? "Turn off ambient sound" : "Turn on ambient sound"}
        title="Ambient sound"
      >
        {on ? (
          <Volume2 size={17} strokeWidth={1.75} aria-hidden="true" />
        ) : (
          <VolumeX size={17} strokeWidth={1.75} aria-hidden="true" />
        )}
      </button>
    </>
  );
}
