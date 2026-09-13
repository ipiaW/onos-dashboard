/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#0f0f11",
        card: "#16161a",
        cardHover: "#1f1f24",
        spotify: "#1DB954",
        spotifyHover: "#1ed760",
        danger: "#e22134",
        warning: "#f59b23"
      }
    }
  },
  plugins: []
};
