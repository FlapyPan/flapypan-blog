const postcss = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': 'postcss-nesting',
    'tailwindcss': {},
    'postcss-preset-env': {
      browsers: ['Chrome >= 87', 'Firefox >= 78', 'Safari >= 14', 'Edge >= 88'],
      features: { 'nesting-rules': false },
    },
  },
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  routeRules: {
    '/activity': { ssr: false },
    '/archive': { ssr: false },
    '/tag': { ssr: false },
    '/tag/**': { ssr: false },
    '/new': { ssr: false },
    '/setting': { ssr: false },
  },
  modules: [
    'nuxt-icon',
  ],
  build: {
    transpile: ['jsonwebtoken'],
  },
  vite: {
    build: {
      target: 'modules',
      modulePreload: { polyfill: true },
    },
  },
  vue: {
    compilerOptions: {
      // 排除自定义组件，防止 vue 编译处理
      isCustomElement: (tag) => ['giscus-widget'].includes(tag),
    },
  },
  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      ],
      script: [
        { type: 'module', src: 'https://unpkg.com/giscus?module', async: true },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  css: ['~/assets/css/main.css', '~/assets/css/github-languages-colors.css'],
  postcss,
})
