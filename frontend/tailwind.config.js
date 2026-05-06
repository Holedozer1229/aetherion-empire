/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: '#0b0c0e',
        gold: '#d4af37',
        violet: '#8a2be2',
      },
    },
  },
  plugins: [],
}
