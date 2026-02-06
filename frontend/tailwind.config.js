/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Light theme
        light: {
          bg: {
            primary: "#FFFFFF",
            secondary: "#F9FAFB",
            tertiary: "#F3F4F6",
          },
          text: {
            primary: "#111827",
            secondary: "#6B7280",
            tertiary: "#9CA3AF",
          },
          border: {
            light: "#E5E7EB",
            medium: "#D1D5DB",
            dark: "#9CA3AF",
          },
        },
        // Dark theme
        dark: {
          bg: {
            primary: "#030712",
            secondary: "#111827",
            tertiary: "#1F2937",
          },
          text: {
            primary: "#F9FAFB",
            secondary: "#D1D5DB",
            tertiary: "#9CA3AF",
          },
          border: {
            light: "#374151",
            medium: "#4B5563",
            dark: "#6B7280",
          },
        },
        // Accents
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
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        "display-xl": [
          "80px",
          { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "800" },
        ],
        "display-lg": [
          "64px",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" },
        ],
        "display-md": [
          "48px",
          { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" },
        ],
        "display-sm": [
          "36px",
          { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "700" },
        ],
        "heading-xl": [
          "32px",
          { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "700" },
        ],
        "heading-lg": [
          "28px",
          { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "700" },
        ],
        "heading-md": ["24px", { lineHeight: "1.4", fontWeight: "700" }],
        "heading-sm": ["20px", { lineHeight: "1.4", fontWeight: "600" }],
        "body-xl": ["20px", { lineHeight: "1.6" }],
        "body-lg": ["18px", { lineHeight: "1.6" }],
        "body-md": ["16px", { lineHeight: "1.6" }],
        "body-sm": ["14px", { lineHeight: "1.5" }],
        "body-xs": ["12px", { lineHeight: "1.5" }],
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
        "4xl": "96px",
        18: "4.5rem", // 72px nav height
      },
      boxShadow: {
        xs: "0 1px 2px rgba(0, 0, 0, 0.05)",
        sm: "0 2px 4px rgba(0, 0, 0, 0.06)",
        md: "0 4px 12px rgba(0, 0, 0, 0.08)",
        lg: "0 8px 24px rgba(0, 0, 0, 0.12)",
        xl: "0 12px 40px rgba(0, 0, 0, 0.15)",
        "2xl": "0 20px 60px rgba(0, 0, 0, 0.20)",
        blue: "0 4px 12px rgba(59, 130, 246, 0.3)",
        "blue-lg": "0 6px 16px rgba(59, 130, 246, 0.4)",
        gold: "0 8px 32px rgba(245, 158, 11, 0.3)",
      },
      borderRadius: {
        card: "20px",
        btn: "12px",
        badge: "20px",
        input: "16px",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
      maxWidth: {
        content: "1200px",
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 8s linear infinite",
        gradient: "gradient-shift 8s ease infinite",
        float: "float 6s ease-in-out infinite",
        bob: "bob 1.5s ease-in-out infinite",
        "slow-rotate": "slow-rotate 30s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0) translateX(0)",
            opacity: "0",
          },
          "10%": { opacity: "0.6" },
          "90%": { opacity: "0.6" },
          "100%": {
            transform: "translateY(-100vh) translateX(50px)",
            opacity: "0",
          },
        },
        bob: {
          "0%, 100%": { transform: "translateX(-50%) translateY(0)" },
          "50%": { transform: "translateX(-50%) translateY(-8px)" },
        },
        "slow-rotate": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};
