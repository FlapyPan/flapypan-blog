<script setup>
defineProps({
  icon: { type: String, default: '' },
})
</script>

<template>
  <button draggable="false" class="btn">
    <span class="flex align-center justify-center">
      <icon v-if="icon !== ''" :name="icon" />
      <slot />
    </span>
  </button>
</template>

<style scoped>
.btn {
  @apply inline-block text-center px-3 py-2 rounded-lg text-sm border dark:border-gray-800 relative overflow-hidden
  bg-opacity-30 bg-white backdrop-blur-2xl backdrop-saturate-100 dark:bg-opacity-20 dark:bg-black
  transform-gpu hover:scale-105 active:scale-100 transition shadow hover:shadow-md active:shadow-none;

  &:hover::before {
    content: "";
    z-index: -2;
    @apply absolute bottom-0 w-4 h-4 left-1/2 -translate-x-1/2 bg-blue-400 select-none;
  }

  &:hover::after {
    content: "";
    z-index: -1;
    @apply absolute inset-0 backdrop-blur-xl select-none;
  }

}
</style>
