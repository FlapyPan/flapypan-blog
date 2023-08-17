<script setup>
import { ref, watch } from 'vue'
import ArticleCard from '@/components/ArticleCard.vue'

const props = defineProps({
  articleData: { type: Object },
  page: { type: Number },
  cols: { default: 12 },
  mdCols: { default: '6' },
})

const emits = defineEmits(['onPage', 'onRoute'])

const page = ref(props.page)
watch(page, () => emits('onPage', page.value))

</script>

<template>
  <v-row>
    <v-col v-for="a in articleData?.content ?? []" :key="a.id" :cols="cols" :md="mdCols">
      <article-card :article="a" @on-route="emits('onRoute')" />
    </v-col>
    <v-col cols="12" class="pagination">
      <v-pagination size="small" :length="articleData?.totalPages ?? 1" v-model="page" rounded="circle">
      </v-pagination>
    </v-col>
  </v-row>
</template>

<style scoped>
.pagination {
  overflow-x: auto;
}
</style>
