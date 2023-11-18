export function useSettingStore() {
  return useState('setting', () => ({
    links: [],
    settings: {
      siteTitle: 'FlapyPan\'s Blog',
      favicon: '/avatar.webp',
      avatar: '/avatar.webp',
      banner: '/banner.webp',
      name: 'FlapyPan',
      email: 'flapypan@gmail.com',
      info: '个人博客',
      hitoko: true,
      pageSize: '12',
      footer: 'Copyright',
      ICP: '',
      moeICP: '',
      giscusRepo: '',
      giscusRepoId: '',
      giscusCategory: '',
      giscusCategoryId: '',
    },
  }))
}
