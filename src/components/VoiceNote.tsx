import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import type { StoryAudio } from "../data/story";

interface VoiceNoteProps {
  audio: StoryAudio;
}

/** Player availability: checking until the recording's presence is confirmed. */
type AudioStatus = "checking" | "available" | "unavailable";

/** Seconds → m:ss. Guards NaN / Infinity / negative values. */
function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

/**
 * Real voice note on the browser's native HTMLAudioElement. No audio library,
 * no autoplay. Availability is verified up front so a missing recording shows
 * as a designed placeholder instead of a button that fails on click.
 */
export default function VoiceNote({ audio }: VoiceNoteProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [status, setStatus] = useState<AudioStatus>("checking");
  const unavailable = status === "unavailable";

  // Verify the recording exists before offering playback. Dev servers fall
  // back to index.html for missing paths with HTTP 200, so both response
  // status and content type must agree it is audio. If HEAD is blocked by
  // the host, the native error/playback events below decide instead.
  useEffect(() => {
    let cancelled = false;
    fetch(audio.src, { method: "HEAD" })
      .then((response) => {
        if (cancelled) return;
        const type = response.headers.get("content-type") ?? "";
        setStatus(
          response.ok && type.startsWith("audio") ? "available" : "unavailable",
        );
      })
      .catch(() => {
        if (!cancelled) setStatus("available"); // host ignores HEAD; trust <audio>
      });
    return () => {
      cancelled = true;
    };
  }, [audio.src]);

  // Stop playback if the reader turns the page mid-listen.
  useEffect(() => {
    const element = audioRef.current;
    return () => {
      element?.pause();
    };
  }, []);

  const handleToggle = () => {
    const element = audioRef.current;
    if (element === null || unavailable) return;
    if (element.paused) {
      // play() can reject (missing source, browser policy) — degrade honestly.
      element.play().catch(() => setStatus("unavailable"));
    } else {
      element.pause();
    }
  };

  const handleTimeUpdate = () => {
    const element = audioRef.current;
    if (element !== null) setCurrentTime(element.currentTime);
  };

  const handleLoadedMetadata = () => {
    const element = audioRef.current;
    if (element !== null && Number.isFinite(element.duration)) {
      setDuration(element.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleError = () => setStatus("unavailable");

  const progress =
    duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;
  const durationLabel =
    duration > 0 ? formatTime(duration) : (audio.durationLabel ?? "–:––");
  const elapsedLabel = formatTime(currentTime);

  return (
    <div className="voice-note">
      <audio
        ref={audioRef}
        src={audio.src}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleError}
      />

      <div className="voice-note__controls">
        <button
          type="button"
          className={`voice-note__toggle${isPlaying ? " voice-note__toggle--playing" : ""}`}
          aria-label={
            unavailable
              ? "Voice note unavailable — recording not added yet"
              : isPlaying
                ? "Pause voice note"
                : "Play voice note"
          }
          disabled={status !== "available"}
          onClick={handleToggle}
        >
          {isPlaying ? (
            <Pause size={14} strokeWidth={2.25} aria-hidden="true" />
          ) : (
            <Play size={14} strokeWidth={2.25} aria-hidden="true" />
          )}
        </button>

        <div
          className={`voice-note__track${unavailable ? " voice-note__track--unavailable" : ""}`}
          role="progressbar"
          aria-label="Voice note progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          aria-valuetext={`${elapsedLabel} of ${durationLabel}`}
        >
          <div className="voice-note__fill" style={{ width: `${progress}%` }} />
        </div>

        <span className="voice-note__time">
          {elapsedLabel} / {durationLabel}
        </span>
      </div>

      {unavailable ? (
        <p className="voice-note__missing">Voice recording not added yet.</p>
      ) : null}
    </div>
  );
}
