import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import { useLocalStorage } from '@vueuse/core'

export const useThemeStore = defineStore('theme', () => {

  /// 主题切换
  const theme = useTheme()
  const storageTheme = useLocalStorage('theme', 'light')
  theme.global.name.value = storageTheme.value
  const isDark = computed(() => theme.global.current.value.dark)
  const toggleTheme = () => {
    const nextTheme = isDark.value ? 'light' : 'dark'
    theme.global.name.value = nextTheme
    storageTheme.value = nextTheme
  }

  return {isDark, toggleTheme}
})
