import App from './App.vue'
import { createApp } from 'vue'
import pinia from '@/store'
import router from '@/router'
import { createVuetify } from 'vuetify'
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'
import { zhHans } from 'vuetify/locale'
import colors from 'vuetify/lib/util/colors'
import 'md-editor-v3/lib/style.css'
import './main.css'

const app = createApp(App)

const vuetify = createVuetify({
  components: {
    VSkeletonLoader,
  },
  locale: {
    locale: 'zhHans',
    messages: { zhHans },
  },
  defaults: {
    VBtn: {
      rounded: 'lg',
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
