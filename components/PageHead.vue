<script setup>
defineProps({
  title: { type: String, default: '' },
  subTitle: { type: String, default: '' },
})
</script>

<template>
  <section class="max-w-xl my-16">
    <h2 class="text-2xl font-bold text-zinc-700 dark:text-zinc-100 sm:text-4xl">
      <template v-if="title">
        {{ title }}
      </template>
      <template v-else>
        <slot name="title" />
      </template>
    </h2>
    <p class="my-6 text-base text-zinc-600 dark:text-zinc-400">
      <template v-if="subTitle">
        {{ subTitle }}
      </template>
      <template v-else>
        <slot name="subTitle" />
      </template>
    </p>
    <slot />
  </section>
</template>

<style scoped>

</style>
