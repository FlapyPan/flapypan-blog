<script setup>
defineProps({
  loading: { type: Boolean },
})
const emits = defineEmits(['refresh'])
</script>

<template>
  <f-btn :disabled="loading" @click="emits('refresh')">
    <icon class="text-lg" :class="{ 'animation-rotate': loading }" name="mingcute:refresh-1-line" />
    <span class="ml-1 text-md">刷新</span>
  </f-btn>
</template>

<style scoped>
</style>
