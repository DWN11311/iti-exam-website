/** @type {import('tailwindcss').Config} */
module.exports = {
  // content: ["./**/*.{html,js}"], // Adjust the paths based on your project structure
  content: ["./src/**/*.{html,js}", "./*.html"],
  theme: {
    extend: {
      colors: {
        text: {
          50: "#0e0712",
          100: "#1b0f24",
          200: "#371d49",
          300: "#522c6d",
          400: "#6d3a92",
          500: "#8949b6",
          600: "#a06dc5",
          700: "#b892d3",
          800: "#d0b6e2",
          900: "#e7dbf0",
          950: "#f3edf8",
        },
        background: {
          50: "#0e0613",
          100: "#1d0d26",
          200: "#3a194d",
          300: "#572673",
          400: "#743399",
          500: "#9140bf",
          600: "#a766cc",
          700: "#bd8cd9",
          800: "#d3b3e6",
          900: "#e9d9f2",
          950: "#f4ecf9",
        },
        primary: {
          50: "#0e001a",
          100: "#1c0033",
          200: "#380066",
          300: "#540099",
          400: "#7000cc",
          500: "#8c00ff",
          600: "#a333ff",
          700: "#ba66ff",
          800: "#d199ff",
          900: "#e8ccff",
          950: "#f4e5ff",
        },
        secondary: {
          50: "#0e0316",
          100: "#1b062d",
          200: "#370c5a",
          300: "#521287",
          400: "#6e18b4",
          500: "#891fe0",
          600: "#a14be7",
          700: "#b878ed",
          800: "#d0a5f3",
          900: "#e7d2f9",
          950: "#f3e9fc",
        },
        accent: {
          50: "#0e0218",
          100: "#1c0330",
          200: "#37075f",
          300: "#530a8f",
          400: "#6f0dbf",
          500: "#8b11ee",
          600: "#a240f2",
          700: "#b970f5",
          800: "#d0a0f8",
          900: "#e8cffc",
          950: "#f3e7fd",
        },
      },
    },
    // extend: {
    //     colors: {
    //         text: {
    //             50: "#f3edf8",
    //             100: "#e7dbf0",
    //             200: "#d0b6e2",
    //             300: "#b892d3",
    //             400: "#a06dc5",
    //             500: "#8949b6",
    //             600: "#6d3a92",
    //             700: "#522c6d",
    //             800: "#371d49",
    //             900: "#1b0f24",
    //             950: "#0e0712",
    //         },
    //         background: {
    //             50: "#f4ecf9",
    //             100: "#e9d9f2",
    //             200: "#d3b3e6",
    //             300: "#bd8cd9",
    //             400: "#a766cc",
    //             500: "#9140bf",
    //             600: "#743399",
    //             700: "#572673",
    //             800: "#3a194d",
    //             900: "#1d0d26",
    //             950: "#0e0613",
    //         },
    //         primary: {
    //             50: "#f4e5ff",
    //             100: "#e8ccff",
    //             200: "#d199ff",
    //             300: "#ba66ff",
    //             400: "#a333ff",
    //             500: "#8c00ff",
    //             600: "#7000cc",
    //             700: "#540099",
    //             800: "#380066",
    //             900: "#1c0033",
    //             950: "#0e001a",
    //         },
    //         secondary: {
    //             50: "#f3e9fc",
    //             100: "#e7d2f9",
    //             200: "#d0a5f3",
    //             300: "#b878ed",
    //             400: "#a14be7",
    //             500: "#891fe0",
    //             600: "#6e18b4",
    //             700: "#521287",
    //             800: "#370c5a",
    //             900: "#1b062d",
    //             950: "#0e0316",
    //         },
    //         accent: {
    //             50: "#f3e7fd",
    //             100: "#e8cffc",
    //             200: "#d0a0f8",
    //             300: "#b970f5",
    //             400: "#a240f2",
    //             500: "#8b11ee",
    //             600: "#6f0dbf",
    //             700: "#530a8f",
    //             800: "#37075f",
    //             900: "#1c0330",
    //             950: "#0e0218",
    //         },
    //     },
    // },
  },
  plugins: [],
};
