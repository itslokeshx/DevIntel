import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Zap, Menu, X, Swords, Home } from "lucide-react";
import { ThemeToggle } from "../common/ThemeToggle";

export function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-[1000] glass border-b border-black/[0.06] dark:border-white/[0.06]">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-12 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group transition-transform duration-200 hover:scale-[1.02]"
          onClick={() => setMobileOpen(false)}
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-blue transition-shadow duration-200">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900 dark:text-white">
            DevIntel
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" active={isActive("/")}>
            Home
          </NavLink>
          <NavLink to="/compare" active={isActive("/compare")}>
            Compare
          </NavLink>
        </nav>

        {/* Right side: Theme Toggle + Mobile Hamburger */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200/60 dark:border-gray-800/60 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl">
          <nav className="max-w-content mx-auto px-4 py-3 space-y-1">
            <MobileNavLink
              to="/"
              active={isActive("/")}
              icon={<Home className="w-4 h-4" />}
              onClick={() => setMobileOpen(false)}
            >
              Home
            </MobileNavLink>
            <MobileNavLink
              to="/compare"
              active={isActive("/compare")}
              icon={<Swords className="w-4 h-4" />}
              onClick={() => setMobileOpen(false)}
            >
              Compare Developers
            </MobileNavLink>
          </nav>
        </div>
      )}
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

function MobileNavLink({ to, active, icon, onClick, children }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 ${
        active
          ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
          : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
      }`}
    >
      {icon}
      {children}
    </Link>
  );
}
