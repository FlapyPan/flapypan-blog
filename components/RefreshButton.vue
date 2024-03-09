<script setup lang="ts">
defineProps<{
  loading: boolean
}>()
const emits = defineEmits<{
  (e: 'refresh'): void
}>()
</script>

<template>
  <ClientOnly>
    <Btn v-bind="$attrs" text :disabled="loading" @click="emits('refresh')">
      <Icon :class="{ 'animation-rotate': loading }" name="mingcute:refresh-1-line" />
    </Btn>
  </ClientOnly>
</template>
