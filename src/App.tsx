import { useState } from "react";
import StoryScreen from "./components/StoryScreen";
import WallNav from "./components/WallNav";
import { START_SCENE_ID, getScene } from "./data/story";
import type { Scene } from "./data/story";

export default function App() {
  const [scene, setScene] = useState<Scene>(() => getScene(START_SCENE_ID));

  return (
    <>
      <WallNav />
      <header className="masthead">
        <p className="masthead__overline">AFAX Story · Interactive</p>
        <h1 className="masthead__wordmark">The Show That Didn’t Happen</h1>
      </header>
      <StoryScreen scene={scene} onChoice={(next) => setScene(getScene(next))} />
    </>
  );
}
