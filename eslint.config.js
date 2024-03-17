import antfu from '@antfu/eslint-config'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat()

export default antfu(
  {},
  ...compat.config({
    extends: ['plugin:tailwindcss/recommended'],
  }),
  {
    rules: {
      'antfu/if-newline': 'off',
      'curly': ['error', 'multi-line'],
      'style/arrow-parens': ['error', 'always'],
      'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'node/prefer-global/buffer': 'off',
      'vue/html-self-closing': ['error', {
        html: {
          void: 'always',
          normal: 'never',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      }],
    },
  },
)
