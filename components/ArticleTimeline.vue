<script setup>
defineProps({
  list: { type: Array, default: () => [] },
});
</script>

<template>
  <ul>
    <li
      v-for="{ _id, title, createdAt, path, tags } in list"
      :key="_id"
      class="relative flex items-center py-2">
      <span class="mr-1 text-xs text-zinc-500">{{ dateFormat(createdAt) }}</span>
      <f-btn :to="`/${path}`" icon="mingcute:document-line" text>
        {{ title }}
      </f-btn>
      <div class="flex-1"></div>
      <div class="hidden items-center gap-2 sm:flex">
        <f-btn
          v-for="name in tags"
          :key="name"
          :to="`/tag/${name}`"
          icon="mingcute:hashtag-line"
          text>
          {{ name }}
        </f-btn>
      </div>
    </li>
  </ul>
</template>
