import colors from 'tailwindcss/colors';
import scrollbar from 'tailwind-scrollbar';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.indigo,
        secondary: colors.green,
      },
    },
  },
  plugins: [scrollbar({ nocompatible: true })],
};
