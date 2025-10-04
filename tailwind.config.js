/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'primary': ['Arial', 'Helvetica', 'sans-serif'],
        'primary-bold': ['Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
