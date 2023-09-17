import { defineStore } from 'pinia'
import { api } from '@/api'
import { ref } from 'vue'

export const useAccessStore = defineStore('access', () => {
  const baseInfo = ref({ all: 0, today: 0 })
  const getBaseInfo = () => api(`/access`).then((info) => baseInfo.value = info)
  getBaseInfo().then(() => setInterval(getBaseInfo, 10000))

  return { baseInfo }
})
