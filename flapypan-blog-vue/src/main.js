import App from './App.vue'
import { createApp } from 'vue'
import pinia from '@/store'
import router from '@/router'
import { createVuetify } from 'vuetify'
import { zhHans } from 'vuetify/locale'
import colors from 'vuetify/lib/util/colors'

const app = createApp(App)

const vuetify = createVuetify({
  locale: {
    locale: 'zhHans',
    messages: {zhHans},
  },
  defaults: {
    VBtn: {
      rounded: true,
      variant: 'tonal',
    },
    VCard: {
      rounded: 'xl',
      elevation: 0,
    },
    VTextField: {
      variant: 'underlined',
    },
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: colors.blue.lighten1,
          secondary: colors.green.lighten1,
        },
      },
    },
  },
})

app
  .use(vuetify)
  .use(pinia)
  .use(router)

app.mount('#app')
