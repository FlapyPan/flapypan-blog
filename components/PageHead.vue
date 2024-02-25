<script setup>
defineProps({
  title: { type: String, default: '' },
  subTitle: { type: String, default: '' }
})
</script>

<template>
  <section class="my-6 text-center">
    <h2 class="text-2xl font-bold text-zinc-700 dark:text-zinc-100 sm:text-3xl">
      <template v-if="title">
        {{ title }}
      </template>
      <template v-else>
        <slot name="title" />
      </template>
    </h2>
    <p class="my-2 text-base text-zinc-600 dark:text-zinc-400 md:my-4">
      <template v-if="subTitle">
        {{ subTitle }}
      </template>
      <template v-else>
        <slot name="subTitle" />
      </template>
    </p>
    <div class="jump-in-600">
      <slot />
    </div>
  </section>
</template>
