<script setup>
const props = defineProps({
  modelValue: { type: Number, default: 1 },
  pageData: { type: Object, default: () => ({}) },
})
const emits = defineEmits(['update:modelValue'])

const page = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val),
})
</script>

<template>
  <nav v-show="pageData.numberOfElements" class="flex justify-center items-center gap-4">
    <f-btn :disabled="page <= 1" text @click="page -= 1">
      <Icon class="mr-1" name="mingcute:arrow-left-circle-line" />
      上一页
    </f-btn>
    <f-btn :disabled="pageData.last" text @click="page += 1">
      下一页
      <Icon class="ml-1" name="mingcute:arrow-right-circle-line" />
    </f-btn>
  </nav>
</template>

<style scoped>

</style>
