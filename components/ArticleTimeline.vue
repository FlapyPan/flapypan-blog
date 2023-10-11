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
    <li v-for="{ id, title, createDate, path, tags } in list" :key="id">
      <span class="mr-2">{{ formatDate(createDate) }}</span>
      <f-btn :to="`/${path}`" text>
        {{ title }}
      </f-btn>
      <div class="flex-1"></div>
      <div class="hidden sm:flex items-center gap-2">
        <template v-for="({ name }) in tags" :key="name">
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
    list-style: none;
    position: relative;
    line-height: 1.6;
    padding: 8px 0;
    margin: 0 0 0 1rem;
    display: flex;
    align-items: center;
  }

  > li::before {
    @apply border-primary-500 border;

    content: "";
    position: absolute;
    left: -1.05rem;
    bottom: 0;
  }

  > li:not(:first-child):not(:last-child)::before {
    top: 0;
  }

  > li:first-child::before {
    top: 50%;
  }

  > li:last-child::before {
    top: 0;
    bottom: 50%;
  }

  > li::after {
    @apply bg-primary-500;

    content: "";
    left: -1.25rem;
    top: 50%;
    transform: translateY(-50%);
    height: .5rem;
    width: .5rem;
    border-radius: 50%;
    position: absolute;
  }

}
</style>
