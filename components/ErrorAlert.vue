<script setup>
defineProps({
  show: { type: Boolean, default: true },
  text: { type: String, default: '' },
})
</script>

<template>
  <div v-show="show" class="px-6 py-3 bg-red-400 dark:bg-red-700 text-zinc-50 flex items-center rounded-lg shadow-md">
    <icon name="mingcute:close-circle-line" />
    <span class="px-2">错误 {{ text }}</span>
  </div>
</template>

<style scoped>

</style>
