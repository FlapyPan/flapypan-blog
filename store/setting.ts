import { defineStore } from 'pinia';

export const useSettingStore = defineStore('setting', () => {
  const setting = ref({
    siteTitle: `FlapyPan's Blog`,
    favicon: '/avatar.webp',
    avatar: '/avatar.webp',
    banner: '/banner.webp',
    name: 'FlapyPan',
    email: 'flapypan@gmail.com',
    info: '个人博客',
    hitoko: true,
    footer: 'Copyright',
    wakatime: '',
    giscusRepo: '',
    giscusRepoId: '',
    giscusCategory: '',
    giscusCategoryId: '',
  });

  const load = async () => {
    const data = await api('/attribute/settings');
    setting.value = { ...setting.value, ...data };
  };

  const save = async () => {
    const data = await api('/attribute/settings', 'POST', setting.value);
    setting.value = { ...setting.value, ...data };
  };

  const rightDrawer = shallowRef(false);

  return {
    setting,
    load,
    save,
    rightDrawer,
  };
});
