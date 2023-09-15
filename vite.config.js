// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import postcssPresetEnv from 'postcss-preset-env'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'modules',
    modulePreload: { polyfill: true },
    chunkSizeWarningLimit: 1024,
    cssCodeSplit: false,
  },
  plugins: [
    vue({
      template: {
        transformAssetUrls,
        compilerOptions: {
          // 排除自定义组件，防止 vue 编译处理
          isCustomElement: (tag) => ['giscus-widget'].includes(tag),
        },
      },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    }),
  ],
  css: {
    postcss: {
      plugins: [
        postcssPresetEnv({
          features: {
            'nesting-rules': true,
          },
        }),
      ],
    },
  },
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: [
      '.js',
      '.json',
      '.mjs',
      '.ts',
      '.vue',
    ],
  },
  server: {
    host: true,
    port: 3000,
    proxy: {
      // api请求转发至后端
      '/api/': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        followRedirects: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
