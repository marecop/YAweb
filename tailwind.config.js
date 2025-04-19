/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ya-yellow': {
          50: '#fffdf0',
          100: '#fff9c2',
          200: '#fff490',
          300: '#ffeb57',
          400: '#ffe01f',
          500: '#ffd000', // Primary yellow
          600: '#e6b800',
          700: '#cc9900',
          800: '#a67b00',
          900: '#805d00',
        },
        'ya-gray': {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}; 