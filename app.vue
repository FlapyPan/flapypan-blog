<script setup>
const nuxtApp = useNuxtApp()
const loading = ref(true)
nuxtApp.hook('page:finish', () => {
  loading.value = false
})

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
settingStore.value.links = {
  ...settingStore.value.links,
  ...linkData,
}
</script>

<template>
  <Head>
    <Link rel="icon" :href="settingStore.settings.favicon" />
  </Head>
  <NuxtLayout>
    <div v-if="loading" id="ld"></div>
    <v-app>
      <app-bar />
      <v-main>
        <NuxtPage />
        <footer class="text-center py-8 text-body-2 text-medium-emphasis" v-text="settingStore.settings?.footer">
        </footer>
      </v-main>
      <client-only>
        <side-bar />
      </client-only>
    </v-app>
  </NuxtLayout>
</template>
