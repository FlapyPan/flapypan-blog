<script setup>
defineProps({
  error: Object,
});

const settingStore = useSettingStore();

useServerSeoMeta({
  author: settingStore.value.name,
  ogImage: settingStore.value.banner ?? '/banner.webp',
});
</script>

<template>
  <Head>
    <Link :href="settingStore.favicon" rel="icon" />
  </Head>
  <div class="page flex flex-col items-center justify-center gap-6 p-6">
    <h2 class="text-xl">
      {{ error.statusCode }}
    </h2>
    <div
      class="flex flex-wrap items-center gap-2 rounded-lg bg-red-400 px-6 py-3 text-zinc-50 dark:bg-red-700">
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
