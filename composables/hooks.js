export function useDark() {
  const isDark = ref(true)
  onBeforeMount(() => {
    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
    isDark.value = mediaQueryList.matches
    mediaQueryList.addEventListener('change', (event) => {
      isDark.value = event.matches
    })
  })

  return { isDark }
}
