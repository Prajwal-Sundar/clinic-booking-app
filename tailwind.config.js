/** @type {import('tailwindcss').Config} */
// export default {
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
