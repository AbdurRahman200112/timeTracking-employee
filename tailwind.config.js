/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./resources/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        fadeInUp: "fadeInUp 1.5s ease-in-out",
        fadeInLeft: "fadeInLeft 1.5s ease-in-out",
        fadeInRight: "fadeInRight 1.5s ease-in-out",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(100%)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeInLeft: {
          "0%": { opacity: 0, transform: "translateX(-100%)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        fadeInRight: {
          "0%": { opacity: 0, transform: "translateX(100%)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
});
