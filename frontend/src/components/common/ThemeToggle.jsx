import React, { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [rotating, setRotating] = useState(false);

  const handleToggle = () => {
    setRotating(true);
    toggleTheme();
    setTimeout(() => setRotating(false), 300);
  };

  return (
    <button
      onClick={handleToggle}
      className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <div
        className={`transition-transform duration-300 ${rotating ? "rotate-180" : ""}`}
      >
        {theme === "light" ? (
          <Moon size={20} className="text-gray-500" />
        ) : (
          <Sun size={20} className="text-gray-400" />
        )}
      </div>
    </button>
  );
}
