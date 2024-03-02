<script setup lang="ts">
const { progress, isLoading } = useLoadingIndicator({
  duration: 2000,
  throttle: 200,
})
const style = computed(() => ({
  opacity: isLoading.value ? 1 : 0,
  backgroundSize: `${(100 / progress.value) * 100}% auto`,
  transform: `scaleX(${progress.value}%)`,
}))
</script>

<template>
  <div :style="style" class="loading-indicator safe-top-0 safe-right-0 safe-left-0" />
</template>

<style scoped lang="postcss">
.loading-indicator {
  height: 3px;
  @apply pointer-events-none fixed z-[99999] w-auto;
  @apply origin-left bg-gradient-to-r from-primary-300 to-primary-500 transition-all duration-300;
}
</style>
