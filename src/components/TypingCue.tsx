import type { CSSProperties } from "react";

interface TypingCueProps {
  /** Number of messages in the cascade — sets when the cue fades out. */
  count: number;
}

/** Typing dots that hold while more messages are on their way, then fade. */
export default function TypingCue({ count }: TypingCueProps) {
  // Fades just after the last bubble lands: 5s cadence + bubble-in tail.
  const style = { "--cue-end": `${(count - 1) * 5 + 5.4}s` } as CSSProperties;

  return (
    <p className="story__cue" style={style} aria-hidden="true">
      <span className="story__cue-dot" />
      <span className="story__cue-dot" />
      <span className="story__cue-dot" />
    </p>
  );
}
