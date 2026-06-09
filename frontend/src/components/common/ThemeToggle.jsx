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
      className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <div
        className={`transition-transform duration-200 ${rotating ? "rotate-180" : ""}`}
      >
        {theme === "light" ? (
          <Moon size={15} />
        ) : (
          <Sun size={15} />
        )}
      </div>
    </button>
  );
}
