import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';
import scrollbar from 'tailwind-scrollbar';

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
} satisfies Config;
