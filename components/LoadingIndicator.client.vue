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
  <div
    :style="style"
    class="safe-top-0 safe-right-0 safe-left-0 pointer-events-none fixed z-[99999] h-0.5 w-auto origin-left bg-gradient-to-r from-primary-300 to-primary-500 transition-all duration-300"
  ></div>
</template>

<style scoped lang="postcss">
</style>
