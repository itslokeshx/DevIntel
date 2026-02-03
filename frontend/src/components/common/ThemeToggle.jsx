import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-btn hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary transition-colors"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? (
                <Moon size={20} className="text-light-text-secondary dark:text-dark-text-secondary" />
            ) : (
                <Sun size={20} className="text-light-text-secondary dark:text-dark-text-secondary" />
            )}
        </button>
    );
}
