<script setup lang="ts">
import { useSettingStore } from '~/store'
import loadingImg from '~/assets/img/loading.gif'

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
      class="pointer-events-none fixed inset-0 z-[99999999] flex select-none items-center justify-center bg-white dark:bg-black"
    >
      <div class="flex flex-col items-center gap-2">
        <img alt="" :src="loadingImg" class="size-24" />
        <h1 class="text-xl">
          {{ settingStore.setting.siteTitle }}
        </h1>
        <p class="animate-pulse text-stone-500">
          loading...
        </p>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="postcss">

</style>
