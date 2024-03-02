<script setup lang="ts">
import type { NuxtError } from '#app'
import { useSettingStore } from '~/store'

defineProps<{
  error: NuxtError
}>()

const settingStore = useSettingStore()

useSeoMeta({
  author: settingStore.setting.name,
  ogImage: settingStore.setting.banner ?? '/banner.webp',
})
</script>

<template>
  <Head>
    <Link :href="settingStore.setting.favicon" rel="icon" />
  </Head>
  <main class="page flex flex-col items-center justify-center gap-6 p-6">
    <h2 class="text-xl">
      {{ error.statusCode }}
    </h2>
    <div
      class="flex flex-wrap items-center gap-2 rounded-lg bg-red-400 px-6 py-3 text-zinc-50 dark:bg-red-700"
    >
      <Icon class="text-lg" name="mingcute:close-circle-line" />
      <span class="text-sm">{{ error.message }}</span>
      <span class="flex-1" />
      <Btn @click="clearError({ redirect: '/' })">
        返回主页
      </Btn>
    </div>
    <DevOnly>
      <textarea :value="JSON.stringify(error, null, 2)" class="w-full p-4" readonly rows="10" />
    </DevOnly>
  </main>
</template>
