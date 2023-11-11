<script setup>
const settingStore = useSettingStore()

const { data: { value: [settingData, linkData] } } = await useAsyncData('setting', () => Promise.all([
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
  <Head>
    <Link :href="settingStore.settings.favicon" rel="icon" />
  </Head>
  <NuxtLayout>
    <app-bar />
    <main class="px-3 sm:px-6 mx-auto">
      <NuxtPage />
      <footer class="mt-16 mb-12 text-sm flex flex-wrap items-center gap-3 justify-center">
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
