/** @type {import('tailwindcss').Config} */
module.exports = {
content: [
  "./index.html",
  "./src/**/*.{js,jsx,ts,tsx}",
],
  theme: {
    extend: {
    textColor: {
      'primary': '#262626',
      'textgray': '#404040',
      'textlightgray': '#808080',
    }
    },
  },
  plugins: [],
}

