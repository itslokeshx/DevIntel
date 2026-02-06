import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Zap } from "lucide-react";
import { ThemeToggle } from "../common/ThemeToggle";

export function Header() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-[1000] h-[72px] glass border-b border-black/[0.06] dark:border-white/[0.06]">
      <div className="max-w-content mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group transition-transform duration-200 hover:scale-[1.02]"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-blue transition-shadow duration-200">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900 dark:text-white">
            DevIntel
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" active={isActive("/")}>
            Home
          </NavLink>
          <NavLink to="/compare" active={isActive("/compare")}>
            Compare
          </NavLink>
        </nav>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`relative text-[15px] font-medium transition-colors duration-200 py-1 ${
        active
          ? "text-gray-900 dark:text-white"
          : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      }`}
    >
      {children}
      {active && (
        <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
      )}
    </Link>
  );
}
