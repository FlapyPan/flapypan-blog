<script setup lang="ts">
const emit = defineEmits<{ (e: 'close'): void }>()
const visible = defineModel<boolean>()
</script>

<template>
  <Transition
    enter-from-class="transform opacity-0"
    enter-to-class="transform opacity-100"
    leave-from-class="transform opacity-100"
    leave-to-class="transform opacity-0"
  >
    <div
      v-if="visible"
      class="backdrop themed-scrollbar fixed inset-0 z-50 overflow-x-hidden overscroll-contain bg-white bg-opacity-30 backdrop-blur transition-all duration-500 dark:bg-black dark:bg-opacity-20 print:hidden"
      @click="emit('close')"
    />
  </Transition>
</template>
