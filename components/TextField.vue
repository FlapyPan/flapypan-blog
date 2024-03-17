<script setup lang="ts">
import type { InputHTMLAttributes } from 'vue'

interface Props extends /* @vue-ignore */ Omit<InputHTMLAttributes, 'value' | 'placeholder'> {
  label?: string | null
  innerClass?: string | null
  placeholder?: string | null
}

const props = defineProps<Props>()
const value = defineModel()

const id = computed(() => {
  if (props.name) return `text-field-${props.name}`
  return `text-field-${Math.random().toString(36).substring(2, 10)}`
})
const placeholderProp = computed<string>(() => props.placeholder ?? props.label ?? '')
</script>

<template>
  <div class="flex flex-wrap items-center gap-2" :class="props.class">
    <label v-if="label" :for="id">{{ label }}</label>
    <input
      v-bind="$attrs"
      :id="id"
      v-model="value"
      class="flex-1"
      :class="innerClass"
      :placeholder="placeholderProp"
    />
  </div>
</template>
