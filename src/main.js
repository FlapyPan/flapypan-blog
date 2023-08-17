import App from './App.vue'
import { createApp } from 'vue'
import pinia from '@/store'
import router from '@/router'
import { createVuetify } from 'vuetify'
import { zhHans } from 'vuetify/locale'
import { md3 } from 'vuetify/blueprints'
import colors from 'vuetify/lib/util/colors'

const app = createApp(App)

const vuetify = createVuetify({
  blueprint: md3,
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
          surface: '#f7f7f8',
          primary: colors.green.lighten1,
        },
      },
      dark: {
        colors: {
          surface: '#1e1e20',
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
