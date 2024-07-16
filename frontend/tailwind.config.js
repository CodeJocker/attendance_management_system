// // const flowbite = require("flowbite-react/tailwind");
// // /** @type {import('tailwindcss').Config} */
// // export default {
// //   content: [
// //     "./index.html",
// //     "./src/**/*.{js,ts,jsx,tsx}",
// //     flowbite.content(),
// //   ],
// //   theme: {
// //     extend: {},
// //   },
// //   plugins: [require("daisyui")],
// //   plugins: [flowbite.plugin],
// // }



// // const flowbite = require("flowbite-react/tailwind");
// import { Flowbite } from "flowbite-react"

// module.exports = {
//   purge: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//     Flowbite.content(),
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [
//     require("daisyui"),
//     Flowbite.plugin(),
//   ],
// };


const flowbite = require("flowbite-react/tailwind");

module.exports = {
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
