import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'
import colors from 'tailwindcss/colors'
import scrollbar from 'tailwind-scrollbar'

const sans = ['Inter', ...fontFamily.sans]
const serif = ['Merriweather', ...fontFamily.serif]
const mono = [...new Set(['Fira Code', ...fontFamily.mono, ...sans])]

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
    fontFamily: { sans, serif, mono },
  },
  plugins: [scrollbar({ nocompatible: true })],
} satisfies Config
