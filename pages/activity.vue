<script setup lang="ts">
import { useSettingStore } from '~/store'
import '~/assets/css/github-languages-colors.css'

const settingStore = useSettingStore()

type Repo = {
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
  { deep: false },
)

const title = `活动 - ${settingStore.setting.siteTitle ?? '博客'}`
const description = `看看我最近鼓捣了些什么玩意吧`
const meta = {
  title,
  description,
  ogTitle: title,
  ogDescription: description,
}
useServerSeoMeta(meta)
useSeoMeta(meta)
</script>

<template v-once>
  <div class="page">
    <PageHead v-once :sub-title="description" title="最近活动" />
    <figure v-if="settingStore.setting.wakatime" class="mx-auto mb-6 max-w-3xl">
      <embed :src="settingStore.setting.wakatime" />
    </figure>
    <h3 class="mb-6 ml-2 text-xl">Github 仓库</h3>
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" v-auto-animate>
      <a
        v-for="repo in repos"
        :key="repo._id"
        :href="repo.html_url"
        class="group flex flex-col gap-2 overflow-hidden rounded-xl bg-zinc-50 p-4 transition dark:bg-zinc-900"
        target="_blank">
        <p class="text-lg underline-offset-2 group-hover:underline">
          {{ repo.full_name }}
        </p>
        <p class="py-2 text-xs text-zinc-500">{{ repo.description }}</p>
        <p class="flex-1"></p>
        <p class="flex items-center gap-4 text-sm">
          <span v-if="repo.language" class="flex items-center">
            <span class="flex items-center text-zinc-500">
              <Icon
                :class="`lang-${repo.language}`"
                class="mr-1 text-base"
                name="mingcute:round-fill"></Icon>
            </span>
            {{ repo.language }}
          </span>
          <span v-if="repo.stargazers_count >= 0" class="flex items-center">
            <Icon class="mr-1 text-base text-zinc-500" name="mingcute:star-line" />
            {{ repo.stargazers_count }}
          </span>
          <span v-if="repo.forks >= 0" class="flex items-center">
            <Icon class="mr-1 text-base text-zinc-500" name="mingcute:git-merge-line" />
            {{ repo.forks }}
          </span>
          <span class="flex-1"></span>
          <Icon class="text-base text-zinc-500" name="mdi:github" />
        </p>
      </a>
    </div>
    <p v-if="!fetchingRepos && !repos?.length" class="py-2 text-center text-sm text-zinc-500">
      暂无数据
    </p>
    <p v-show="fetchingRepos" class="py-2 text-center text-sm text-zinc-500">加载中...</p>
  </div>
</template>
