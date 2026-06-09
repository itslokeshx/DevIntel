import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Swords, Home } from "lucide-react";
import { ThemeToggle } from "../common/ThemeToggle";

export function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-[1000] glass border-b border-[var(--border-subtle)]">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-12 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
          onClick={() => setMobileOpen(false)}
        >
          <div className="w-6 h-6 rounded-lg bg-[var(--text-primary)] flex items-center justify-center">
            <span className="text-[10px] font-black text-[var(--bg-primary)] leading-none tracking-tight">DI</span>
          </div>
          <span className="text-[15px] font-semibold text-[var(--text-primary)]">
            DevIntel
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" active={isActive("/")}>
            Home
          </NavLink>
          <NavLink to="/compare" active={isActive("/compare")}>
            Compare
          </NavLink>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-primary)]">
          <nav className="max-w-content mx-auto px-4 py-2 space-y-0.5">
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
              Compare
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
      className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
        active
          ? "text-[var(--text-primary)] bg-[var(--surface-hover)]"
          : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, active, icon, onClick, children }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
        active
          ? "text-[var(--text-primary)] bg-[var(--surface-hover)]"
          : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
      }`}
    >
      {icon}
      {children}
    </Link>
  );
}
