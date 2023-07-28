<script setup>

</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="page" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style>
:root {
  --fonts-emoji: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Twemoji Mozilla" !important;
  --fonts-proportional: "LXGW WenKai Screen", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Noto Sans", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, var(--fonts-emoji) !important;
  --fonts-monospace: "JetBrains Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace, var(--fonts-proportional) !important;
}

html, body, .v-application [class*="text-"] { font-family: var(--fonts-proportional) !important; }

code, kbd, pre, samp { font-family: var(--fonts-monospace) !important; }

.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1em);
}

.md-editor-catalog-active > span {
  color: rgb(var(--v-theme-primary)) !important;
}

.md-editor-catalog-link span:hover {
  color: rgb(var(--v-theme-primary)) !important;
}

.md-editor, .md-editor-dark {
  --md-bk-color: rgb(var(--v-theme-background)) !important;
}

.md-editor .default-theme {
  --md-theme-link-color: rgb(var(--v-theme-primary)) !important;
  --md-theme-link-hover-color: rgb(var(--v-theme-primary)) !important;
}

.md-editor .default-theme a:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.md-editor .default-theme blockquote {
  border-left: 5px solid rgb(var(--v-theme-primary)) !important;
}

</style>
