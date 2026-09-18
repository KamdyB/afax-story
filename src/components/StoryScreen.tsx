import { useEffect, useRef } from "react";
import type { Scene } from "../data/story";
import ChoiceButton from "./ChoiceButton";
import MessageBubble from "./MessageBubble";

interface StoryScreenProps {
  scene: Scene;
  /** Called with the `next` scene ID of the chosen option. */
  onChoice: (nextSceneId: string) => void;
}

export default function StoryScreen({ scene, onChoice }: StoryScreenProps) {
  const articleRef = useRef<HTMLElement | null>(null);
  const lastSceneIdRef = useRef<string | null>(null);

  // On every scene change (but not the first render), scroll to the top
  // and move keyboard focus to the scene so screen-reader and keyboard
  // users land in the new content.
  useEffect(() => {
    if (lastSceneIdRef.current === scene.id) return;
    lastSceneIdRef.current = scene.id;
    window.scrollTo({ top: 0, behavior: "auto" });
    articleRef.current?.focus({ preventScroll: true });
  }, [scene.id]);

  return (
    <main className="story" id="story">
      <article
        key={scene.id}
        ref={articleRef}
        className={`story__scene story__scene--${scene.type}`}
        tabIndex={-1}
        aria-labelledby="scene-heading"
      >
        {scene.kicker ? <p className="story__kicker">{scene.kicker}</p> : null}
        <h1 id="scene-heading" className="story__title">
          {scene.title ?? "[PLACEHOLDER: UNTITLED SCENE]"}
        </h1>
        <div className="story__text">
          {scene.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        {scene.message ? <MessageBubble message={scene.message} /> : null}
        {scene.choices ? (
          <nav className="story__choices" aria-label="Story choices">
            {/* Index keys: choices are static data, and two choices may
                legitimately share the same `next` scene ID. */}
            {scene.choices.map((choice, index) => (
              <ChoiceButton
                key={index}
                label={choice.label}
                hint={choice.hint}
                onSelect={() => onChoice(choice.next)}
              />
            ))}
          </nav>
        ) : null}
      </article>
    </main>
  );
}
