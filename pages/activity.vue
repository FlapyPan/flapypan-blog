<script setup>
const settingStore = useSettingStore()

const { data: repos, error: reposError } = useAsyncData(
  `activity:${settingStore.value.settings.name}:repos`,
  async () => $fetch(`https://api.github.com/users/${settingStore.value.settings.name}/repos`),
)

const title = `活动 - ${settingStore.value.settings.siteTitle ?? '博客'}`
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
    <page-head v-once :sub-title="description" title="最近活动" />
    <h3 class="text-xl mb-6 ml-2">
      Github 仓库
    </h3>
    <error-alert v-show="reposError" :text="reposError" />
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <a
        v-for="repo in repos" :key="repo.id" :href="repo.html_url"
        class="group flex flex-col gap-2 rounded-xl overflow-hidden shadow sm:hover:shadow-lg transition p-4 bg-zinc-50 dark:bg-zinc-800"
        target="_blank">
        <p class="text-lg group-hover:underline underline-offset-2">{{ repo.full_name }}</p>
        <p class="text-xs py-2 text-zinc-500">{{ repo.description }}</p>
        <p class="flex-1"></p>
        <p class="text-sm flex items-center gap-4">
          <span v-if="repo.language" class="flex items-center">
            <span class="text-zinc-500 flex items-center">
              <icon :class="`lang-${repo.language}`" class="text-base mr-1" name="mingcute:round-fill"></icon>
            </span>
            {{ repo.language }}
          </span>
          <span v-if="repo.stargazers_count >= 0" class="flex items-center">
            <icon class="text-base text-zinc-500 mr-1" name="mingcute:star-line" />
            {{ repo.stargazers_count }}
          </span>
          <span v-if="repo.forks >= 0" class="flex items-center">
            <icon class="text-base text-zinc-500 mr-1" name="mingcute:git-merge-line" />
            {{ repo.forks }}
          </span>
          <span class="flex-1"></span>
          <icon class="text-base text-zinc-500" name="mdi:github" />
        </p>
      </a>
    </div>
  </div>
</template>

<style scoped>

</style>
