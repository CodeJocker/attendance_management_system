/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");

module.exports = {
  darkMode: 'class',
  purge: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    ...(typeof flowbite.content === 'function' ? [flowbite.content()] : []),
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),
    flowbite.plugin,
  ],
};
