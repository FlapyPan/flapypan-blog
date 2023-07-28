import { defineStore } from 'pinia'
import { api } from '@/api'
import { ref } from 'vue'

export const useSettingStore = defineStore('setting', () => {

  const isLogin = ref(!!localStorage.getItem('token'))
  api(`/auth`).then((data) => isLogin.value = !!data)

  const settings = ref({})
  api(`/setting`).then((data) => settings.value = data)

  const links = ref([])
  const setLinks = (data) => links.value = data
  api(`/link`).then(setLinks)


  return {isLogin, settings, links, setLinks}
})
