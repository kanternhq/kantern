/** @type {import('tailwindcss').Config} */
export default {
  content: [
    /** @type {import('tailwindcss').Config} */
    (
      module.exports = {
        content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
        theme: {
          extend: {},
        },
        plugins: [],
      }
    ),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
