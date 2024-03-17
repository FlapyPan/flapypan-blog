<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'
import type { ArticleWithoutContent } from '~/types/api'

withDefaults(defineProps<{ list?: ArticleWithoutContent[] }>(), { list: () => [] })
</script>

<template>
  <ul>
    <li
      v-for="{ _id, title, createdAt, path, tags, summary } in list"
      :key="_id"
      class="relative flex items-center py-2"
    >
      <span class="mr-1 text-stone-500">{{ useDateFormat(createdAt, 'YYYY-MM-DD').value }}</span>
      <Btn :to="`/${path}`" icon="mingcute:document-line" text :title="summary ?? title">
        {{ title }}
      </Btn>
      <div class="flex-1"></div>
      <div class="hidden items-center gap-2 sm:flex">
        <Btn
          v-for="name in tags"
          :key="name"
          :to="`/tag/${name}`"
          icon="mingcute:hashtag-line"
          text
        >
          {{ name }}
        </Btn>
      </div>
    </li>
  </ul>
</template>
