/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,md,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        border: 'var(--border)',
        brand: 'var(--brand)',
        highlight: 'var(--highlight)',
        'card-edge': 'var(--card-edge)',
        'card-edge-hover': 'var(--card-edge-hover)',
        'card-fill': 'var(--card-fill)',
        studio: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#0B0F19',
        },
        unit: {
          1: { DEFAULT: '#10B981', light: '#D1FAE5', dark: '#065F46' }, // Unit 1: Emerald (AI Basics)
          2: { DEFAULT: '#0284C7', light: '#E0F2FE', dark: '#075985' }, // Unit 2: Sky (Search)
          3: { DEFAULT: '#F59E0B', light: '#FEF3C7', dark: '#92400E' }, // Unit 3: Amber (ML Fundamentals)
          4: { DEFAULT: '#8B5CF6', light: '#EDE9FE', dark: '#5B21B6' }, // Unit 4: Violet (Probabilistic)
          5: { DEFAULT: '#F43F5E', light: '#FFE4E6', dark: '#9F1239' }, // Unit 5: Rose (Decision Models)
          6: { DEFAULT: '#14B8A6', light: '#CCFBF1', dark: '#115E59' }, // Unit 6: Teal (Unsupervised)
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        montserrat: ['Montserrat', 'system-ui', 'sans-serif'],
        brand: ['Onest', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'Manrope', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        subtle: 'none',
        studio: 'none',
        'studio-lg': 'none',
      },
      animation: {
        'chai-spin': 'chai-spin 4s linear infinite',
      },
    },
  },
  plugins: [],
};
