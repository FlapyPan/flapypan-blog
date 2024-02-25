<script setup>
const visible = defineModel({ type: Boolean });
const emit = defineEmits(['close']);
</script>

<template>
  <Transition
    enter-from-class="transform opacity-0"
    enter-to-class="transform opacity-100"
    leave-from-class="transform opacity-100"
    leave-to-class="transform opacity-0">
    <div
      v-if="visible"
      @click="emit('close')"
      class="backdrop themed-scrollbar fixed inset-0 z-50 overflow-x-hidden overscroll-contain bg-white bg-opacity-50 backdrop-blur transition-all duration-500 dark:bg-black dark:bg-opacity-50 print:hidden"></div>
  </Transition>
</template>
