// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  typescript: {
    typeCheck: true,
  },
  appConfig: {
    nuxtIcon: {},
  },
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
    '@nuxtjs/color-mode',
    'nuxt-icon',
    '@formkit/auto-animate/nuxt',
    '@pinia/nuxt',
    'nuxt-mongoose',
  ],
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
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
          crossorigin: 'anonymous',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.loli.net/css2?family=Inter:wght@100..900&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.loli.net/css2?family=Fira+Code:wght@300..700&display=swap',
        },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  css: ['vue-toastification/dist/index.css', '~/assets/css/main.css'],
  postcss: {
    plugins: {
      'postcss-import': {},
      'tailwindcss/nesting': 'postcss-nesting',
      tailwindcss: {},
      'postcss-preset-env': {
        features: { 'nesting-rules': false },
      },
    },
  },
})
