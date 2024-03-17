<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'
import type { ArticleWithoutContent } from '~/types/api'
import { useSettingStore } from '~/store'

const props = defineProps<{
  article: ArticleWithoutContent
}>()
const emits = defineEmits<{
  (e: 'onRoute'): void
}>()

const settingStore = useSettingStore()

const coverSrc = shallowRef(props.article.cover || settingStore.setting.banner)
const formattedUpdatedAt = useDateFormat(props.article?.updatedAt, 'YYYY-MM-DD HH:mm:ss')
const desc = computed(() => props.article.summary ?? props.article.title)
</script>

<template>
  <nuxt-link :to="`/${article.path}`" @click="emits('onRoute')">
    <article class="card flex min-h-60 flex-col rounded-3xl transition-colors hover:bg-primary-200 dark:hover:bg-primary-800 md:flex-row md:gap-2">
      <figure class="w-full max-w-full md:max-w-md">
        <img :src="coverSrc" alt="" class="aspect-video w-full rounded-3xl object-cover" />
      </figure>
      <section class="flex h-full flex-1 flex-col items-start p-6">
        <h3 class="text-xl font-medium">
          {{ article.title }}
        </h3>
        <time class="mt-2 flex items-center gap-1 text-sm">
          <Icon name="mingcute:time-line" />
          {{ formattedUpdatedAt }}
        </time>
        <p v-if="article.tags?.length > 0" class="mt-1 flex flex-wrap items-center gap-2">
          <Btn
            v-for="name in article.tags"
            :key="name"
            :to="`/tag/${name}`"
            icon="mingcute:hashtag-line"
            text
          >
            {{ name }}
          </Btn>
        </p>
        <p class="mt-3 text-sm leading-relaxed">
          简介：{{ desc }}
        </p>
      </section>
    </article>
  </nuxt-link>
</template>
