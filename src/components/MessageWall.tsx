import { useState } from "react";
import type { WallFragment } from "../data/story";
import { playPinTone } from "../audio";

interface MessageWallProps {
  fragments: WallFragment[];
}

/**
 * The original message pinned to the wall, fragment by fragment.
 * Each fragment is a button that reveals its contextual note — and each
 * carries its own small tone, so every word has a physical presence.
 * The message is annotated, never deleted.
 */
export default function MessageWall({ fragments }: MessageWallProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const togglePin = (fragment: WallFragment) => {
    const isOpen = openId === fragment.id;
    if (
      !isOpen &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      playPinTone(fragment.id);
    }
    setOpenId(isOpen ? null : fragment.id);
  };

  return (
    <section className="wall" aria-label="The annotated message">
      {fragments.map((fragment) => {
        const isOpen = openId === fragment.id;
        return (
          <div key={fragment.id} className="wall__fragment">
            <button
              type="button"
              className={`wall__pin${isOpen ? " wall__pin--open" : ""}`}
              aria-expanded={isOpen}
              onClick={() => togglePin(fragment)}
            >
              {fragment.label}
            </button>
            {isOpen ? <p className="wall__note">{fragment.note}</p> : null}
          </div>
        );
      })}
    </section>
  );
}
