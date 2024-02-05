<script setup>
const settingStore = useSettingStore();

await callOnce(async () => {
  const settingData = await api('/attribute/settings');
  if (settingData) {
    Object.assign(settingStore.value, settingData);
  }
});

if (import.meta.browser) {
  useAuth().check();
  callOnce(() => {
    // 将自定义样式添加至 head
    api('/attribute/custom-style').then((data) => {
      if (!data) return;
      const style = document.createElement('style');
      style.textContent = data;
      document.head.appendChild(style);
    });
    // 将自定义脚本添加至 body
    api('/attribute/custom-script').then((data) => {
      if (!data) return;
      const script = document.createElement('script');
      script.textContent = data;
      document.body.appendChild(script);
    });
  });
}
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
