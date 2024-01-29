<script setup>
defineProps({
  error: Object,
})

const settingStore = useSettingStore()

useServerSeoMeta({
  author: settingStore.value.name,
  ogImage: settingStore.value.banner ?? '/banner.webp',
})
</script>

<template>
  <Head>
    <Link :href="settingStore.favicon" rel="icon" />
  </Head>
  <div class="page flex flex-col justify-center items-center gap-6 p-6">
    <h2 class="text-xl">
      {{ error.statusCode }}
    </h2>
    <div
      class="px-6 py-3 bg-red-400 dark:bg-red-700 text-zinc-50 gap-2 flex flex-wrap items-center rounded-lg">
      <Icon class="text-lg" name="mingcute:close-circle-line" />
      <span class="text-sm">{{ error.message }}</span>
      <span class="flex-1"></span>
      <f-btn @click="clearError({ redirect: '/' })">返回主页</f-btn>
    </div>
    <dev-only>
      <textarea :value="JSON.stringify(error, null, 2)" class="w-full p-4" readonly rows="10" />
    </dev-only>
  </div>
</template>

<style scoped>

</style>
