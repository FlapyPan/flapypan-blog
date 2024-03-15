<script setup lang="ts">
import { useSettingStore } from '~/store'
import '~/assets/css/github-languages-colors.css'

const settingStore = useSettingStore()

interface Repo {
  _id: string
  name: string
  html_url: string
  description: string
  stargazers_count: number
  full_name: string
  language?: string
  forks: number
}

const { data: repos, pending: fetchingRepos } = useLazyAsyncData(
  `activity:${settingStore.setting.name}:repos`,
  () => $fetch<Repo[]>(`https://api.github.com/users/${settingStore.setting.name}/repos`),
  { deep: false, server: false },
)

const title = `活动 - ${settingStore.setting.siteTitle ?? '博客'}`
const description = `看看我最近鼓捣了些什么玩意吧`
const meta = {
  title,
  description,
  ogTitle: title,
  ogDescription: description,
}
useSeoMeta(meta)
</script>

<template v-once>
  <main class="page">
    <h3 class="mb-6 ml-2 text-xl">
      Github 仓库
    </h3>
    <div v-auto-animate class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <a
        v-for="repo in repos"
        :key="repo._id"
        :href="repo.html_url"
        class="card group flex flex-col gap-2 overflow-hidden rounded-xl p-4 transition"
        target="_blank"
      >
        <p class="text-lg underline-offset-2 group-hover:underline">
          {{ repo.full_name }}
        </p>
        <p class="py-2 text-stone-500">{{ repo.description }}</p>
        <p class="flex-1" />
        <p class="flex items-center gap-4">
          <span v-if="repo.language" class="flex items-center">
            <span class="flex items-center text-stone-500">
              <Icon
                :class="`lang-${repo.language}`"
                class="mr-1 text-base"
                name="mingcute:round-fill"
              />
            </span>
            {{ repo.language }}
          </span>
          <span v-if="repo.stargazers_count >= 0" class="flex items-center">
            <Icon class="mr-1 text-base text-stone-500" name="mingcute:star-line" />
            {{ repo.stargazers_count }}
          </span>
          <span v-if="repo.forks >= 0" class="flex items-center">
            <Icon class="mr-1 text-base text-stone-500" name="mingcute:git-merge-line" />
            {{ repo.forks }}
          </span>
          <span class="flex-1" />
          <Icon class="text-base text-stone-500" name="mdi:github" />
        </p>
      </a>
    </div>
    <p v-if="!fetchingRepos && !repos?.length" class="py-2 text-center text-stone-500">
      暂无数据
    </p>
    <p v-show="fetchingRepos" class="py-2 text-center text-stone-500">
      加载中...
    </p>
    <figure v-if="settingStore.setting.wakatime" class="mt-8 max-w-3xl">
      <embed :src="settingStore.setting.wakatime">
    </figure>
  </main>
</template>
