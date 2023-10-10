<script setup>
const props = defineProps({
  article: {},
})
const emits = defineEmits(['onRoute'])

const settingStore = useSettingStore()

const coverSrc = ref(props.article.cover || settingStore.value.settings.banner)

function onCoverError() {
  coverSrc.value = settingStore.value.settings.banner
}

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
  <article
    class="rounded-xl overflow-hidden transition shadow hover:shadow-lg w-full aspect-video relative bg-white dark:bg-black">
    <client-only :placeholder="coverSrc">
      <img
        :src="coverSrc" :alt="article.title" class="rounded-xl h-full w-full object-cover transform brightness-90 dark:brightness-75"
        @error.once="onCoverError">
    </client-only>
    <nuxt-link
      class="rounded-b-xl  absolute bottom-0 left-0 right-0 h-1/3 bg-white backdrop-blur bg-opacity-70 dark:bg-black dark:bg-opacity-80"
      :to="`/${article.path}`" @click="emits('onRoute')">
      <div class="h-full flex flex-col justify-center pl-4">
        <h3 class="text-lg text-zinc-700 dark:text-zinc-100">
          {{ article.title }}
        </h3>
        <div class="text-xs text-zinc-600 dark:text-zinc-400">
          {{ formattedDate }}
        </div>
      </div>
    </nuxt-link>
  </article>
</template>

<style scoped>
.cover-container {
  overflow: hidden;

  .cover {
    transition: transform .3s;
  }

  &:hover .cover {
    transform: scale(1.1);
  }
}

.article-title {
  padding: 0.5rem 1rem;
}
</style>
