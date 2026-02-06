/**
 * Design Tokens - DevIntel Premium Design System
 * The World's Most Premium Developer Intelligence Platform
 */

export const SPACING = {
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "1rem", // 16px
  lg: "1.5rem", // 24px
  xl: "2rem", // 32px
  "2xl": "3rem", // 48px
  "3xl": "4rem", // 64px
  "4xl": "6rem", // 96px
};

export const TYPOGRAPHY = {
  "display-xl": {
    size: "5rem",
    weight: "800",
    lineHeight: "1.05",
    letterSpacing: "-0.02em",
  },
  "display-lg": {
    size: "4rem",
    weight: "800",
    lineHeight: "1.1",
    letterSpacing: "-0.02em",
  },
  "display-md": {
    size: "3rem",
    weight: "700",
    lineHeight: "1.2",
    letterSpacing: "-0.01em",
  },
  "display-sm": {
    size: "2.25rem",
    weight: "700",
    lineHeight: "1.3",
    letterSpacing: "-0.01em",
  },
  "heading-xl": {
    size: "2rem",
    weight: "700",
    lineHeight: "1.3",
    letterSpacing: "-0.01em",
  },
  "heading-lg": {
    size: "1.75rem",
    weight: "700",
    lineHeight: "1.3",
    letterSpacing: "-0.01em",
  },
  "heading-md": {
    size: "1.5rem",
    weight: "700",
    lineHeight: "1.4",
    letterSpacing: "0",
  },
  "heading-sm": {
    size: "1.25rem",
    weight: "600",
    lineHeight: "1.4",
    letterSpacing: "0",
  },
  "body-xl": {
    size: "1.25rem",
    weight: "400",
    lineHeight: "1.6",
    letterSpacing: "0",
  },
  "body-lg": {
    size: "1.125rem",
    weight: "400",
    lineHeight: "1.6",
    letterSpacing: "0",
  },
  "body-md": {
    size: "1rem",
    weight: "400",
    lineHeight: "1.6",
    letterSpacing: "0",
  },
  "body-sm": {
    size: "0.875rem",
    weight: "400",
    lineHeight: "1.5",
    letterSpacing: "0",
  },
  "body-xs": {
    size: "0.75rem",
    weight: "400",
    lineHeight: "1.5",
    letterSpacing: "0",
  },
};

export const COLORS = {
  light: {
    bg: { primary: "#FFFFFF", secondary: "#F9FAFB", tertiary: "#F3F4F6" },
    border: { light: "#E5E7EB", medium: "#D1D5DB", dark: "#9CA3AF" },
    text: { primary: "#111827", secondary: "#6B7280", tertiary: "#9CA3AF" },
  },
  dark: {
    bg: { primary: "#030712", secondary: "#111827", tertiary: "#1F2937" },
    border: { light: "#374151", medium: "#4B5563", dark: "#6B7280" },
    text: { primary: "#F9FAFB", secondary: "#D1D5DB", tertiary: "#9CA3AF" },
  },
  accent: {
    blue: "#3B82F6",
    "blue-dark": "#2563EB",
    "blue-light": "#60A5FA",
    purple: "#8B5CF6",
    "purple-dark": "#7C3AED",
    "purple-light": "#A78BFA",
    pink: "#EC4899",
    "pink-dark": "#DB2777",
    "pink-light": "#F472B6",
    green: "#10B981",
    "green-dark": "#059669",
    "green-light": "#34D399",
    orange: "#F59E0B",
    "orange-dark": "#D97706",
    "orange-light": "#FBBF24",
    red: "#EF4444",
    "red-dark": "#DC2626",
    "red-light": "#F87171",
  },
};

export const SHADOWS = {
  xs: "0 1px 2px rgba(0, 0, 0, 0.05)",
  sm: "0 2px 4px rgba(0, 0, 0, 0.06)",
  md: "0 4px 12px rgba(0, 0, 0, 0.08)",
  lg: "0 8px 24px rgba(0, 0, 0, 0.12)",
  xl: "0 12px 40px rgba(0, 0, 0, 0.15)",
  "2xl": "0 20px 60px rgba(0, 0, 0, 0.20)",
};

export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
};

export const LAYOUT = {
  maxWidth: "1200px",
  navHeight: "72px",
  profileBarHeight: "64px",
  touchTarget: "44px",
  containerPadding: "48px",
};

export const ANIMATION = {
  duration: {
    instant: "100ms",
    fast: "200ms",
    normal: "300ms",
    slow: "500ms",
    slower: "800ms",
    slowest: "1000ms",
  },
  easing: {
    linear: "linear",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
};

export const LANGUAGE_COLORS = {
  JavaScript: "#F7DF1E",
  TypeScript: "#3178C6",
  Python: "#3776AB",
  Java: "#B07219",
  Go: "#00ADD8",
  Rust: "#DEA584",
  Ruby: "#CC342D",
  "C++": "#F34B7D",
  C: "#A8B9CC",
  "C#": "#239120",
  PHP: "#4F5D95",
  Swift: "#FA7343",
  Kotlin: "#7F52FF",
  Dart: "#0175C2",
  HTML: "#E34C26",
  CSS: "#563D7C",
  Shell: "#89E051",
  "Jupyter Notebook": "#DA5B0B",
  Vue: "#41B883",
  Svelte: "#FF3E00",
};
