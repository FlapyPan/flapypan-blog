<script setup>
const props = defineProps({
  show: {},
  text: {},
  redirect: { type: Boolean, default: false },
  redirectPath: { type: String, default: '/' },
  redirectText: { type: String, default: '返回主页' },
})

function clear() {
  clearError({ redirect: props.redirectPath })
}
</script>

<template>
  <div
    v-show="!!show"
    class="px-6 py-3 bg-red-400 dark:bg-red-700 text-zinc-50 gap-2 flex flex-wrap items-center rounded-lg">
    <icon class="text-lg" name="mingcute:close-circle-line" />
    <span class="text-sm">{{ text }}</span>
    <span class="flex-1"></span>
    <f-btn v-if="redirect" @click="clear">
      {{ redirectText }}
    </f-btn>
  </div>
</template>

<style scoped>

</style>
