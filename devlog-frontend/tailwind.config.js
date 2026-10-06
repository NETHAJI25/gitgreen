/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'journal': '#22C55E',
        'insights': '#38BDF8',
        'repo': '#F59E0B',
        'border': 'rgba(255,255,255,0.10)',
        'bg-primary': '#0A0E14',
        'bg-secondary': '#111827',
        'bg-card': 'rgba(255,255,255,0.04)',
        'text-primary': '#F1F5F9',
        'text-secondary': '#94A3B8',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'heading': ['Space Grotesk', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'lg': '16px',
      }
    },
  },
  plugins: [],
}
