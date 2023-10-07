<script setup>
const props = defineProps({
  article: {},
})
const emits = defineEmits(['onRoute'])

const settingStore = useSettingStore()

const formatter = new Intl.DateTimeFormat(
  'zh-CN',
  {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    timeZone: 'Asia/ShangHai',
  },
)
const formattedDate = computed(() => formatter.format(Date.parse(props.article.updateDate) ?? Date.now()))
</script>

<template>
  <v-card>
    <v-responsive v-ripple :aspect-ratio="16 / 9" class="cover-container">
      <nuxt-link :to="`/${article.path}`" @click="emits('onRoute')">
        <v-img height="100%" width="100%" :src="article.cover" cover class="cover">
          <template #error>
            <v-img height="100%" width="100%" cover :src="settingStore.settings.banner" />
          </template>
        </v-img>
      </nuxt-link>
    </v-responsive>

    <v-card-title class="article-title">
      <nuxt-link :to="`/${article.path}`" class="text-decoration-none text-black" @click="emits('onRoute')">
        {{ article.title }}
      </nuxt-link>
    </v-card-title>

    <v-card-item>
      <div class="d-flex align-center flex-wrap">
        <v-chip
          v-for="tag in article.tags || []" :key="tag.id" class="mr-1" size="small"
          :color="colorMap(tag.name)" :to="`/tag/${tag.name}`">
          {{ tag.name }}
        </v-chip>
        <v-card-subtitle v-if="article.tags?.length === 0" class="mx-1">
          null
        </v-card-subtitle>
      </div>
    </v-card-item>

    <v-card-subtitle class="mb-2">
      <p class="text-caption">
        {{ formattedDate }}
      </p>
    </v-card-subtitle>
  </v-card>
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
