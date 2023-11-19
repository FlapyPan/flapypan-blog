<script setup>
defineProps({
  list: { type: Array, default: () => [] },
})

// 格式化时间
const formatter = new Intl.DateTimeFormat(
  'zh-CN',
  {
    month: '2-digit',
    day: '2-digit',
    hour12: false,
    timeZone: 'Asia/ShangHai',
  },
)
const formatDate = (s) => formatter.format(Date.parse(s) ?? Date.now())
</script>

<template>
  <ul class="timeline">
    <li v-for="{ _id, title, createdAt, path, tags } in list" :key="_id">
      <span class="mr-2">{{ formatDate(createdAt) }}</span>
      <f-btn :to="`/${path}`" text>
        {{ title }}
      </f-btn>
      <div class="flex-1"></div>
      <div class="hidden sm:flex items-center gap-2">
        <template v-for="name in tags" :key="name">
          <f-btn icon="mingcute:tag-line" :to="`/tag/${name}`" text>
            {{ name }}
          </f-btn>
        </template>
      </div>
    </li>
  </ul>
</template>

<style scoped>
ul.timeline {

  > li {
    @apply list-none relative px-2 flex items-center ml-6 leading-8 md:leading-10;
  }

  > li:not(:only-child) {

    &::before {
      @apply absolute top-0 bottom-0 left-[-0.8rem] border-primary-500 border;

      content: "";
    }

    &:first-child::before {
      @apply top-1/2;
    }

    &:last-child::before {
      @apply bottom-1/2;
    }

  }

  > li::after {
    @apply bg-primary-500 -left-4 top-1/2 transform -translate-y-1/2 h-2 w-2 rounded-full absolute;

    content: "";
  }

}
</style>
