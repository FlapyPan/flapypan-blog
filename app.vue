<script setup lang="ts">
import { useAuthStore, useSettingStore } from '~/store'

const auth = useAuthStore()
const settingStore = useSettingStore()

await callOnce(settingStore.load)

if (import.meta.browser) {
  auth.check()
  callOnce(() => {
    // 将自定义样式添加至 head
    const link = document.createElement('link')
    link.href = '/api/attribute/custom-style'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    // 将自定义脚本添加至 body
    const script = document.createElement('script')
    script.src = '/api/attribute/custom-script'
    document.body.appendChild(script)
  })
}
</script>

<template>
  <Head>
    <Link :href="settingStore.setting.favicon" rel="icon" />
  </Head>
  <NuxtLayout>
    <LoadingIndicator />
    <AppBar />
    <NuxtPage />
    <AppFooter />
  </NuxtLayout>
</template>
