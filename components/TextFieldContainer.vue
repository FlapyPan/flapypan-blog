<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  cols?: 1 | 2 | 3
  mdCols?: 1 | 2 | 3
}>(), {
  cols: 1,
  mdCols: 2,
})
</script>

<template>
  <div class="mt-10">
    <template v-if="title">
      <h3 class="w-full text-lg">
        {{ title }}
      </h3>
      <hr class="mt-2 pb-4">
    </template>
    <div
      class="grid w-full gap-6" :class="[
        cols && `grid-cols-${cols}`,
        mdCols && `md:grid-cols-${mdCols}`,
      ]"
    >
      <slot />
    </div>
  </div>
</template>
