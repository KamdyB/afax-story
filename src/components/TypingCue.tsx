import type { CSSProperties } from "react";

interface TypingCueProps {
  /** Number of messages in the cascade. */
  count: number;
}

const MESSAGE_INTERVAL_MS = 3000;
const BUBBLE_TAIL_MS = 450;

/** Three dots that travel as a small wave while the message cascade continues. */
export default function TypingCue({ count }: TypingCueProps) {
  const lastMessageStart = Math.max(0, count - 1) * MESSAGE_INTERVAL_MS;
  const cueEnd = lastMessageStart + BUBBLE_TAIL_MS;

  const style = {
    "--cue-end": `${cueEnd}ms`,
  } as CSSProperties;

  return (
    <p className="story__cue" style={style} aria-hidden="true">
      <span className="story__cue-dot" />
      <span className="story__cue-dot" />
      <span className="story__cue-dot" />
    </p>
  );
}
