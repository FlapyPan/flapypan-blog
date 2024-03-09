<script setup lang="ts">
import { NuxtLink } from '#components'

const props = withDefaults(defineProps<{
  icon?: string
  to?: string
  href?: string
  target?: string
  text?: boolean
  disabled?: boolean
}>(), {
  icon: '',
  to: '',
  href: '',
  target: '',
  text: false,
  disabled: false,
})

const innerComponentIs = computed(() => {
  const { to, href, target } = props
  if (to !== '') {
    return { com: NuxtLink, bind: { to } }
  } else if (props.href !== '') {
    return { com: 'a', bind: { href, target } }
  }
  return { com: 'span', bind: {} }
})
</script>

<template>
  <button
    class="relative inline-flex items-center justify-center gap-1 overflow-hidden text-sm text-current transition disabled:cursor-not-allowed disabled:opacity-60"
    :class="[text ? 'hover:text-primary-500' : 'rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800']"
    v-bind="$attrs"
  >
    <Icon v-if="icon" :name="icon" />
    <Component :is="innerComponentIs.com" v-bind="innerComponentIs.bind">
      <slot />
    </Component>
  </button>
</template>
