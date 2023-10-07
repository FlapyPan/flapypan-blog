import { useTheme } from 'vuetify'

export function useDark() {
  const theme = useTheme()
  const isDark = computed(() => theme.current.value.dark)
  const toggle = () => {
    theme.global.name.value = isDark.value ? 'light' : 'dark'
  }

  return { theme, isDark, toggle }
}
