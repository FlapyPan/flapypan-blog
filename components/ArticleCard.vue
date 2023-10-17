<script setup>
const props = defineProps({
  article: {},
})
const emits = defineEmits(['onRoute'])

const settingStore = useSettingStore()

const coverSrc = ref(props.article.cover || settingStore.value.settings.banner)

const formatter = new Intl.DateTimeFormat(
  'zh-CN',
  {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/ShangHai',
  },
)
const formattedDate = computed(() => formatter.format(Date.parse(props.article.updateDate) ?? Date.now()))
</script>

<template>
  <nuxt-link class="article-card group" :to="`/${article.path}`" @click="emits('onRoute')">
    <img :src="coverSrc" alt="" class="absolute inset-0 -z-10 object-cover">
    <div class="rounded-b-xl flex flex-col justify-center p-4">
      <h3 class="text-lg">
        {{ article.title }}
      </h3>
      <div class="text-xs">
        {{ formattedDate }}
      </div>
    </div>
    <icon class="mr-4 text-xl transition-transform translate-x-12 group-hover:translate-x-0" name="mingcute:arrow-right-line" />
  </nuxt-link>
</template>

<style scoped>
.article-card {
  @apply relative rounded-xl overflow-hidden shadow sm:hover:shadow-lg transition flex items-center justify-between;

  &::after {
    content: "";
    @apply absolute inset-0 -z-10 bg-zinc-100 bg-opacity-80 dark:bg-zinc-800 dark:bg-opacity-70;
  }

}
</style>
