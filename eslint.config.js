import config from '@antfu/eslint-config'

export default config(
  {
    stylistic: {
      indent: 2,
      quotes: 'single',
    },
    vue: true,
    jsonc: false,
    yaml: false,
    ignores: ['./.nuxt', './.output'],
  },
  {
    rules: {
      'style/semi': ['error', 'never'],
      'style/arrow-parens': ['error', 'always'],
      'arrow-parens': ['error', 'always'],
      'no-new': ['off'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'brace-style': ['off'],
      'style/brace-style': ['off'],
      'antfu/if-newline': ['off'],
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      'vue/operator-linebreak': ['error', 'before'],
      'vue/html-self-closing': ['off'],
      'vue/html-closing-bracket-newline': ['error', { singleline: 'never', multiline: 'never' }],
      'vue/component-name-in-template-casing': ['off'],
    },
  },
)
