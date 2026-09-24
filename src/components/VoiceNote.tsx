import { useRef, useState, type ChangeEvent } from "react";
import { Pause, Play } from "lucide-react";
import type { StoryAudio } from "../data/story";

interface VoiceNoteProps {
  audio: StoryAudio;
}

const EMPTY_TIME = "0:00";
/** Cycles 0.5 → 1 → 1.5 → 2 → back to 0.5. */
const SPEED_STEP = 0.5;
const SPEED_MAX = 2;

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
  // While the reader is dragging the scrubber, timeupdate must not fight them.
  const draggingRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [rate, setRate] = useState(1);

  const source = audio.src;

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

  const cycleSpeed = () => {
    const element = audioRef.current;
    const nextRate = rate >= SPEED_MAX ? SPEED_STEP : rate + SPEED_STEP;
    setRate(nextRate);
    if (element) {
      element.playbackRate = nextRate;
    }
  };

  const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
    const element = audioRef.current;
    const nextTime = Number(event.target.value);
    if (!Number.isFinite(nextTime)) return;
    setCurrentTime(nextTime);
    if (element && Number.isFinite(element.duration)) {
      element.currentTime = nextTime;
    }
  };

  // State is driven entirely by media events — no effects, no lint traps,
  // and a changed src naturally resets via emptied/loadedmetadata.
  const progress =
    duration > 0
      ? Math.min(100, Math.max(0, (currentTime / duration) * 100))
      : 0;
  const seekable = !hasError && duration > 0;

  return (
    <div className="voice-note">
      <audio
        ref={audioRef}
        preload="metadata"
        src={source}
        onLoadedMetadata={(event) => {
          const element = event.currentTarget;
          if (Number.isFinite(element.duration)) {
            setDuration(element.duration);
          }
          // Some browsers reset rate when a new source loads.
          element.playbackRate = rate;
        }}
        onDurationChange={(event) => {
          const nextDuration = event.currentTarget.duration;
          if (Number.isFinite(nextDuration)) {
            setDuration(nextDuration);
          }
        }}
        onTimeUpdate={(event) => {
          if (!draggingRef.current) {
            setCurrentTime(event.currentTarget.currentTime);
          }
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
        onEmptied={(event) => {
          setIsPlaying(false);
          setCurrentTime(0);
          setDuration(0);
          void event;
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
        <div className="voice-note__scrub">
          <div
            className={`voice-note__track${
              hasError ? " voice-note__track--unavailable" : ""
            }`}
            aria-hidden="true"
          >
            <span
              className="voice-note__fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Invisible native slider: the visible track is decorative,
              this input is the real accessible control. */}
          <input
            type="range"
            className="voice-note__seek"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(currentTime, duration || 0)}
            onChange={handleSeek}
            onPointerDown={() => {
              draggingRef.current = true;
            }}
            onPointerUp={() => {
              draggingRef.current = false;
            }}
            onPointerCancel={() => {
              draggingRef.current = false;
            }}
            disabled={!seekable}
            aria-label="Voice note position"
            aria-valuemin={0}
            aria-valuemax={Math.floor(duration)}
            aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
          />
        </div>
        <button
          type="button"
          className="voice-note__speed"
          onClick={cycleSpeed}
          disabled={hasError}
          aria-label={`Playback speed ${rate} times. Activate for next speed.`}
          title="Playback speed"
        >
          {rate}×
        </button>
        <span className="voice-note__time" aria-live="off">
          {hasError
            ? "Unavailable"
            : `${formatTime(currentTime)} / ${formatTime(duration)}`}
        </span>
      </div>
    </div>
  );
}
