/**
 * AFAX Story — story data.
 * Data only: scene definitions and lookup. No rendering, no UI logic.
 * All copy is placeholder text; the story will be written later.
 */

export type SceneType = "narrative" | "message" | "ending";

export interface Choice {
  label: string;
  /** ID of the scene this choice leads to. */
  next: string;
  /** Optional secondary line shown under the label. */
  hint?: string | undefined;
}

export interface StoryMessage {
  sender: string;
  /** Optional meta line, e.g. timestamp or "voice note". */
  meta?: string | undefined;
  body: string;
}

export interface Scene {
  id: string;
  type: SceneType;
  /** Small overline rendered above the title. */
  kicker?: string | undefined;
  title?: string | undefined;
  paragraphs: string[];
  /** Message/voice-note content for `message` scenes. */
  message?: StoryMessage | undefined;
  choices?: Choice[] | undefined;
}

export const START_SCENE_ID = "landing";

const story: Record<string, Scene> = {
  landing: {
    id: "landing",
    type: "narrative",
    kicker: "[PLACEHOLDER: CHAPTER 01]",
    title: "[PLACEHOLDER: OPENING]",
    paragraphs: [
      "[PLACEHOLDER: OPENING PARAGRAPH ONE]",
      "[PLACEHOLDER: OPENING PARAGRAPH TWO]",
    ],
    choices: [{ label: "[PLACEHOLDER: BEGIN]", next: "message-received" }],
  },
  "message-received": {
    id: "message-received",
    type: "message",
    kicker: "[PLACEHOLDER: CHAPTER 02]",
    title: "[PLACEHOLDER: MESSAGE RECEIVED]",
    paragraphs: ["[PLACEHOLDER: CONTEXT — A MESSAGE ARRIVES]"],
    message: {
      sender: "[PLACEHOLDER: SENDER]",
      meta: "[PLACEHOLDER: VOICE NOTE / DURATION]",
      body: "[PLACEHOLDER: UNOPENED MESSAGE PREVIEW]",
    },
    choices: [{ label: "[PLACEHOLDER: OPEN MESSAGE]", next: "message-opened" }],
  },
  "message-opened": {
    id: "message-opened",
    type: "message",
    kicker: "[PLACEHOLDER: CHAPTER 03]",
    title: "[PLACEHOLDER: MESSAGE OPENED]",
    paragraphs: ["[PLACEHOLDER: REACTION TO OPENED MESSAGE]"],
    message: {
      sender: "[PLACEHOLDER: SENDER]",
      meta: "[PLACEHOLDER: TIMESTAMP]",
      body: "[PLACEHOLDER: FULL MESSAGE CONTENT]",
    },
    choices: [
      { label: "[PLACEHOLDER: DECIDE WHAT TO DO]", next: "first-choice" },
    ],
  },
  "first-choice": {
    id: "first-choice",
    type: "narrative",
    kicker: "[PLACEHOLDER: CHAPTER 04]",
    title: "[PLACEHOLDER: FIRST CHOICE]",
    paragraphs: ["[PLACEHOLDER: THE DECISION IS YOURS]"],
    choices: [
      {
        label: "[PLACEHOLDER: FORWARD]",
        hint: "[PLACEHOLDER: SHARE IT ON WITHOUT CHECKING]",
        next: "forward-branch",
      },
      {
        label: "[PLACEHOLDER: VERIFY]",
        hint: "[PLACEHOLDER: PAUSE AND CHECK FIRST]",
        next: "verify-branch",
      },
      {
        label: "[PLACEHOLDER: IGNORE]",
        hint: "[PLACEHOLDER: LEAVE IT UNREAD]",
        next: "ignore-branch",
      },
    ],
  },
  "forward-branch": {
    id: "forward-branch",
    type: "narrative",
    kicker: "[PLACEHOLDER: CHAPTER 05]",
    title: "[PLACEHOLDER: FORWARD BRANCH]",
    paragraphs: ["[PLACEHOLDER: CONSEQUENCES OF FORWARDING]"],
    choices: [{ label: "[PLACEHOLDER: CONTINUE]", next: "human-story" }],
  },
  "verify-branch": {
    id: "verify-branch",
    type: "narrative",
    kicker: "[PLACEHOLDER: CHAPTER 06]",
    title: "[PLACEHOLDER: VERIFY BRANCH]",
    paragraphs: ["[PLACEHOLDER: WHAT CHECKING REVEALS]"],
    choices: [{ label: "[PLACEHOLDER: CONTINUE]", next: "human-story" }],
  },
  "ignore-branch": {
    id: "ignore-branch",
    type: "narrative",
    kicker: "[PLACEHOLDER: CHAPTER 07]",
    title: "[PLACEHOLDER: IGNORE BRANCH]",
    paragraphs: ["[PLACEHOLDER: CONSEQUENCES OF LOOKING AWAY]"],
    choices: [{ label: "[PLACEHOLDER: CONTINUE]", next: "human-story" }],
  },
  "human-story": {
    id: "human-story",
    type: "narrative",
    kicker: "[PLACEHOLDER: CHAPTER 08]",
    title: "[PLACEHOLDER: HUMAN STORY]",
    paragraphs: [
      "[PLACEHOLDER: THE PERSON BEHIND THE RUMOUR]",
      "[PLACEHOLDER: ALL THREE BRANCHES CONVERGE HERE]",
    ],
    choices: [{ label: "[PLACEHOLDER: CONTINUE]", next: "second-choice" }],
  },
  "second-choice": {
    id: "second-choice",
    type: "narrative",
    kicker: "[PLACEHOLDER: CHAPTER 09]",
    title: "[PLACEHOLDER: SECOND CHOICE]",
    paragraphs: ["[PLACEHOLDER: A SECOND DECISION]"],
    choices: [
      {
        label: "[PLACEHOLDER: RESPOND]",
        hint: "[PLACEHOLDER: ENGAGE DIRECTLY]",
        next: "revelation",
      },
      {
        label: "[PLACEHOLDER: STEP BACK]",
        hint: "[PLACEHOLDER: KEEP YOUR DISTANCE]",
        next: "revelation",
      },
    ],
  },
  revelation: {
    id: "revelation",
    type: "narrative",
    kicker: "[PLACEHOLDER: CHAPTER 10]",
    title: "[PLACEHOLDER: REVELATION]",
    paragraphs: ["[PLACEHOLDER: WHAT IS ACTUALLY TRUE]"],
    choices: [{ label: "[PLACEHOLDER: CONTINUE]", next: "reflection" }],
  },
  reflection: {
    id: "reflection",
    type: "narrative",
    kicker: "[PLACEHOLDER: CHAPTER 11]",
    title: "[PLACEHOLDER: REFLECTION]",
    paragraphs: ["[PLACEHOLDER: WHAT THIS ASKS OF THE READER]"],
    choices: [{ label: "[PLACEHOLDER: CONTINUE]", next: "ending" }],
  },
  ending: {
    id: "ending",
    type: "ending",
    kicker: "[PLACEHOLDER: CHAPTER 12]",
    title: "[PLACEHOLDER: ENDING]",
    paragraphs: ["[PLACEHOLDER: CLOSING SCENE — SINGLE SHARED ENDING]"],
    choices: [{ label: "[PLACEHOLDER: START AGAIN]", next: START_SCENE_ID }],
  },
};

/**
 * Look up a scene by ID, falling back to the start scene so a bad
 * `next` ID can never crash the app. Warns in development only.
 */
export function getScene(id: string): Scene {
  const scene = story[id];
  if (scene !== undefined) {
    return scene;
  }
  if (import.meta.env.DEV) {
    console.warn(`[story] Unknown scene id "${id}". Falling back to "${START_SCENE_ID}".`);
  }
  const fallback = story[START_SCENE_ID];
  if (fallback === undefined) {
    throw new Error(`[story] Missing start scene "${START_SCENE_ID}".`);
  }
  return fallback;
}
