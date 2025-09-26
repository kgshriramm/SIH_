/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",   // 👈 important so Tailwind scans all React files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
