import React from 'react';
import { Link } from 'react-router-dom';
import { Code2 } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

export function Header() {
    return (
        <header className="sticky top-0 z-50 bg-light-bg-primary/95 dark:bg-dark-bg-primary/95 backdrop-blur-sm border-b border-light-border dark:border-dark-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                        <Code2 className="h-8 w-8 text-accent-primary dark:text-accent-primary-dark" />
                        <span className="text-h3 font-bold text-light-text-primary dark:text-dark-text-primary">
                            DevIntel
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className="text-body text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            to="/compare"
                            className="text-body text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
                        >
                            Compare
                        </Link>
                    </nav>

                    {/* Theme Toggle */}
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
