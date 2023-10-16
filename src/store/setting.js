import { api } from '@/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingStore = defineStore('setting', () => {

  const sideBarOpened = ref(false)
  const loginDialogOpened = ref(false)

  const isLogin = ref(!!localStorage.getItem('token'))
  api(`/auth`).then((data) => isLogin.value = !!data)

  const settings = ref({
    siteTitle: 'FlapyPan\'s Blog',
    favicon: '/avatar.webp',
    avatar: '/avatar.webp',
    banner: '/banner.webp',
    name: 'FlapyPan',
    email: 'flapypan@gmail.com',
    info: '个人博客',
    pageSize: '12',
    footer: 'Copyright',
    giscusRepo: '',
    giscusRepoId: '',
    giscusCategory: '',
    giscusCategoryId: '',
  })
  api(`/setting`).then((data) => {
    if (data) { settings.value = data }
  })

  const links = ref([])
  const setLinks = (data) => links.value = data
  api(`/link`).then(setLinks)


  return { sideBarOpened, loginDialogOpened, isLogin, settings, links, setLinks }
})
