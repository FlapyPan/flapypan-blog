<script setup>
const settingStore = useSettingStore()

const title = `留言墙 - ${settingStore.value.settings.siteTitle ?? '博客'}`
const description = `在留言墙写下你的故事`
const meta = {
  title,
  description,
  ogTitle: title,
  ogDescription: description,
}
useServerSeoMeta(meta)
useSeoMeta(meta)
</script>

<template v-once>
  <div v-once class="page">
    <page-head
      :title="description"
      sub-title="在这里，你可以留下你想对我说的话，或是你的建议，或是你的想法，或是你的批评，或是你的赞美，或是你的鼓励，或是你的吐槽。" />
    <GiscusCard />
  </div>
</template>

<style scoped>

</style>
