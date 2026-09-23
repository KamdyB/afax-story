import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

/** Strip that pins itself to the top after the reader scrolls past the masthead. */
export default function WallNav() {
  const [visible, setVisible] = useState(false);

  // State changes only inside the scroll callback — no synchronous setState.
  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 420);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`wall-nav${visible ? " wall-nav--visible" : ""}`} aria-hidden={!visible}>
      <span className="wall-nav__label">THE WALL</span>
      <ThemeToggle />
    </div>
  );
}
