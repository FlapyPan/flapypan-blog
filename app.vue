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
settingStore.value.links = {
  ...settingStore.value.links,
  ...linkData,
}

if (process.browser) api({ url: `/auth` }).then((val) => settingStore.value.isLogin = !!val)
</script>

<template>
  <Head>
    <Link rel="icon" :href="settingStore.settings.favicon" />
  </Head>
  <NuxtLayout>
    <v-app>
      <app-bar />
      <v-main class="main">
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

<style scoped>
.main {
  padding-top: 64px;
}
</style>
