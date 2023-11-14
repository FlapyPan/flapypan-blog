<script setup>
defineProps({
  error: Object,
})

const settingStore = useSettingStore()

useServerSeoMeta({
  author: settingStore.value.settings?.name,
  ogImage: settingStore.value.settings?.banner ?? '/banner.webp',
})
</script>

<template>
  <Head>
    <Link :href="settingStore.settings.favicon" rel="icon" />
  </Head>
  <div class="page flex flex-col justify-center items-center gap-6 p-6">
    <h2 class="text-xl">
      {{ error.statusCode }}
    </h2>
    <error-alert :show="true" :text="error.message" redirect />
    <dev-only>
      <textarea :value="JSON.stringify(error, null, 2)" class="w-full p-4" readonly rows="10" />
    </dev-only>
  </div>
</template>

<style scoped>

</style>
