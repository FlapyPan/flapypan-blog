<script setup>
defineProps({
  loading: { type: Boolean }
})
const emits = defineEmits(['refresh'])
</script>

<template>
  <Btn :disabled="loading" @click="emits('refresh')">
    <Icon
      :class="{ 'animation-rotate': loading }"
      name="mingcute:refresh-1-line"
    />
  </Btn>
</template>
