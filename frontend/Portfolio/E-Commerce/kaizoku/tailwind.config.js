/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "/Home",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        kanit: ['Kanit', 'sans-serif'],
      },
      colors: {
        background: '#0C0C0C',
        textLight: '#D7E2EA',
      }
    },
  },
  plugins: [],
}
