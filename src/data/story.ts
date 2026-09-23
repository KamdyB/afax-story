/**
 * AFAX Story — THE SHOW THAT DIDN'T HAPPEN.
 * Data only: scene definitions and lookup. No rendering, no UI logic.
 * Factual discipline: reported events, online claims, and unknowns are
 * kept distinct. No invented statements, victims, or attributions.
 */

export type SceneType = "narrative" | "message" | "ending";

/** digital = present-day wall · tension = confrontation points. */
export type SceneMood = "digital" | "tension";

export type StoryLanguage = "en";

export type EvidenceTone =
  | "documented"
  | "supported"
  | "unsourced"
  | "interpretation"
  | "oversimplification";

export interface Choice {
  label: string;
  /** ID of the scene this choice leads to. */
  next: string;
  hint?: string | undefined;
}

export interface StoryAudio {
  /** Root-relative path, e.g. "/audio/vn01-context.mp3". May not exist yet. */
  src: string;
  language?: StoryLanguage | undefined;
  transcript?: string | undefined;
  /** Static fallback duration label shown before metadata loads. */
  durationLabel?: string | undefined;
}

export interface StoryMessage {
  id: string;
  /** Shown as a written label on channel posts; as a person otherwise. */
  sender: string;
  meta?: string | undefined;
  body: string;
  /** Presentation hint: render as a voice note. */
  voice?: boolean | undefined;
  /** Presentation hint: show a forwarded marker. */
  forwarded?: boolean | undefined;
  /** Channel post: written notice pinned to the wall, no avatar, no person. */
  channel?: boolean | undefined;
  audio?: StoryAudio | undefined;
}

export interface EvidenceItem {
  id: string;
  claim: string;
  status: string;
  tone: EvidenceTone;
  context?: string | undefined;
}

export interface ExhibitData {
  numeral: string;
  slots: string[];
}

export interface CompareData {
  leftTitle: string;
  left: string[];
  rightTitle: string;
  right: string[];
}

export interface PairItem {
  id: string;
  original: string;
  context: string;
}

export interface WallFragment {
  id: string;
  label: string;
  note: string;
}

export interface Scene {
  id: string;
  type: SceneType;
  title?: string | undefined;
  paragraphs: string[];
  /** The scene's primary message bubble. */
  message?: StoryMessage | undefined;
  /** A run of bubbles rendered in order (replies, cascades). */
  messages?: StoryMessage[] | undefined;
  evidence?: EvidenceItem[] | undefined;
  exhibit?: ExhibitData | undefined;
  compare?: CompareData | undefined;
  pairs?: PairItem[] | undefined;
  wall?: WallFragment[] | undefined;
  /** Narration that lands after the material above it. */
  afterword?: string[] | undefined;
  colophon?: string[] | undefined;
  choices?: Choice[] | undefined;
  mood?: SceneMood | undefined;
}

export const START_SCENE_ID = "the-wall";

