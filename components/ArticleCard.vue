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
  <article class="flex min-h-60 flex-col gap-2 md:flex-row md:gap-8">
    <nuxt-link
      :to="`/${article.path}`"
      class="w-full max-w-full md:max-w-md"
      @click="emits('onRoute')"
    >
      <img :src="coverSrc" alt="" class="aspect-video w-full rounded-lg object-cover">
    </nuxt-link>
    <section class="mt-4 flex h-full flex-1 flex-col items-start">
      <nuxt-link :to="`/${article.path}`" @click="emits('onRoute')">
        <h3 class="text-xl">
          {{ article.title }}
        </h3>
      </nuxt-link>
      <time class="mt-2 flex items-center gap-1 text-sm text-zinc-500">
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
      <p class="mt-4 text-sm leading-relaxed text-zinc-500">
        简介：{{ desc }}
      </p>
      <Btn
        class="mt-4"
        icon="mingcute:right-line"
        text
        :to="`/${article.path}`"
        @click="emits('onRoute')"
      >
        查看更多
      </Btn>
    </section>
  </article>
</template>
