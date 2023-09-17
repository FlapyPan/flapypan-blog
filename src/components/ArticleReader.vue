<script setup>
import { useThemeStore } from '@/store/theme'
import { MdCatalog, MdPreview } from 'md-editor-v3'
import { onBeforeUnmount, ref } from 'vue'
import { useDisplay } from 'vuetify'

const scrollElement = document.documentElement
const themeStore = useThemeStore()

const props = defineProps({
  data: { type: Object },
})

const { mobile } = useDisplay()
const catalogDrawer = ref(false)

if (!mobile.value) {
  setTimeout(() => {
    catalogDrawer.value = true
  }, 500)
}

onBeforeUnmount(() => {
  catalogDrawer.value = false
})

</script>

<template>
  <v-container class="markdown px-0">
    <MdPreview editor-id="read" :modelValue="data?.content ?? ''" preview-theme="default" codeTheme="gradient"
               :theme="themeStore.isDark?'dark':'light'" :noImgZoomIn="false" />

    <v-navigation-drawer v-model="catalogDrawer" border="none" location="right">
      <div class="ml-4 my-4">
        <MdCatalog :scroll-element="scrollElement" :scroll-element-offset-top="60" editor-id="read"
                   :theme="themeStore.isDark?'dark':'light'" v-if="data?.content" />
      </div>
    </v-navigation-drawer>

    <v-btn class="d-lg-none drawer-btn text-primary" @click="catalogDrawer=true"
           icon="mdi-menu"></v-btn>
  </v-container>
</template>

<style scoped>
.markdown :deep(.md-editor) {
  font-family: var(--fonts-proportional) !important;
}

.drawer-btn {
  position: fixed;
  right: 2rem;
  bottom: 3rem;
  z-index: 100;
}
</style>
