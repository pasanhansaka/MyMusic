/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF0000", // Red
        secondary: "#000000", // Black
        accent: "#00FFFF", // Neon Cyan
        dark: "#121212",
      },
    },
  },
  plugins: [],
}
