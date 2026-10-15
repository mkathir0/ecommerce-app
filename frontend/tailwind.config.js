/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          black: '#000000',
          red: '#ef4444',
          star: '#f59e0b',
        }
      }
    },
  },
  plugins: [],
}
