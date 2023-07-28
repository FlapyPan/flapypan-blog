<script setup>
defineProps({
  articleList: {type: Array},
})
const emits = defineEmits(['onRoute'])

const formatDate = (s) => {
  const date = new Date(s)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${month}-${day} ${hours}:${minutes}`
}

</script>

<template>
  <v-list rounded="xl">
    <template v-for="{year,list} in articleList ?? []" :key="year">
      <v-list-item><h3 class="ml-3 mt-4">{{ year }}</h3></v-list-item>
      <v-list-item class="ma-3 py-3" rounded="xl" v-for="{title,createDate,path,tags} in list" :to="`/${path}`"
                   @click="emits('onRoute')">
        <template #title>
          <v-row dense>
            <v-col cols="12" sm="10">
              <v-row dense>
                <v-col cols="12" lg="4"><span class="mr-2">{{ title }}</span></v-col>
                <v-col align-self="stretch">
                  <div class="d-flex align-center">
                    <v-chip class="mr-1" size="small" color="primary" v-for="tag in tags || []"
                            :to="`/tag/${tag.name}`">
                      {{ tag.name }}
                    </v-chip>
                  </div>
                </v-col>
              </v-row>
            </v-col>
            <v-spacer></v-spacer>
            <v-col>
              <span>{{ formatDate(createDate) }}</span>
            </v-col>
          </v-row>
        </template>
      </v-list-item>
    </template>
  </v-list>
</template>

<style scoped>
.pagination {
  overflow-x: auto;
}
</style>
