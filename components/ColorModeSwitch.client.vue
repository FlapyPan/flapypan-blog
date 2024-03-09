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
    <Icon class="size-4" :name="colorModeIcon" />
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
        class="pointer-events-none fixed left-1/2 top-1/2 flex size-24 flex-col items-center justify-center rounded-xl bg-white/70 shadow-md backdrop-blur-lg dark:bg-black/50 print:hidden"
      >
        <Icon class="size-6" :name="colorModeIcon" />
        <span class="text-sm">{{ colorMode.preference }}</span>
      </div>
    </Transition>
  </Teleport>
</template>
