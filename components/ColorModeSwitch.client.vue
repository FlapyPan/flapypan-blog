<script setup lang="ts">
import { useCycleList } from '@vueuse/core'

const colorMode = useColorMode()

const showTip = shallowRef(false)
let timer: ReturnType<typeof setTimeout>
watch(() => colorMode.preference, () => {
  showTip.value = true
  clearTimeout(timer)
  timer = setTimeout(() => showTip.value = false, 3000)
})

const { next } = useCycleList<string>(
  ['light', 'dark', 'system'],
  { initialValue: colorMode.preference ?? 'light' },
)
function toggle() {
  colorMode.preference = next()
}

const colorModeIconMap: Record<string, string> = {
  light: 'mingcute:sun-line',
  dark: 'mingcute:moon-line',
  system: 'mingcute:computer-line',
}
const colorModeIcon = computed(() => colorModeIconMap[colorMode.preference] ?? '')
</script>

<template>
  <button
    title="切换配色"
    class="flex items-center rounded-xl p-2 text-sm transition-colors sm:hover:text-primary-500"
    @click="toggle()"
  >
    <Icon class="h-4 w-4" :name="colorModeIcon" />
  </button>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform opacity-0"
      enter-to-class="transform opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform opacity-100"
      leave-to-class="transform opacity-0"
    >
      <div
        v-if="showTip"
        class="pointer-events-none fixed safe-top-0 safe-left-0 safe-right-0 safe-bottom-0 z-[999999999] flex justify-center items-center"
      >
        <div class="backdrop-blur-lg rounded-xl shadow-md bg-white dark:bg-black bg-opacity-70 dark:bg-opacity-50 h-24 w-24 flex flex-col justify-center items-center">
          <Icon class="h-6 w-6" :name="colorModeIcon" />
          <span class="text-zinc-500 text-sm">{{ colorMode.preference }}</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="postcss">

</style>
