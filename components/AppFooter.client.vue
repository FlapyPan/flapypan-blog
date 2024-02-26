<script setup lang="ts">
import { useSettingStore } from '~/store'

const settingStore = useSettingStore()
</script>

<template>
  <footer class="mx-auto max-w-3xl pb-12 text-center print:hidden">
    <p class="my-8 text-center text-zinc-500">
      {{ settingStore.setting.footer }}
    </p>
    <p class="mt-2 text-xs text-zinc-500">
      Powered by
      <a href="https://github.com/FlapyPan/flapypan-blog">FlapyBlog</a>
    </p>
  </footer>
</template>
