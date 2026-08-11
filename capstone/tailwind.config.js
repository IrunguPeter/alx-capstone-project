/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,py}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ivory: '#f6f3ec',
        paper: '#ffffff',
        ink: {
          DEFAULT: '#1a1714',
          soft: '#6f685e',
          faint: '#a49c90',
        },
        burgundy: {
          DEFAULT: '#9e1b32',
          deep: '#7c1526',
          tint: '#f5e8ea',
        },
        gold: {
          DEFAULT: '#b08d3f',
          faint: '#e9dfc8',
        },
      },
      boxShadow: {
        'luxury-card': '0 24px 48px -24px rgba(26, 23, 20, 0.18)',
        'luxury-panel': '0 40px 80px -48px rgba(26, 23, 20, 0.28)',
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}