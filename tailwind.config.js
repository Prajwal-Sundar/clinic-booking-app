/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}", // <-- TypeScript files only
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
