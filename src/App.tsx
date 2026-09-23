import { useState } from "react";
import { getScene, START_SCENE_ID } from "./data/story";
import StoryScreen from "./components/StoryScreen";
import ThemeToggle from "./components/ThemeToggle";

export default function App() {
  const [scene, setScene] = useState(() => getScene(START_SCENE_ID));

  const handleChoice = (nextSceneId: string) => {
    setScene(getScene(nextSceneId));
  };

  // Confrontation points on the wall shift the environment darker.
  const isTension = scene.mood === "tension";

  return (
    <div className={`app${isTension ? " app--tension" : ""}`}>
      <header className="masthead">
        <div className="masthead__inner">
          <div className="masthead__identity">
            <p className="masthead__overline">
              How a real grievance became a cross-border argument
            </p>
            <p className="masthead__wordmark">THE SHOW THAT DIDN’T HAPPEN</p>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <StoryScreen scene={scene} onChoice={handleChoice} />
    </div>
  );
}
