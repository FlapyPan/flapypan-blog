<script setup lang="ts">
import { useAuthStore, useSettingStore } from '~/store'

const auth = useAuthStore()
const settingStore = useSettingStore()

await callOnce(settingStore.load)

if (import.meta.browser) {
  auth.check()
  callOnce(() => {
    // 将自定义样式添加至 head
    api<string>('/attribute/custom-style').then((data) => {
      if (!data) return
      const style = document.createElement('style')
      style.textContent = data
      document.head.appendChild(style)
    })
    // 将自定义脚本添加至 body
    api<string>('/attribute/custom-script').then((data) => {
      if (!data) return
      const script = document.createElement('script')
      script.textContent = data
      document.body.appendChild(script)
    })
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
