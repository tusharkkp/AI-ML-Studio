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
        cream: 'var(--cream)',
        'card-edge': 'var(--card-edge)',
        'card-edge-hover': 'var(--card-edge-hover)',
        'card-fill': 'var(--card-fill)',
        warm: {
          50: '#FAF8F5',
          100: '#F5F0E8',
          200: '#E8DEC8',
          300: '#D5C3A1',
          400: '#BCA37A',
          500: '#A48458',
          600: '#8A6A40',
          700: '#6E5131',
          800: '#523B24',
          900: '#382718',
          950: '#22170E',
        },
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
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        studio: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
        'studio-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.08)',
        glow: '0 0 20px -5px rgba(234, 88, 12, 0.25)',
      },
      animation: {
        'chai-spin': 'chai-spin 4s linear infinite',
      },
    },
  },
  plugins: [],
};
