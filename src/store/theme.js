import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useTheme } from 'vuetify'

export const useThemeStore = defineStore('theme', () => {

  /// 主题切换
  const theme = useTheme()
  const storageTheme = computed({
    get: () => {
      let storageValue = localStorage.getItem('theme')
      if (storageValue == null) {
        localStorage.setItem('theme', 'light')
        return 'light'
      }
      return storageValue
    },
    set: (val) => localStorage.setItem('theme', val),
  })
  theme.global.name.value = storageTheme.value
  const isDark = computed(() => theme.global.current.value.dark)
  const toggleTheme = () => {
    const nextTheme = isDark.value ? 'light' : 'dark'
    theme.global.name.value = nextTheme
    storageTheme.value = nextTheme
  }

  return { isDark, toggleTheme }
})
