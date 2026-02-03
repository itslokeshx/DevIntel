import React from 'react';
import { Link } from 'react-router-dom';
import { Code2 } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

export function Header() {
    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-dark-bg-primary/80 backdrop-blur-md border-b border-light-border dark:border-dark-border transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 group-hover:shadow-lg group-hover:shadow-indigo-500/20 transition-all duration-300">
                            <Code2 className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                            DevIntel
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-white/5"
                        >
                            Home
                        </Link>
                        <Link
                            to="/compare"
                            className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-white/5"
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
