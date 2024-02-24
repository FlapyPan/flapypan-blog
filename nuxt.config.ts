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
  modules: ['@nuxtjs/color-mode', 'nuxt-icon', '@pinia/nuxt', 'nuxt-mongoose'],
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classPrefix: '',
    classSuffix: '',
  },
  build: {
    transpile: ['jsonwebtoken', 'vue-toastification'],
  },
  vite: {
    build: {
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
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  css: ['vue-toastification/dist/index.css', '~/assets/css/main.css'],
  postcss: {
    plugins: {
      'postcss-import': {},
      'tailwindcss/nesting': 'postcss-nesting',
      'tailwindcss': {},
      'postcss-preset-env': {
        features: { 'nesting-rules': false },
      },
    },
  },
});
