import vuetify from 'vite-plugin-vuetify'

const postcss = {
  plugins: {
    'postcss-preset-env': {
      browsers: ['Chrome >= 87', 'Firefox >= 78', 'Safari >= 14', 'Edge >= 88'],
      features: {
        'nesting-rules': true,
      },
    },
  },
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  routeRules: {
    '/api/**': { proxy: `${import.meta.env.BACKEND_API}/api/**` },
  },
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    build: {
      target: 'modules',
      modulePreload: { polyfill: true },
    },
  },
  hooks: {
    'vite:extendConfig': (config) => {
      if (!config.plugins) config.plugins = []
      config.plugins.push(vuetify({ autoImport: true }))
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
        {
          rel: 'stylesheet',
          href: 'https://cdn.staticfile.org/vuetify/3.3.20/vuetify.min.css',
        },
        {
          rel: 'stylesheet',
          href: 'https://cdn.staticfile.org/MaterialDesign-Webfont/7.2.96/css/materialdesignicons.min.css',
        },
      ],
      script: [
        { type: 'module', src: 'https://unpkg.com/giscus?module' },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  postcss,
})
