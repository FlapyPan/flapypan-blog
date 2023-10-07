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
      <nuxt-link :to="`/${path}`">
        {{ title }}
      </nuxt-link>
      <v-spacer />
      <div class="d-none align-center d-sm-flex">
        <v-chip
          v-for="tag in (tags ?? [])" :key="tag.name" class="mr-1" size="small" :to="`/tag/${tag.name}`"
          :color="colorMap(tag.name)">
          {{ tag.name }}
        </v-chip>
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
    content: "";
    position: absolute;
    left: -1.05rem;
    bottom: 0;
    border-left: 1px solid rgb(var(--v-theme-primary));
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
    content: "";
    left: -1.28rem;
    top: 50%;
    transform: translateY(-50%);
    height: .5rem;
    width: .5rem;
    border-radius: 50%;
    position: absolute;
    background-color: rgb(var(--v-theme-primary));
  }

  > li a {
    color: currentColor;
    text-decoration-line: none;
  }

  > li a:hover {
    text-decoration-line: underline;
  }

}
</style>
