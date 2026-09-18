import { useState } from "react";
import { getScene, START_SCENE_ID } from "./data/story";
import StoryScreen from "./components/StoryScreen";

export default function App() {
  const [sceneId, setSceneId] = useState(START_SCENE_ID);
  const scene = getScene(sceneId);

  return (
    <div className="app">
      <a className="skip-link" href="#story">
        Skip to story
      </a>
      <header className="masthead">
        <p className="masthead__brand">AFAX Story</p>
        <p className="masthead__tag">[PLACEHOLDER: SUBTITLE]</p>
      </header>
      <StoryScreen scene={scene} onChoice={setSceneId} />
      <footer className="colophon">
        <p>[PLACEHOLDER: COLOPHON]</p>
      </footer>
    </div>
  );
}
