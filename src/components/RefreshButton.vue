<script setup>
defineProps({
  loading: { type: Boolean },
})
const emits = defineEmits(['refresh'])
</script>

<template>
  <v-btn size="small" variant="text" color="primary" icon
         @click="emits('refresh')" :disabled="loading">
    <v-icon :class="{'animation-rotate':loading}">mdi-refresh</v-icon>
  </v-btn>
</template>

<style scoped>
</style>
