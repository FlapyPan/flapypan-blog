<script setup lang="ts">
import { useSettingStore } from '~/store'

const settingStore = useSettingStore()
</script>

<template>
  <footer class="mx-auto max-w-3xl py-16 text-center print:hidden">
    <p>
      {{ settingStore.setting.footer }}
    </p>
    <p class="mt-2">
      Powered by
      <a href="https://github.com/FlapyPan/flapypan-blog">FlapyBlog</a>
    </p>
  </footer>
</template>
