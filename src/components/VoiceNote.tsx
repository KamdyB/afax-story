import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import type { StoryAudio } from "../data/story";

interface VoiceNoteProps {
  audio: StoryAudio;
}

const EMPTY_TIME = "0:00";

function resolveAudioSource(src: string): string {
  /*
   * Audio files live in /public/audio/.
   *
   * import.meta.env.BASE_URL is:
   *   "/" locally
   *   "/afax-story/" on GitHub Pages
   *
   * This prevents GitHub Pages from requesting /audio/file.mp3
   * from the domain root instead of /afax-story/audio/file.mp3.
   */
  if (/^(https?:|data:|blob:)/i.test(src)) {
    return src;
  }

  const base = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;

  const cleanSrc = src.replace(/^\/+/, "");

  return `${base}${cleanSrc}`;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return EMPTY_TIME;
  }

  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainder = totalSeconds % 60;

  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

export default function VoiceNote({ audio }: VoiceNoteProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasError, setHasError] = useState(false);

  const source = resolveAudioSource(audio.src);

  useEffect(() => {
    const element = audioRef.current;

    setIsPlaying(false);
    setDuration(0);
    setCurrentTime(0);
    setHasError(false);

    if (!element) return;

    element.pause();
    element.currentTime = 0;
    element.load();
  }, [source]);

  const togglePlayback = async () => {
    const element = audioRef.current;

    if (!element || hasError) return;

    if (element.paused) {
      try {
        await element.play();
      } catch {
        setHasError(true);
        setIsPlaying(false);
      }

      return;
    }

    element.pause();
  };

  const progress =
    duration > 0
      ? Math.min(100, Math.max(0, (currentTime / duration) * 100))
      : 0;

  return (
    <div className="voice-note">
      <audio
        ref={audioRef}
        preload="metadata"
        src={source}
        onLoadedMetadata={(event) => {
          const nextDuration = event.currentTarget.duration;

          if (Number.isFinite(nextDuration)) {
            setDuration(nextDuration);
          }
        }}
        onDurationChange={(event) => {
          const nextDuration = event.currentTarget.duration;

          if (Number.isFinite(nextDuration)) {
            setDuration(nextDuration);
          }
        }}
        onTimeUpdate={(event) => {
          setCurrentTime(event.currentTarget.currentTime);
        }}
        onPlay={() => {
          setIsPlaying(true);
          setHasError(false);
        }}
        onPause={() => {
          setIsPlaying(false);
        }}
        onEnded={(event) => {
          setIsPlaying(false);
          setCurrentTime(event.currentTarget.duration || 0);
        }}
        onError={() => {
          setHasError(true);
          setIsPlaying(false);
        }}
      />

      <div className="voice-note__controls">
        <button
          type="button"
          className={`voice-note__toggle${
            isPlaying ? " voice-note__toggle--playing" : ""
          }`}
          onClick={togglePlayback}
          disabled={hasError}
          aria-label={
            hasError
              ? "Voice note unavailable"
              : isPlaying
                ? "Pause voice note"
                : "Play voice note"
          }
          title={
            hasError
              ? "Voice note unavailable"
              : isPlaying
                ? "Pause voice note"
                : "Play voice note"
          }
        >
          {isPlaying ? (
            <Pause size={14} strokeWidth={2.4} aria-hidden="true" />
          ) : (
            <Play size={14} strokeWidth={2.4} aria-hidden="true" />
          )}
        </button>

        <div
          className={`voice-note__track${
            hasError ? " voice-note__track--unavailable" : ""
          }`}
          role="progressbar"
          aria-label="Voice note progress"
          aria-valuemin={0}
          aria-valuemax={duration || 0}
          aria-valuenow={Math.min(currentTime, duration || 0)}
        >
          <span
            className="voice-note__fill"
            style={{ width: `${progress}%` }}
            aria-hidden="true"
          />
        </div>

        <span className="voice-note__time" aria-live="off">
          {hasError
            ? "Unavailable"
            : `${formatTime(currentTime)} / ${formatTime(duration)}`}
        </span>
      </div>
    </div>
  );
}