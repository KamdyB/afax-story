import { useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

const STORAGE_KEY = "afax-theme";
const FLIP_OUT_MS = 380;
const FLIP_IN_MS = 440;

function getInitialTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
                  ?.setAttribute("content", theme === "dark" ? "#221413" : "#5e2b20");
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* storage unavailable — theme still applies for the session */
    }
  }, [theme]);

  // Clear any in-flight flip timers on unmount.
  useEffect(
    () => () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    },
    [],
  );

  const handleToggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";

    // Reduced motion: swap immediately, no flip sequence, no dead delay.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTheme(next);
      return;
    }
    if (timersRef.current.length > 0) return; // a flip is already running

    document.documentElement.dataset.flip = "out";
    const swap = window.setTimeout(() => {
      setTheme(next);
      document.documentElement.dataset.flip = "in";
      const settle = window.setTimeout(() => {
        delete document.documentElement.dataset.flip;
        timersRef.current = [];
      }, FLIP_IN_MS);
      timersRef.current = [settle];
    }, FLIP_OUT_MS);
    timersRef.current = [swap];
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={handleToggle}
    >
      <Sun className="theme-toggle__icon theme-toggle__icon--sun" size={17} strokeWidth={1.75} aria-hidden="true" />
      <Moon className="theme-toggle__icon theme-toggle__icon--moon" size={17} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