const story: Record<string, Scene> = {
  "the-wall": {
    id: "the-wall",
    type: "narrative",
    title: "TYLA ANNOUNCES LAGOS",
    paragraphs: ["December 22.", "So she’s coming here?"],
    messages: [
      {
        id: "w1",
        sender: "@TylaOfficial",
        meta: "Tour announcement",
        body: "TYLA ANNOUNCES LAGOS — DECEMBER 22",
        channel: true,
      },
      {
        id: "w2",
        sender: "NEWS ARCHIVE",
        meta: "South Africa · Xenophobia",
        body: "Renewed xenophobic attacks against Nigerians and other African migrants reported in South Africa.",
        channel: true,
        audio: {
          src: "/audio/vn01-context.mp3",
          language: "en",
          durationLabel: "0:18",
        },
      },
      {
        id: "w3",
        sender: "Handwritten note",
        body: "So she’s coming here?",
        channel: true,
      },
    ],
    choices: [
      { label: "Open the post", next: "the-first-argument" },
    ],
    mood: "digital",
  },

  "the-first-argument": {
    id: "the-first-argument",
    type: "narrative",
    title: "The post. And what gathered around it.",
    paragraphs: [],
    messages: [
      {
        id: "p1",
        sender: "@TylaOfficial",
        meta: "Tour announcement · Dec 22",
        body: "Tyla announces a Lagos performance — December 22.",
        forwarded: true,
        channel: true,
      },
      {
        id: "p2",
        sender: "@naija_001",
        body: "After what Nigerians are going through in South Africa?",
        channel: true,
      },
      {
        id: "p3",
        sender: "@lagosvibes22",
        body: "Why should we welcome her here?",
        channel: true,
      },
      {
        id: "p4",
        sender: "@omo9ja_real",
        body: "She has a platform. She could have said something.",
        channel: true,
      },
      {
        id: "p5",
        sender: "@abujaboy_",
        body: "Not one word from her.",
        channel: true,
      },
      {
        id: "p6",
        sender: "@musicgirlng",
        body: "She’s an artist. What exactly do you want her to do?",
        channel: true,
      },
      {
        id: "p7",
        sender: "@NaijaFirst",
        body: "This isn’t about music.",
        channel: true,
      },
      {
        id: "p8",
        sender: "@justasking_",
        body: "Then what is it about?",
        channel: true,
      },
    ],
    afterword: ["No verdict is pinned. The wall holds all of it."],
    choices: [
      { label: "Follow the thread", hint: "Stay with what the wall is saying.", next: "the-silence" },
      { label: "Ask what it’s about", hint: "Someone finally asks the question.", next: "the-ask" },
      { label: "Look for her response", hint: "Search the wall for one word from her.", next: "the-silence" },
    ],
    mood: "digital",
  },

  "the-silence": {
    id: "the-silence",
    type: "narrative",
    title: "The silence.",
    paragraphs: [],
    exhibit: {
      numeral: "TYLA",
      slots: [],
    },
    afterword: [
      "Public criticism focused partly on Tyla’s lack of a public response to xenophobic attacks affecting Nigerians and other African migrants in South Africa.",
      "The criticism was of the silence — not of anything she was shown to have done.",
    ],
    choices: [{ label: "Look closer", next: "the-boycott" }],
    mood: "digital",
  },

   "the-boycott": {
    id: "the-boycott",
    type: "narrative",
    title: "The wall splits its voice.",
    paragraphs: [],
    messages: [
      {
        id: "b1",
        sender: "@NaijaFirst",
        body: "BOYCOTT TYLA",
        forwarded: true,
        channel: true,
      },
      {
        id: "b2",
        sender: "@lagosvibes22",
        body: "Don’t buy the tickets.",
        channel: true,
      },
      {
        id: "b3",
        sender: "@omo9ja_real",
        body: "This is bigger than music.",
        channel: true,
      },
      {
        id: "b4",
        sender: "@naija_001",
        body: "We have to stand for something.",
        channel: true,
      },
      {
        id: "b5",
        sender: "@mainlandgirl",
        body: "Why should she profit here while Nigerians are being attacked there?",
        channel: true,
      },
    ],
    choices: [
      { label: "Hear the pushback", hint: "Not everyone on the wall agrees.", next: "the-blame" },
      { label: "Carry it to its conclusion", hint: "Follow the boycott’s logic to the end.", next: "the-threat" },
    ],
    mood: "digital",
  },
 
    "the-ask": {
    id: "the-ask",
    type: "narrative",
    title: "Someone finally asks.",
    paragraphs: [],
    messages: [
      {
        id: "a1",
        sender: "@justasking_",
        body: "What is it about then?",
        channel: true,
      },
      {
        id: "a2",
        sender: "@NaijaFirst",
        body: "It’s about what we accept. About who answers for it.",
        channel: true,
      },
    ],
    afterword: ["The argument was never about the music."],
    choices: [{ label: "Look closer", next: "the-silence" }],
    mood: "digital",
  },

  "the-blame": {
    id: "the-blame",
    type: "narrative",
    title: "The pushback.",
    paragraphs: [],
    messages: [
      {
        id: "b6",
        sender: "@musicgirlng",
        body: "You’re blaming the wrong person.",
        channel: true,
      },
      {
        id: "b7",
        sender: "@justasking_",
        body: "Artists are not governments.",
        channel: true,
      },
      {
        id: "b8",
        sender: "@NaijaFirst",
        body: "But artists have platforms.",
        channel: true,
      },
      {
        id: "b9",
        sender: "@musicgirlng",
        body: "Then let people use that platform.",
        channel: true,
      },
    ],
    afterword: [
      "The wall is split. No side is highlighted as the answer.",
    ],
    choices: [{ label: "See what it feeds", next: "the-threat" }],
    mood: "tension",
  },


  "the-threat": {
    id: "the-threat",
    type: "message",
    title: "One message arrives alone.",
    paragraphs: [],
    message: {
      id: "t1",
      sender: "@dontplayNG",
      meta: "Reply · Lagos",
      body: "Don’t complain if anything happens to you here.",
      audio: {
        src: "/audio/vn02-reply.mp3",
        language: "en",
        durationLabel: "0:12",
      },
    },
    afterword: [
      "It began with Nigerians being attacked in South Africa.",
      "It has become: what should happen to a South African in Nigeria?",
      "VIOLENCE → ANGER → RETALIATION",
      "Then the line stops.",
    ],
    choices: [{ label: "Trace what happened", next: "the-question" }],
    mood: "tension",
  },

  "the-question": {
    id: "the-question",
    type: "narrative",
    title: "When does solidarity become collective blame?",
    paragraphs: [
      "A South African artist is not the South African government.",
      "But does sharing a nationality make someone irrelevant to the conversation?",
    ],
    choices: [{ label: "Return to the wall", next: "trace-the-claims" }],
    mood: "digital",
  },

  "trace-the-claims": {
    id: "trace-the-claims",
    type: "narrative",
    title: "Trace the claim.",
    paragraphs: [],
    evidence: [
      {
        id: "c1",
        claim: "Nigerians are being attacked in South Africa.",
        status: "Documented context",
        tone: "documented",
      },
      {
        id: "c2",
        claim: "Tyla has not publicly addressed the attacks.",
        status: "Documented criticism",
        tone: "supported",
      },
      {
        id: "c3",
        claim: "Tyla personally supports what is happening.",
        status: "Not established",
        tone: "unsourced",
      },
      {
        id: "c4",
        claim: "Every South African is responsible for what happened.",
        status: "Generalisation",
        tone: "oversimplification",
      },
      {
        id: "c5",
        claim: "No South African should perform in Nigeria.",
        status: "Position · boycott argument",
        tone: "interpretation",
        context:
          "Not fact. Not misinformation simply because someone disagrees with it.",
      },
    ],
    afterword: [
      "FACT. CLAIM. INTERPRETATION. OPINION. GENERALISATION. THREAT.",
      "Learning to tell them apart is the whole lesson.",
    ],
    choices: [{ label: "Look closer", next: "the-date-disappears" }],
    mood: "digital",
  },

  "the-date-disappears": {
    id: "the-date-disappears",
    type: "narrative",
    title: "The tour poster is still pinned.",
    paragraphs: ["Watch the date."],
    exhibit: {
      numeral: "22",
      slots: ["LAGOS", "DECEMBER"],
    },
    evidence: [
      {
        id: "d1",
        claim:
          "The Lagos stop subsequently disappeared from Tyla’s official tour itinerary amid boycott calls.",
        status: "Official explanation not publicly established",
        tone: "unsourced",
        context:
          "Neither Tyla nor her management publicly explained the change at the time. The timing is part of the story; the cause was never stated.",
      },
    ],
    choices: [{ label: "Follow the wall", next: "the-wall-splits" }],
    mood: "digital",
  },

  "the-wall-splits": {
    id: "the-wall-splits",
    type: "narrative",
    title: "Two columns. One event.",
    paragraphs: [],
    compare: {
      leftTitle: "What happened",
      left: [
        "Xenophobic attacks and anti-migrant hostility in South Africa",
        "Nigerians and other African migrants affected",
        "Anger in Nigeria",
        "Tyla’s Lagos concert announced",
        "Criticism over her silence",
        "Calls for a boycott",
        "Lagos date disappears from the public tour schedule",
      ],
      rightTitle: "What the internet added",
      right: [
        "“All South Africans”",
        "“They don’t care about us”",
        "“She represents them”",
        "“They deserve the same treatment”",
        "“Don’t complain if something happens to you”",
      ],
    },
    choices: [{ label: "Read the other side", next: "the-mirror" }],
    mood: "digital",
  },

  "the-mirror": {
    id: "the-mirror",
    type: "narrative",
    title: "The wall flips.",
    paragraphs: [],
    messages: [
      {
        id: "m1",
        sender: "@mzansi_view",
        body: "Nigerians don’t want South Africans here.",
        channel: true,
      },
      {
        id: "m2",
        sender: "@jozi_musicfan",
        body: "Boycott South African artists.",
        channel: true,
      },
      {
        id: "m3",
        sender: "@soweto_says",
        body: "They hate us.",
        channel: true,
      },
      {
        id: "m4",
        sender: "@capeobserver",
        body: "Why should we support Nigerians?",
        channel: true,
      },
      {
        id: "m5",
        sender: "@common_sense_sa",
        body: "Wait.",
        channel: true,
      },
    ],
    afterword: [
      "One country’s grievance becomes another country’s evidence.",
      "Then another. Then another.",
    ],
    choices: [{ label: "See the mechanism", next: "the-cycle" }],
    mood: "tension",
  },

  "the-cycle": {
    id: "the-cycle",
    type: "narrative",
    title: "The wall fills — not with violence. With words.",
    paragraphs: [],
    exhibit: {
      numeral: "↻",
      slots: ["ATTACK", "ANGER", "GENERALISE", "RETALIATE", "REPEAT"],
    },
    afterword: [
      "The last arrow points back to the first word.",
      "Someone has to stop forwarding the cycle.",
    ],
    choices: [{ label: "Break the cycle", next: "final-interaction" }],
    mood: "tension",
  },

  "final-interaction": {
    id: "final-interaction",
    type: "narrative",
    title: "The original post, annotated.",
    paragraphs: [
      "Pin each word to read what it was being made to carry.",
    ],
    wall: [
      {
        id: "g1",
        label: "Nigerians",
        note: "A national identity.",
      },
      {
        id: "g2",
        label: "South Africans",
        note: "A national identity.",
      },
      {
        id: "g3",
        label: "Tyla",
        note: "An individual person.",
      },
      {
        id: "g4",
        label: "Xenophobia",
        note: "Hostility or prejudice toward people perceived as foreigners.",
      },
      {
        id: "g5",
        label: "Boycott",
        note:
          "A collective decision not to support a person, product or event as a form of protest.",
      },
      {
        id: "g6",
        label: "Threat",
        note: "Something different.",
      },
    ],
    afterword: ["The words were being collapsed into one another."],
    choices: [{ label: "Listen", next: "final-voice-note" }],
    mood: "digital",
  },

  "final-voice-note": {
    id: "final-voice-note",
    type: "message",
    title: "A voice note, pinned last.",
    paragraphs: [],
    message: {
      id: "v1",
      sender: "The wall",
      body: "Maybe the hardest part is that the anger wasn’t invented. People were genuinely hurt. People genuinely wanted somebody to say something. But somewhere between the first post and the hundredth forward, the person disappeared. Tyla became South Africa. South Africa became every South African. And a real grievance became permission to blame people who weren’t there. That is how a border enters a conversation. And that is how a conversation can become another border.",
      audio: {
        src: "/audio/vn04-final.mp3",
        language: "en",
        durationLabel: "0:45",
      },
    },
    choices: [{ label: "Return to the wall", next: "final-wall" }],
    mood: "digital",
  },

  "final-wall": {
    id: "final-wall",
    type: "ending",
    title: "A real grievance. A real person. A digital crowd. A choice.",
    paragraphs: [
      "You cannot undo what happened by pretending it didn’t.",
      "But you can choose what happens next.",
    ],
    afterword: ["VERIFY. TRACE. LISTEN. BEFORE YOU FORWARD."],
    colophon: [
      "AFAX-P",
      "Digital Storytelling for Peacebuilding",
      "Social-media posts shown in this experience are reconstructed composites inspired by public discourse.",
      "The Show That Didn’t Happen",
      "How a real grievance became a cross-border argument",
    ],
    choices: [
      {
        label: "Start over",
        hint: "Walk the wall again. Explore the other choices.",
        next: "the-wall",
      },
    ],
  },
};

/** Returns the scene for an ID, falling back to the start scene. */
export function getScene(id: string): Scene {
  return story[id] ?? story[START_SCENE_ID];
}

