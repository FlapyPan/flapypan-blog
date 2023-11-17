<script setup>
defineProps({
  icon: { type: String, default: '' },
  to: { type: String, default: '' },
  href: { type: String, default: '' },
  target: { type: String, default: '_self' },
  text: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})
</script>

<template>
  <button draggable="false" :disabled="disabled" class="f-btn" :class="[text ? 'f-btn--text' : 'f-btn--normal']">
    <template v-if="to !== ''">
      <nuxt-link :to="to" class="f-btn-content">
        <icon v-if="icon !== ''" class="mr-1" :name="icon" />
        <slot />
      </nuxt-link>
    </template>
    <template v-else-if="href !== ''">
      <a :href="href" :target="target" class="f-btn-content">
        <icon v-if="icon !== ''" class="mr-1" :name="icon" />
        <slot />
      </a>
    </template>
    <template v-else>
      <span class="f-btn-content">
        <icon v-if="icon !== ''" class="mr-1" :name="icon" />
        <slot />
      </span>
    </template>
  </button>
</template>

<style scoped>
.f-btn {
  @apply text-current inline-block text-sm relative overflow-hidden disabled:cursor-not-allowed disabled:opacity-60;

  &:not([disabled]) {
    @apply transform-gpu transition;
  }

  .f-btn-content {
    @apply flex items-center justify-center;
  }

  &.f-btn--text {

    &:not([disabled]) {
      .f-btn-content {
        @apply bg-gradient-to-r from-primary-300 to-primary-500 bg-no-repeat transition-all;
        background-position-y: 100%;
        background-size: 0 1.5px;
      }

      &:hover {
        .f-btn-content {
          background-size: 100% 1.5px;
        }
      }
    }
  }

  &.f-btn--normal {
    @apply rounded-lg
    bg-opacity-30 bg-white backdrop-blur-xl backdrop-saturate-100 dark:bg-opacity-20 dark:bg-zinc-800;

    .f-btn-content {
      @apply px-2 py-2;
    }

  }

}
</style>
