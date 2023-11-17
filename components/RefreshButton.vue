<script setup>
defineProps({
  loading: { type: Boolean },
})
const emits = defineEmits(['refresh'])
</script>

<template>
  <f-btn :disabled="loading" @click="emits('refresh')">
    <icon :class="{ 'animation-rotate': loading }" name="mingcute:refresh-1-line" />
  </f-btn>
</template>

<style scoped>
</style>
