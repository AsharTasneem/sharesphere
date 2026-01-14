/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#FFF3F3",
          100: "#FFE5E4",
          200: "#FECFCF",
          300: "#F9B3B2",
          400: "#F7CAC9", // base
          500: "#EEA7A6",
          600: "#DB8583",
          700: "#B86664",
          800: "#94514F",
          900: "#753F3E",
        },
        surface: "#FFFFFF",
      },
      fontFamily: {
        sans: ["Fira Sans", "sans-serif"],
        cormorant: ["Cormorant", "Cormorant Garamond", "serif"],
        tino: ["Tino", "serif"],
        playfair: ["Playfair Display", "serif"],
        fira: ["Fira Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
  corePlugins: {
    lineClamp: true,
  },
};
