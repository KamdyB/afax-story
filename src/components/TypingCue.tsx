import type { CSSProperties } from "react";

interface TypingCueProps {
  count: number;
  intervalMs: number;
}

export default function TypingCue({
  count,
  intervalMs,
}: TypingCueProps) {
  const lastMessageDelay = Math.max(0, count - 1) * intervalMs;

  const style = {
    "--cue-end": `${lastMessageDelay + intervalMs}ms`,
    "--typing-speed": `${intervalMs}ms`,
  } as CSSProperties;

  return (
    <p className="story__cue" style={style} aria-hidden="true">
      <span className="story__cue-dot" />
      <span className="story__cue-dot" />
      <span className="story__cue-dot" />
    </p>
  );
}