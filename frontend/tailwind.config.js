/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#0B0C10',
        'brand-light': '#C5C6C7',
        'brand-cyan': '#66FCF1',
        'brand-blue': '#45A29E',
      }
    },
  },
  plugins: [],
}
