export function useSettingStore() {
  return useState('setting', () => ({
    isLogin: false,
    loginDialogVisible: false,
    links: [],
    settings: {
      siteTitle: 'FlapyPan\'s Blog',
      favicon: '/avatar.webp',
      avatar: '/avatar.webp',
      banner: '/banner.webp',
      name: 'FlapyPan',
      email: 'flapypan@gmail.com',
      info: '个人博客',
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
