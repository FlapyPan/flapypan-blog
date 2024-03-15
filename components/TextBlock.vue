<script setup lang="ts">
import type { TextareaHTMLAttributes } from 'vue'

interface Props extends /* @vue-ignore */ Omit<TextareaHTMLAttributes, 'value' | 'placeholder'> {
  label?: string | null
  innerClass?: string | null
  placeholder?: string | null
}

const props = defineProps<Props>()
const value = defineModel<string | null>()

const id = computed(() => {
  if (props.name) return `text-block-${props.name}`
  return `text-block-${Math.random().toString(36).substring(2, 10)}`
})
const placeholderProp = computed<string>(() => props.placeholder ?? props.label ?? '')
</script>

<template>
  <div class="flex flex-col gap-2" :class="props.class">
    <label v-if="label" :for="id">{{ label }}</label>
    <textarea
      v-bind="$attrs"
      :id="id"
      v-model="value"
      class="flex-1"
      :class="innerClass"
      :placeholder="placeholderProp"
    />
  </div>
</template>
