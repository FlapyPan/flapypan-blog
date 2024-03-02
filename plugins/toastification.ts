import Toast, { POSITION, type PluginOptions } from 'vue-toastification'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(Toast, {
    timeout: 3000,
    draggable: true,
    position: POSITION.BOTTOM_CENTER,
  } as PluginOptions)
})
