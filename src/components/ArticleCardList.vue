<script setup>
import ArticleCard from '@/components/ArticleCard.vue'
import { ref, watch } from 'vue'

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
  <v-row>
    <v-col v-for="a in articleData?.content ?? []" :key="a.id" cols="12" md="6" lg="4" xl="3">
      <article-card :article="a" @on-route="emits('onRoute')" />
    </v-col>
    <v-col v-if="pageable" cols="12" class="pagination">
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
