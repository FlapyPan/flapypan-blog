<script setup>
const props = defineProps({
  articleData: { type: Object },
  pageable: { type: Boolean },
  page: { type: Number },
})

const emits = defineEmits(['onPage', 'onRoute'])

const page = ref(props.page)
watch(page, () => emits('onPage', page.value))
</script>

<template>
  <div>
    <div class="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6">
      <article-card v-for="a in articleData?.content ?? []" :key="a.id" :article="a" @on-route="emits('onRoute')" />
    </div>
    <div v-if="pageable" class="text-center my-6">
      <f-btn :disabled="page <= 1" text>
        上一页
      </f-btn>
      <f-btn text>
        下一页
      </f-btn>
    </div>
  </div>
</template>

<style scoped>
.pagination {
  overflow-x: auto;
}
</style>
