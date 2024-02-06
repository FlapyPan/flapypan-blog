import Toast, { POSITION } from 'vue-toastification';

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(Toast, {
    position: POSITION.BOTTOM_CENTER,
  });
});
