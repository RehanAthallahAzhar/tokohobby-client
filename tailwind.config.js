import formsPlugin from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-green': '#A8D8C9', 
        'brand-pink': '#F2B8B5', 
        'brand-dark': '#333333', 
      },
    },
  },
  plugins: [
    formsPlugin, 
  ],
}

