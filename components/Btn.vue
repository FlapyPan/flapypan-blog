<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string
    to?: string
    href?: string
    target?: string
    text?: boolean
    disabled?: boolean
  }>(),
  {
    icon: '',
    to: '',
    href: '',
    target: '',
    text: false,
    disabled: false,
  },
)
</script>

<template>
  <button
    :class="[text ? 'Btn--text' : 'Btn--normal']"
    :disabled="disabled"
    class="Btn"
    draggable="false"
  >
    <template v-if="to !== ''">
      <nuxt-link :to="to" class="Btn-content">
        <Icon v-if="icon" :name="icon" class="mr-1" />
        <slot />
      </nuxt-link>
    </template>
    <template v-else-if="href !== ''">
      <a :href="href" :target="target" class="Btn-content">
        <Icon v-if="icon" :name="icon" class="mr-1" />
        <slot />
      </a>
    </template>
    <template v-else>
      <span class="Btn-content">
        <Icon v-if="icon" :name="icon" class="mr-1" />
        <slot />
      </span>
    </template>
  </button>
</template>

<style scoped lang="postcss">
.Btn {
  @apply relative inline-block transform-gpu overflow-hidden text-sm text-current transition disabled:cursor-not-allowed disabled:opacity-60;

  .Btn-content {
    @apply flex items-center justify-center;
  }

  &.Btn--text {
    &:not([disabled]) {
      .Btn-content {
        @apply py-0.5 bg-gradient-to-r from-primary-200 to-primary-500 bg-no-repeat text-primary-500 transition-all;
        background-position-y: 100%;
        background-size: 0 0.09375rem;
      }

      &:hover {
        .Btn-content {
          background-size: 100% 0.09375rem;
        }
      }
    }
  }

  &.Btn--normal {
    @apply rounded-lg bg-white shadow dark:bg-zinc-800;

    .Btn-content {
      @apply px-2 py-2;
    }

    &:hover {
      @apply bg-primary-100 dark:bg-primary-950;
    }
  }
}
</style>
