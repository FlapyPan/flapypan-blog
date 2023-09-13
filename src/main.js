import App from './App.vue'
import { createApp } from 'vue'
import pinia from '@/store'
import router from '@/router'
import { createVuetify } from 'vuetify'
import { zhHans } from 'vuetify/locale'
import colors from 'vuetify/lib/util/colors'
import 'md-editor-v3/lib/style.css'
import './main.css'

const app = createApp(App)

const vuetify = createVuetify({
  locale: {
    locale: 'zhHans',
    messages: { zhHans },
  },
  defaults: {
    VBtn: {
      rounded: true,
      variant: 'tonal',
    },
    VChip: {
      rounded: true,
    },
    VCard: {
      rounded: 'lg',
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
          surface: '#f3f6fc',
          primary: colors.green.lighten1,
        },
      },
      dark: {
        colors: {
          surface: '#2d2f31',
          primary: colors.green.lighten1,
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
