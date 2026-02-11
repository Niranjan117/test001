/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        DEFAULT: "1300px",
      },
    },
    extend: {
      colors: {
        finalBackground: "#efefef",
        background: "#ffffff",
        gray: "#8a8a8a",
        darkGray: "#2A2A2A",
        grayBg: "#161616",

        blue: "#63CFEA",
        darkBlue: "#009CD1",
        green: "#8dbb71",
        darkGreen: "#48C353",
        yellow: "#dfca64",
        darkYellow: "#F0BF1E",
        red: "#9C0000",
        darkRed: "#4B0803",
        purple: "#9c84a6",
      },
      screens: {
        xs: "480px",
      },
      fontFamily: {
        sans: ["Roboto", "Arial", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};
