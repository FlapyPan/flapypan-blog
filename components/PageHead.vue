<script setup>
defineProps({
  title: { type: String, default: '' },
  subTitle: { type: String, default: '' },
})
</script>

<template>
  <section class="max-w-xl my-16">
    <h2 class="text-2xl font-bold text-zinc-700 dark:text-zinc-100 sm:text-4xl">
      {{ title }}
    </h2>
    <p class="mt-6 text-base text-zinc-600 dark:text-zinc-400">
      {{ subTitle }}
    </p>
  </section>
</template>

<style scoped>

</style>
