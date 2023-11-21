<script setup>
defineProps({
  error: Object,
})
const settingStore = useSettingStore()

const settingData = await api({ url: '/attribute/settings' })
if (settingData) {
  settingStore.value = {
    ...settingStore.value,
    ...settingData,
  }
}

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
      <footer class="mt-16 mb-12 text-sm flex flex-wrap items-center gap-3 justify-center">
        <f-btn v-if="settingStore.footer" icon="mingcute:information-line" text>
          {{ settingStore.footer }}
        </f-btn>
        <f-btn
          v-if="settingStore.ICP"
          href="https://beian.miit.gov.cn" icon="mingcute:shield-shape-line"
          target="https://beian.miit.gov.cn" text>
          {{ settingStore.ICP }}
        </f-btn>
        <f-btn
          v-if="settingStore.moeICP"
          :href="`https://icp.gov.moe/?keyword=${settingStore.moeICP}`" icon="mingcute:cat-line"
          target="https://beian.miit.gov.cn" text>
          萌ICP备{{ settingStore.moeICP }}号
        </f-btn>
      </footer>
    </main>
  </NuxtLayout>
</template>

<style scoped>
</style>
