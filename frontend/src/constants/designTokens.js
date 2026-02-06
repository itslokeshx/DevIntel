/**
 * Design Tokens
 * Centralized design system constants for spacing, typography, colors, and breakpoints
 */

export const SPACING = {
    xs: '0.5rem',    // 8px
    sm: '1rem',      // 16px
    md: '1.5rem',    // 24px
    lg: '2rem',      // 32px
    xl: '3rem',      // 48px
    '2xl': '4rem',   // 64px
    '3xl': '6rem',   // 96px
};

export const TYPOGRAPHY = {
    h1: {
        size: '4rem',        // 64px
        weight: 'bold',
        lineHeight: '1.2',
        letterSpacing: '-0.02em'
    },
    h2: {
        size: '2.25rem',     // 36px
        weight: 'bold',
        lineHeight: '1.3',
        letterSpacing: '-0.01em'
    },
    h3: {
        size: '1.5rem',      // 24px
        weight: '600',
        lineHeight: '1.4',
        letterSpacing: '0'
    },
    body: {
        size: '1.125rem',    // 18px
        weight: 'normal',
        lineHeight: '1.6',
        letterSpacing: '0'
    },
    small: {
        size: '0.875rem',    // 14px
        weight: 'normal',
        lineHeight: '1.5',
        letterSpacing: '0'
    },
    tiny: {
        size: '0.75rem',     // 12px
        weight: 'normal',
        lineHeight: '1.4',
        letterSpacing: '0.01em'
    }
};

export const COLORS = {
    light: {
        bg: '#ffffff',
        surface: '#f9fafb',      // gray-50
        surfaceAlt: '#e5e7eb',   // gray-200
        border: '#e5e7eb',
        text: {
            primary: '#111827',    // gray-900
            secondary: '#6b7280',  // gray-500
            tertiary: '#9ca3af'    // gray-400
        }
    },
    dark: {
        bg: '#030712',           // gray-950
        surface: '#111827',      // gray-900
        surfaceAlt: '#1f2937',   // gray-800
        border: '#1f2937',
        text: {
            primary: '#f9fafb',    // gray-50
            secondary: '#d1d5db',  // gray-300
            tertiary: '#9ca3af'    // gray-400
        }
    },
    semantic: {
        success: {
            main: '#10b981',       // green-500
            light: '#34d399',      // green-400
            dark: '#059669'        // green-600
        },
        warning: {
            main: '#f59e0b',       // amber-500
            light: '#fbbf24',      // amber-400
            dark: '#d97706'        // amber-600
        },
        error: {
            main: '#ef4444',       // red-500
            light: '#f87171',      // red-400
            dark: '#dc2626'        // red-600
        },
        info: {
            main: '#3b82f6',       // blue-500
            light: '#60a5fa',      // blue-400
            dark: '#2563eb'        // blue-600
        }
    }
};

export const BREAKPOINTS = {
    mobile: '0px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px'
};

export const LAYOUT = {
    maxWidth: '1280px',
    componentPadding: '2rem',    // p-8
    sectionGap: '3rem',          // gap-12
    cardPadding: '1.5rem',       // p-6
    touchTarget: '44px'          // Minimum touch target size
};

export const ANIMATION = {
    duration: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms'
    },
    easing: {
        default: 'cubic-bezier(0.4, 0, 0.2, 1)',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        inOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
};
