export function useSettingStore() {
  return useState('setting', () => ({
    siteTitle: `FlapyPan's Blog`,
    favicon: '/avatar.webp',
    avatar: '/avatar.webp',
    banner: '/banner.webp',
    name: 'FlapyPan',
    email: 'flapypan@gmail.com',
    info: '个人博客',
    hitoko: true,
    footer: 'Copyright',
    ICP: '',
    moeICP: '',
    giscusRepo: '',
    giscusRepoId: '',
    giscusCategory: '',
    giscusCategoryId: '',
  }))
}
