/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Official Premium Palette: Slate / Violet-Indigo
        brand: {
          50:  '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          950: '#2E1065',
        },
        slate: {
          50:  '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        // Legacy neo colors (kept for editor & BioCard compatibility)
        'neo-yellow': '#FFFF00',
        'neo-pink': '#FF00FF',
        'neo-cyan': '#00FFFF',
        'neo-green': '#00FF00',
        'neo-orange': '#FF8000',
        'neo-purple': '#8B5CF6',
        'neo-white': '#FAFAFA',
        'neo-black': '#000000',
        'neo-gray': '#808080',
      },
      fontFamily: {
        'sans': ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        'grotesk': ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'clay-sm': '12px',
        'clay':    '18px',
        'clay-lg': '24px',
      },
      boxShadow: {
        // Claymorphism Shadow System (Soft, Subtle, Premium)
        'clay-sm': `
          0 1px 2px rgba(15, 23, 42, 0.04),
          0 1px 3px rgba(15, 23, 42, 0.02),
          inset 0 1px 0 rgba(255, 255, 255, 0.95)
        `,
        'clay': `
          0 2px 4px -1px rgba(15, 23, 42, 0.06),
          0 4px 8px -2px rgba(15, 23, 42, 0.04),
          inset 0 1px 0 rgba(255, 255, 255, 0.95)
        `,
        'clay-lg': `
          0 4px 12px -2px rgba(15, 23, 42, 0.06),
          0 8px 24px -4px rgba(15, 23, 42, 0.04),
          inset 0 1px 0 rgba(255, 255, 255, 1)
        `,
        'clay-btn': `
          0 2px 8px rgba(124, 58, 237, 0.25),
          0 1px 3px rgba(124, 58, 237, 0.15),
          inset 0 1px 0 rgba(255, 255, 255, 0.2)
        `,
        'clay-input': `
          0 1px 2px rgba(15, 23, 42, 0.02),
          inset 0 1px 2px rgba(15, 23, 42, 0.03)
        `,
        'clay-focus': `
          0 0 0 3px rgba(139, 92, 246, 0.08),
          0 1px 3px rgba(124, 58, 237, 0.06),
          inset 0 1px 0 rgba(255, 255, 255, 1)
        `,
        // Legacy neo
        'neo':    '4px 4px 0px 0px #000000',
        'neo-lg': '6px 6px 0px 0px #000000',
        'neo-xl': '8px 8px 0px 0px #000000',
      },
    },
  },
  plugins: [],
}