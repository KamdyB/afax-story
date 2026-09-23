# THE SHOW THAT DIDN'T HAPPEN

### An interactive digital story about how a real grievance can cross a border, change shape online, and become collective hostility.

**AfAX-P 2026 — Digital Storytelling for Peacebuilding**

> **A real grievance. A real person. A digital crowd. A choice.**

---

## ▶ ENTER THE STORY

**[OPEN THE EXPERIENCE →](https://kamdyb.github.io/afax-story/)**

Put on headphones if you can.

Read slowly.

Click when something catches your attention.

Your choices change which voices you meet on the wall, and every path ends at the same question.

---

## THE QUESTION

What happens when a legitimate grievance becomes attached to nationality?

A public controversy begins with a real issue.

Then the internet starts moving it.

A person becomes a nationality.

A nationality becomes a crowd.

A crowd becomes a threat.

And eventually, the original person can disappear completely.

**The Show That Didn't Happen** explores that transformation through an interactive wall of posts, evidence, commentary, voice notes and reconstructed online conversations.

---

## WHAT YOU'RE LOOKING AT

This is not a traditional linear story.

The interface is a **living wall**.

As you interact with it:

```text
ANNOUNCEMENT
     ↓
PUBLIC REACTION
     ↓
CRITICISM
     ↓
BOYCOTT
     ↓
THREAT
     ↓
COLLECTIVE BLAME
     ↓
THE MIRROR
     ↓
RECONSIDERATION
```

The same conversation is eventually seen from across the border.

The point is not to decide which nationality is "right".

The point is to notice **how information changes when responsibility, identity and context collapse into one another.**

---

## MEDIA & INFORMATION LITERACY

Throughout the story, the viewer is invited to distinguish between:

| Type               | What it asks                                    |
| ------------------ | ----------------------------------------------- |
| **FACT**           | What can be established?                        |
| **CLAIM**          | What is someone saying happened?                |
| **INTERPRETATION** | What meaning is being assigned to it?           |
| **OPINION**        | What does someone think?                        |
| **GENERALISATION** | Who is being made to represent an entire group? |
| **THREAT**         | When does language move toward harm?            |

The experience deliberately leaves room for uncertainty.

Not everything on the wall deserves the same level of trust.

---

## WHY TYLA?

The story uses the recent Tyla/Lagos controversy as its entry point because it is recognisable, contemporary and connected to a wider conversation about xenophobia, responsibility, public figures and cross-border tensions.

**The story is not an accusation against Tyla.**

It does not claim that she participated in xenophobic attacks.

Instead, it examines the public criticism surrounding her response to xenophobia concerns, the resulting boycott debate, and the way online discussion can move from criticism of an individual toward collective assumptions about nationality.

The larger subject is **not Tyla**.

The larger subject is what happens to a grievance when thousands of people begin forwarding, interpreting and generalising it.

---

## THE WALL

The visual language is intentional.

Instead of conventional scene cards, the story is presented as a physical/digital wall:

* pinned evidence
* social-media posts
* newspaper fragments
* handwritten observations
* voice notes
* screenshots
* annotations
* traces of previous conversations

---

## 🎙 VOICE NOTES

The story includes short voice-note reflections.

They are intentionally closer to a personal audio diary than formal documentary narration.

The voice notes ask:

> What did I think I knew?

> What actually happened?

> What did the internet add?

> When did a person become a nationality?

> And what happens when the same language crosses the border?

---

## ⚠️ ABOUT THE SOCIAL-MEDIA POSTS

Some social-media posts in the experience are **reconstructed composites** created for storytelling.

They represent patterns of public discourse rather than claiming to reproduce posts from specific private individuals.

The distinction between documented context and reconstructed material is part of the project's Media & Information Literacy approach.

---

## THE CORE IDEA

A grievance can be real.

A criticism can be legitimate.

A boycott can be peaceful.

And a generalisation can still be harmful.

Those things can exist at the same time.

The story asks the viewer to notice the moment where:

```text
ACCOUNTABILITY
      ↓
IDENTITY
      ↓
GENERALISATION
      ↓
COLLECTIVE BLAME
```

---

## BUILT WITH

**Frontend**

* React
* TypeScript
* Vite
* CSS

**Deployment**

* GitHub Pages
* GitHub Actions

**Media**

* Original voice recordings
* Reconstructed social-media material
* Editorial/storytelling assets

---

## PROJECT STRUCTURE

```text
afax-story/
│
├── public/
│   └── audio/
│       └── voice notes
│
├── src/
│   ├── components/
│   │   ├── ChoiceButton.tsx
│   │   ├── MessageBubble.tsx
│   │   └── StoryScreen.tsx
│   │
│   ├── data/
│   │   └── story.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── index.html
├── package.json
└── vite.config.ts
```

---

## RUN LOCALLY

Clone the repository:

```bash
git clone https://github.com/KamdyB/afax-story.git
cd afax-story
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## DEPLOYMENT

The production site is deployed automatically to GitHub Pages whenever the `main` branch is updated.

```text
Git push
   ↓
GitHub Actions
   ↓
npm ci
   ↓
npm run build
   ↓
dist/
   ↓
GitHub Pages
   ↓
PUBLIC STORY
```

---

## CREDITS

**Created by:**
Wosu-Ezi Kamdirichukwu Blossom

**Project:**
The Show That Didn't Happen

**Programme:**
AfAX-P — Digital Storytelling for Peacebuilding

**Year:**
2026

---

## ONE LAST THING

Don't just ask:

> **"What happened?"**

Ask:

> **"What was added between what happened and what I was told happened?"**

**VERIFY. TRACE. LISTEN. BEFORE YOU FORWARD.**
