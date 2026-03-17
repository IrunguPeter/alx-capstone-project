/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,py}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0b10',
          blue: '#00f2ff',
          indigo: '#6366f1',
          purple: '#a855f7',
        }
      },
      boxShadow: {
        'glow-blue': '0 0 15px rgba(0, 242, 255, 0.4)',
        'glow-indigo': '0 0 20px rgba(99, 102, 241, 0.3)',
        'glass': 'inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
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