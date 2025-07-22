/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {colors: {
        maroon: {
          500: '#800000',
          600: '#6a0000',
          700: '#5a0000',
          800: '#4a0000',
        }
      }},
  },
  plugins: [],
}
