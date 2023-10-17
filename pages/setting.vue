<script setup>
const setting = useSettingStore()

onMounted(() => {
  if (!setting.value.isLogin) setting.value.loginDialogVisible = true
})
</script>

<template>
  <div class="page">
    <client-only>
      <template v-if="setting.isLogin">
      </template>
      <page-head v-else title="请登录" />
    </client-only>
  </div>
</template>

<style scoped>

</style>
