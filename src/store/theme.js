import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useTheme } from 'vuetify'

export const useThemeStore = defineStore('theme', () => {

  /// 主题切换
  const theme = useTheme()
  const isDark = computed(() => theme.global.current.value.dark)
  const mediaQueryList = window.matchMedia?.('(prefers-color-scheme: dark)')
  if (mediaQueryList.matches) {
    theme.global.name.value = 'dark'
  }
  mediaQueryList?.addEventListener('change', ({ matches }) => {
    theme.global.name.value = matches ? 'dark' : 'light'
  })
  const toggleTheme = () => {
    theme.global.name.value = isDark.value ? 'light' : 'dark'
  }

  return { isDark, toggleTheme }
})
