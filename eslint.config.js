import antfu from '@antfu/eslint-config'

export default antfu(
  {},
  {
    rules: {
      'antfu/if-newline': 'off',
      'curly': ['error', 'multi-line'],
      'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'node/prefer-global/buffer': 'off',
    },
  },
)
