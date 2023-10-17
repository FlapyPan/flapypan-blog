export function useDark() {
  const isDark = ref(false)
  onMounted(() => {
    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
    isDark.value = mediaQueryList.matches
    mediaQueryList.addEventListener('change', (event) => {
      isDark.value = event.matches
    })
  })

  return { isDark }
}
