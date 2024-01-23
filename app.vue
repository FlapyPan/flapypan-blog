<script setup>
const settingStore = useSettingStore()

await callOnce(async () => {
  const settingData = await api('/attribute/settings')
  if (settingData) {
    Object.assign(settingStore.value, settingData)
  }
})

if (import.meta.browser) {
  useAuth().check()
}

useServerSeoMeta({
  author: settingStore.value.name,
  ogImage: settingStore.value.banner ?? '/banner.webp',
})
</script>

<template>
  <Head>
    <Link :href="settingStore.favicon" rel="icon" />
  </Head>
  <NuxtLayout>
    <app-bar />
    <main class="px-3 sm:px-6 mx-auto">
      <NuxtPage />
    </main>
    <app-footer />
  </NuxtLayout>
</template>

<style scoped>
</style>
