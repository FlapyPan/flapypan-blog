import { createVuetify } from 'vuetify'
import { zhHans } from 'vuetify/locale'
import colors from 'vuetify/lib/util/colors'

export default defineNuxtPlugin(({ vueApp }) => {
  const vuetify = createVuetify({
    ssr: true,
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
            background: '#f8fafc',
            surface: '#f7f7f8',
            primary: colors.green.lighten1,
          },
        },
        dark: {
          colors: {
            background: '#131516',
            surface: '#1e1e20',
            primary: colors.green.lighten1,
          },
        },
      },
    },
  })

  vueApp.use(vuetify)

  return { provide: { vuetify } }
})
