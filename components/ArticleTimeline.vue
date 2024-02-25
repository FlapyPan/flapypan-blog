<script setup>
defineProps({
  list: { type: Array, default: () => [] }
})
</script>

<template>
  <ul>
    <li
      v-for="{ _id, title, createdAt, path, tags } in list"
      :key="_id"
      class="relative flex items-center py-2"
    >
      <span class="mr-1 text-xs text-zinc-500">{{
        dateFormat(createdAt)
      }}</span>
      <Btn :to="`/${path}`" icon="mingcute:document-line" text>
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
