/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
        neutral: {
            900: '#272727',
    },
  },
        fontFamily: {
            sans: ['"Poppins"', 'sans-serif'],
            heading: ['"Manrope"', 'sans-serif'],
  },
},

  },
  plugins: [],
}
