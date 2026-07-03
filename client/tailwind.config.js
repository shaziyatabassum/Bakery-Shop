/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5C3A21",
        secondary: "#F6D7B0",
        background: "#FFFFFF",
        lightBackground: "#FFF8F2",
        accent: "#D89B5B",
        textMain: "#2C2C2C",
        borderLight: "#ECECEC"
      },
      fontFamily: {
        sans: ["Poppins", "Inter", "sans-serif"],
      }
    },
  },
  plugins: [],
}
