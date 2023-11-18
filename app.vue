<script setup>
defineProps({
  error: Object,
})
const settingStore = useSettingStore()

useAsyncData('init', async () => {
  const settingData = await api({ url: '/setting' })
  if (settingData) {
    settingStore.value.settings = {
      ...settingStore.value.settings,
      ...settingData,
    }
  }
  return 'ok'
}, { server: true, deep: false })

if (import.meta.browser) {
  api({ url: '/link' }).then((linkData) => {
    if (linkData) settingStore.value.links = linkData
  })
  useAuth().check()
}

useServerSeoMeta({
  author: settingStore.value.settings?.name,
  ogImage: settingStore.value.settings?.banner ?? '/banner.webp',
})
</script>

<template>
  <Head>
    <Link :href="settingStore.settings.favicon" rel="icon" />
  </Head>
  <NuxtLayout>
    <client-only>
      <app-bar />
    </client-only>
    <main class="px-3 sm:px-6 mx-auto">
      <NuxtPage />
      <footer class="jump-in-700 mt-16 mb-12 text-sm flex flex-wrap items-center gap-3 justify-center">
        <f-btn v-if="settingStore.settings.footer" icon="mingcute:information-line" text>
          {{ settingStore.settings.footer }}
        </f-btn>
        <f-btn
          v-if="settingStore.settings.ICP"
          href="https://beian.miit.gov.cn" icon="mingcute:shield-shape-line"
          target="https://beian.miit.gov.cn" text>
          {{ settingStore.settings.ICP }}
        </f-btn>
        <f-btn
          v-if="settingStore.settings.moeICP"
          :href="`https://icp.gov.moe/?keyword=${settingStore.settings.moeICP}`" icon="mingcute:cat-line"
          target="https://beian.miit.gov.cn" text>
          萌ICP备{{ settingStore.settings.moeICP }}号
        </f-btn>
      </footer>
    </main>
  </NuxtLayout>
</template>

<style scoped>
</style>
