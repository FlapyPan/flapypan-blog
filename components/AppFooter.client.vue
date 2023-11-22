<script setup lang="ts">
import { MdPreview } from 'md-editor-v3'

const settingStore = useSettingStore()
</script>

<template>
  <footer class="max-w-3xl mx-auto text-center pb-12">
    <md-preview
      v-if="settingStore.footer" :model-value="settingStore.footer"
      :no-img-zoom-in="true" :scroll-element="null"
      :theme="$colorMode.value" code-theme="gradient" editor-id="footer" preview-theme="default" />
    <p class="text-sm text-zinc-500">
      Powered by <a href="https://github.com/FlapyPan/flapypan-blog">FlapyBlog</a>
    </p>
  </footer>
</template>

<style scoped>

</style>
