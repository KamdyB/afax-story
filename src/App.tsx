import { useEffect, useState } from "react";
import StoryScreen from "./components/StoryScreen";
import ThemeToggle from "./components/ThemeToggle";
import { initAudioOnFirstGesture } from "./audio";
import { START_SCENE_ID, getScene } from "./data/story";
import type { Scene } from "./data/story";

export default function App() {
  const [scene, setScene] = useState<Scene>(() => getScene(START_SCENE_ID));

  // Unlock the message-ping sound on the reader's first interaction.
  useEffect(() => initAudioOnFirstGesture(), []);

  return (
    <div className="app">
      {/* The toggle floats: it stays pinned top-right while the page scrolls. */}
      <div className="theme-dock">
        <ThemeToggle />
      </div>
      <header className="masthead">
        <p className="masthead__overline">AFAX Story · Interactive</p>
        <h1 className="masthead__wordmark">The Show That Didn’t Happen</h1>
      </header>
      <StoryScreen scene={scene} onChoice={(next) => setScene(getScene(next))} />
    </div>
  );
}
