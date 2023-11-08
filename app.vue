<script setup>
const settingStore = useSettingStore()

const {
  data: {
    value: [settingData, linkData],
  },
} = await useAsyncData('setting', () => Promise.all([
  api({ url: '/setting' }),
  api({ url: '/link' }),
]))
settingStore.value.settings = {
  ...settingStore.value.settings,
  ...settingData,
}
settingStore.value.links = linkData ?? []

if (process.browser) api({ url: `/auth` }).then((val) => settingStore.value.isLogin = !!val)

useServerSeoMeta({
  author: settingStore.value.settings?.name,
  ogImage: settingStore.value.settings?.banner ?? '/banner.webp',
})
</script>

<template>
  <div class="grid-bg">
  </div>
  <Head>
    <Link :href="settingStore.settings.favicon" rel="icon" />
  </Head>
  <NuxtLayout>
    <app-bar />
    <main class="px-3 sm:px-6 mx-auto">
      <NuxtPage />
      <footer class="text-center mt-16 mb-12 text-sm" v-text="settingStore.settings?.footer">
      </footer>
    </main>
  </NuxtLayout>
</template>

<style scoped>
.grid-bg {
  @apply -z-10 pointer-events-none fixed inset-0 select-none bg-top bg-repeat bg-fixed bg-[url('/grid-black.svg')] dark:bg-[url('/grid.svg')];
}
</style>
