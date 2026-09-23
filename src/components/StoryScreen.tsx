import { useEffect, useRef } from "react";
import type { Scene } from "../data/story";
import ChoiceButton from "./ChoiceButton";
import MessageBubble from "./MessageBubble";
import MessageWall from "./MessageWall";

interface StoryScreenProps {
  scene: Scene;
  /** Called with the `next` scene ID of the chosen option. */
  onChoice: (nextSceneId: string) => void;
}

/** Fixed render order: material → narration → choices. No chapter labels. */
export default function StoryScreen({ scene, onChoice }: StoryScreenProps) {
  const articleRef = useRef<HTMLElement | null>(null);
  const lastSceneIdRef = useRef<string | null>(null);

  // On scene change (not first render): scroll to top and move focus so
  // keyboard and screen-reader users land in the new wall state.
  useEffect(() => {
    if (lastSceneIdRef.current === scene.id) return;
    lastSceneIdRef.current = scene.id;
    window.scrollTo({ top: 0, behavior: "auto" });
    articleRef.current?.focus({ preventScroll: true });
  }, [scene.id]);

  const heading = scene.title ?? "[UNTITLED SCENE]";

  return (
    <main className="story" id="story">
      <div className={`story__page story__page--mood-${scene.mood ?? "digital"}`}>
        <article
          key={scene.id}
          ref={articleRef}
          className={`story__scene story__scene--${scene.type}`}
          tabIndex={-1}
          aria-labelledby="scene-heading"
        >
          <h1 id="scene-heading" className="story__title">
            {heading}
          </h1>

          {scene.paragraphs.length > 0 ? (
            <div className="story__text">
              {scene.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          ) : null}

          {scene.message ? <MessageBubble message={scene.message} /> : null}

          {scene.messages ? (
            <div className="story__thread">
              {scene.messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </div>
          ) : null}

          {scene.evidence ? (
            <section className="evidence" aria-label="Claims under review">
              {scene.evidence.map((item) => (
                <article
                  key={item.id}
                  className={`evidence-card evidence-card--${item.tone}`}
                >
                  <p className="evidence-card__label">Claim</p>
                  <h2 className="evidence-card__claim">{item.claim}</h2>
                  <p className="evidence-card__status">{item.status}</p>
                  {item.context ? (
                    <p className="evidence-card__context">{item.context}</p>
                  ) : null}
                </article>
              ))}
            </section>
          ) : null}

          {scene.exhibit ? (
            <section className="exhibit">
              <p className="exhibit__numeral" aria-hidden="true">
                {scene.exhibit.numeral}
              </p>
              {scene.exhibit.slots.length > 0 ? (
                <ul className="exhibit__slots">
                  {scene.exhibit.slots.map((slot, index) => (
                    <li key={index} className="exhibit__slot">
                      {slot}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ) : null}

          {scene.compare ? (
            <section
              className="compare"
              aria-label={`${scene.compare.leftTitle} versus ${scene.compare.rightTitle}`}
            >
              <div className="compare__column compare__column--left">
                <h2 className="compare__heading">{scene.compare.leftTitle}</h2>
                <ul className="compare__list">
                  {scene.compare.left.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="compare__column compare__column--right">
                <h2 className="compare__heading">{scene.compare.rightTitle}</h2>
                <ul className="compare__list">
                  {scene.compare.right.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>
          ) : null}

          {scene.pairs ? (
            <section className="pairs" aria-label="Original claims and their context">
              {scene.pairs.map((pair) => (
                <div key={pair.id} className="pair">
                  <p className="pair__original">{pair.original}</p>
                  <p className="pair__context">{pair.context}</p>
                </div>
              ))}
            </section>
          ) : null}

          {scene.wall ? <MessageWall fragments={scene.wall} /> : null}

          {scene.afterword ? (
            <div className="story__afterword">
              {scene.afterword.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          ) : null}

          {scene.colophon ? (
            <footer className="colophon">
              {scene.colophon.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </footer>
          ) : null}

          {scene.choices ? (
            <nav className="story__choices" aria-label="Story choices">
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
      </div>
    </main>
  );
}
