<script setup lang="ts">
import { NuxtLink } from '#components'

const props = withDefaults(defineProps<{
  icon?: string
  to?: string
  href?: string
  target?: string
  text?: boolean
  disabled?: boolean
  primary?: boolean
  secondary?: boolean
  single?: boolean
}>(), {
  icon: '',
  to: '',
  href: '',
  target: '',
  text: false,
  disabled: false,
  primary: false,
  secondary: false,
  single: false,
})

const componentIs = computed(() => {
  const { to, href, target } = props
  if (to !== '') {
    return { com: NuxtLink, bind: { to } }
  } else if (props.href !== '') {
    return { com: 'a', bind: { href, target } }
  }
  return { com: 'button', bind: {} }
})

const classNames = computed<string>(() => {
  if (props.text) return 'hover:text-primary-500'
  const base = props.single ? 'rounded-full p-3' : 'rounded-full px-3 py-2 gap-1'
  if (props.primary) return `${base} bg-primary-200 dark:bg-primary-800 hover:bg-primary-300 dark:hover:bg-primary-700`
  if (props.secondary) return `${base} bg-secondary-200 dark:bg-secondary-800 hover:bg-secondary-300 dark:hover:bg-secondary-700`
  return `${base} hover:bg-stone-200 dark:hover:bg-stone-700`
})
</script>

<template>
  <Component
    :is="componentIs.com"
    v-bind="componentIs.bind"
    class="relative inline-flex items-center justify-center overflow-hidden text-current transition disabled:cursor-not-allowed disabled:opacity-60"
    :class="classNames"
  >
    <Icon
      v-if="icon"
      class="inline-flex size-4 items-center justify-center"
      :class="{ 'mr-1': !single }"
      :name="icon"
    />
    <slot></slot>
  </Component>
</template>
