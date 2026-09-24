import { useEffect, useRef, useState, type AnimationEvent } from "react";
import type { Scene } from "../data/story";
import ChoiceButton from "./ChoiceButton";
import MessageBubble from "./MessageBubble";
import MessageWall from "./MessageWall";
import TypingCue from "./TypingCue";
import { playMessagePing, playWallWipe } from "../audio";

interface StoryScreenProps {
  scene: Scene;
  /** Called with the `next` scene ID of the chosen option. */
  onChoice: (nextSceneId: string) => void;
}

/** Delay between narration words, in milliseconds. */
const WORD_DELAY_MS = 45;

/** Delay between present-day digital messages, in milliseconds. */
const MESSAGE_DELAY_MS = 3000;

interface WordEntry {
  word: string;
  delay: number;
}

interface NarrationBlock {
  key: number;
  words: WordEntry[];
}

/** Splits narration into word spans; delays run continuously across paragraphs. */
function buildNarration(paragraphs: string[]): NarrationBlock[] {
  const blocks: NarrationBlock[] = [];
  let wordOffset = 0;
  paragraphs.forEach((paragraph, index) => {
    const words = paragraph.split(/\s+/).filter(Boolean);
    blocks.push({
      key: index,
      words: words.map((word, wordIndex) => ({
        word,
        delay: (wordOffset + wordIndex) * WORD_DELAY_MS,
      })),
    });
    wordOffset += words.length;
  });
  return blocks;
}

/** Fixed render order: material → narration → choices. No chapter labels. */
export default function StoryScreen({ scene, onChoice }: StoryScreenProps) {
  const articleRef = useRef<HTMLElement | null>(null);
  const lastSceneIdRef = useRef<string | null>(null);
  const narration = buildNarration(scene.paragraphs);
  const digitalMessages = scene.mood === "digital" ? scene.messages : undefined;
  const [messageReveal, setMessageReveal] = useState(() => ({
    sceneId: scene.id,
    count: digitalMessages ? 0 : scene.messages?.length ?? 0,
  }));

  const visibleMessageCount =
    messageReveal.sceneId === scene.id
      ? messageReveal.count
      : digitalMessages
        ? 0
        : scene.messages?.length ?? 0;

  // Reveal present-day messages one at a time so the thread physically grows
  // as each message lands instead of reserving the full thread height upfront.
  useEffect(() => {
    if (!digitalMessages?.length) {
      setMessageReveal({ sceneId: scene.id, count: scene.messages?.length ?? 0 });
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMessageReveal({ sceneId: scene.id, count: digitalMessages.length });
      return;
    }

    setMessageReveal({ sceneId: scene.id, count: 1 });

    const timers = digitalMessages.slice(1).map((_, index) =>
      window.setTimeout(() => {
        setMessageReveal({ sceneId: scene.id, count: index + 2 });
      }, (index + 1) * MESSAGE_DELAY_MS),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [scene.id, digitalMessages]);

  // On scene change (not first render): paper-wipe, scroll to top, move focus.
  useEffect(() => {
    const previousSceneId = lastSceneIdRef.current;
    if (previousSceneId === scene.id) return;
    lastSceneIdRef.current = scene.id;
    if (
      previousSceneId !== null &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      playWallWipe();
    }
    window.scrollTo({ top: 0, behavior: "auto" });
    articleRef.current?.focus({ preventScroll: true });
  }, [scene.id]);

  const heading = scene.title ?? "[UNTITLED SCENE]";

  // Ping as each newly rendered message starts arriving (skipped under reduced motion).
  const handleAnimationStart = (event: AnimationEvent<HTMLElement>) => {
    if (event.animationName !== "bubble-in") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    playMessagePing();
  };

  const renderedMessages = scene.messages
    ? scene.messages.slice(0, visibleMessageCount)
    : undefined;

  return (
    <main className="story" id="story">
      <div className={`story__page story__page--mood-${scene.mood ?? "digital"}`}>
        <article
          key={scene.id}
          ref={articleRef}
          className={`story__scene story__scene--${scene.type}`}
          tabIndex={-1}
          aria-labelledby="scene-heading"
          onAnimationStart={handleAnimationStart}
        >
          <h1 id="scene-heading" className="story__title">
            {heading}
          </h1>

          {narration.length > 0 ? (
            <div className="story__text">
              {narration.map((block) => (
                <p key={block.key}>
                  {block.words.map((entry) => (
                    <span
                      key={entry.delay}
                      className="story__word"
                      style={{ animationDelay: `${entry.delay}ms` }}
                    >
                      {entry.word}{" "}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          ) : null}

          {scene.message ? <MessageBubble message={scene.message} /> : null}

          {renderedMessages ? (
            <div className="story__thread">
              {renderedMessages.map((message) => (
                <div key={message.id} className="story__thread-item">
                  <MessageBubble message={message} />
                </div>
              ))}
              {scene.mood !== "tension" &&
              scene.messages &&
              scene.messages.length > 1 &&
              visibleMessageCount < scene.messages.length ? (
                <TypingCue count={scene.messages.length} />
              ) : null}
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
