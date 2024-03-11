<script setup lang="ts">
import { useSettingStore } from '~/store'

const settingStore = useSettingStore()

const show = shallowRef(true)
onMounted(() => {
  setTimeout(() => show.value = false, 1000)
})
</script>

<template>
  <Transition
    leave-active-class="transform-gpu duration-500 transition-all"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    :duration="500"
  >
    <div
      v-if="show"
      class="fixed inset-0 z-[99999999] flex items-center justify-center overscroll-contain backdrop-blur-xl"
    >
      <div class="flex flex-col items-center gap-2">
        <div class="size-4 animate-bounce rounded-full bg-primary-500" />
        <h1 class="text-xl">
          {{ settingStore.setting.siteTitle }}
        </h1>
        <p class="animate-pulse text-zinc-500">
          loading...
        </p>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="postcss">

</style>
