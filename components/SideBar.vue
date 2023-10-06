<script setup>
import { useDisplay } from 'vuetify'

const router = useRouter()
const settingStore = useSettingStore()
// const accessStore = useAccessStore()

const { mobile } = useDisplay()
watch(mobile, () => settingStore.value.sideBarOpened = false)

</script>

<template>
  <v-navigation-drawer v-if="mobile" border="none" location="left" v-model="settingStore.sideBarOpened">

    <v-list :nav="true" density="comfortable">

      <v-list-item to="/" color="light-blue" rounded="xl" :active="router.currentRoute.value.name==='Home'">
        <template v-slot:prepend>
          <v-avatar color="light-blue" size="30">
            <v-icon color="white" class="text-body-1">mdi-home</v-icon>
          </v-avatar>
        </template>
        主页
      </v-list-item>

      <v-list-item to="/archive" color="orange" rounded="xl">
        <template v-slot:prepend>
          <v-avatar color="orange" size="30">
            <v-icon color="white" class="text-body-1">mdi-archive</v-icon>
          </v-avatar>
        </template>
        归档
      </v-list-item>

      <v-divider></v-divider>
      <v-list-subheader>固定的文章</v-list-subheader>

      <v-list-item v-for="{name,url} in settingStore.links" :to="`/${url}`" :key="url"
                   color="primary" rounded="xl">
        <template v-slot:prepend>
          <v-avatar color="primary" size="30">
            <v-icon color="white" class="text-body-1">mdi-book</v-icon>
          </v-avatar>
        </template>
        {{ name }}
      </v-list-item>

      <v-divider class="mb-2"></v-divider>
      <v-list-subheader>统计信息</v-list-subheader>

      <!--      <v-list-item color="cyan" title="今日阅读量" :subtitle="accessStore.baseInfo.today">-->
      <!--        <template v-slot:prepend>-->
      <!--          <v-avatar color="cyan" size="30">-->
      <!--            <v-icon color="white" class="text-body-1">mdi-book-open</v-icon>-->
      <!--          </v-avatar>-->
      <!--        </template>-->
      <!--      </v-list-item>-->

      <!--      <v-list-item color="pink" title="总阅读量" :subtitle="accessStore.baseInfo.all">-->
      <!--        <template v-slot:prepend>-->
      <!--          <v-avatar color="pink" size="30">-->
      <!--            <v-icon color="white" class="text-body-1">mdi-book-open</v-icon>-->
      <!--          </v-avatar>-->
      <!--        </template>-->
      <!--      </v-list-item>-->

    </v-list>

  </v-navigation-drawer>
</template>

<style scoped>

</style>
