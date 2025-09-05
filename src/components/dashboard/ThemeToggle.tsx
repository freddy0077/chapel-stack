import React from "react";

export const ThemeToggle = () => {
  // Simple theme toggle using Tailwind's 'dark' class
  const setTheme = (theme: "light" | "dark" | "system") => {
    if (theme === "system") {
      document.documentElement.classList.remove("dark");
      localStorage.removeItem("theme");
    } else {
      document.documentElement.classList.toggle("dark", theme === "dark");
      localStorage.setItem("theme", theme);
    }
  };
  return (
    <div className="flex gap-1 items-center" aria-label="Theme toggle">
      <button
        className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-xs"
        onClick={() => setTheme("light")}
        aria-label="Light mode"
      >
        🌞
      </button>
      <button
        className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-xs"
        onClick={() => setTheme("dark")}
        aria-label="Dark mode"
      >
        🌚
      </button>
      <button
        className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-xs"
        onClick={() => setTheme("system")}
        aria-label="System mode"
      >
        🖥️
      </button>
    </div>
  );
};

export default ThemeToggle;
