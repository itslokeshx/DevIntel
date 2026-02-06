/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Light theme
                light: {
                    bg: {
                        primary: '#FFFFFF',
                        secondary: '#F8F9FA',
                        tertiary: '#F3F4F6'
                    },
                    text: {
                        primary: '#1A1A1A',
                        secondary: '#6B7280'
                    },
                    border: '#E5E7EB'
                },
                // Dark theme
                dark: {
                    bg: {
                        primary: '#0D1117',
                        secondary: '#161B22',
                        tertiary: '#1F2937'
                    },
                    text: {
                        primary: '#E6EDF3',
                        secondary: '#8B949E'
                    },
                    border: '#30363D'
                },
                // Accents
                accent: {
                    primary: '#2563EB',
                    'primary-dark': '#3B82F6',
                    secondary: '#10B981',
                    'secondary-dark': '#34D399',
                    warning: '#F59E0B',
                    error: '#EF4444'
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace']
            },
            fontSize: {
                'hero': '48px',
                'h1': '36px',
                'h2': '24px',
                'h3': '18px',
                'body': '16px',
                'small': '14px',
                'tiny': '12px'
            },
            spacing: {
                'xs': '4px',
                'sm': '8px',
                'md': '16px',
                'lg': '24px',
                'xl': '32px',
                '2xl': '48px',
                '3xl': '64px'
            },
            boxShadow: {
                'sm': '0 1px 2px rgba(0,0,0,0.05)',
                'md': '0 4px 6px rgba(0,0,0,0.07)',
                'lg': '0 10px 15px rgba(0,0,0,0.1)'
            },
            borderRadius: {
                'card': '8px',
                'btn': '6px'
            },
            screens: {
                'mobile': '0px',
                'tablet': '768px',
                'desktop': '1024px',
                'wide': '1280px',
            },
            maxWidth: {
                'content': '1280px',
            },
            animation: {
                'shimmer': 'shimmer 2s infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                shimmer: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
            },
        },
    },
    plugins: [],
}
