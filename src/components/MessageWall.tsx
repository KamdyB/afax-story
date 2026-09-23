import { useState } from "react";
import type { WallFragment } from "../data/story";

interface MessageWallProps {
  fragments: WallFragment[];
}

/**
 * Scene 15: the original message pinned to the wall, fragment by fragment.
 * Each fragment is a button that reveals its contextual note. The message
 * is annotated, never deleted.
 */
export default function MessageWall({ fragments }: MessageWallProps) {
  const [openId, setOpenId] = useState<string | null>(null);

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
              onClick={() => setOpenId(isOpen ? null : fragment.id)}
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
