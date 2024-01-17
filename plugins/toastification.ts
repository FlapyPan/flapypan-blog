import Toast, { type PluginOptions, POSITION } from 'vue-toastification'

export default defineNuxtPlugin(({ vueApp }) => {
  const options: PluginOptions = {
    position: POSITION.BOTTOM_CENTER,
  }
  vueApp.use(Toast, options)
})
