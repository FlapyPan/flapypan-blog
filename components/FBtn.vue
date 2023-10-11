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
        @apply bg-gradient-to-r from-cyan-500 to-blue-500 bg-no-repeat transition-all drop-shadow-md;
        background-position-y: 100%;
        background-size: 0 2px;
      }

      &:hover {
        .f-btn-content {
          background-size: 100% 2px;
        }
      }
    }
  }

  &.f-btn--normal {
    @apply rounded-lg border dark:border-gray-800
    bg-opacity-30 bg-white backdrop-blur-2xl backdrop-saturate-100 dark:bg-opacity-20 dark:bg-black;

    &:not([disabled]) {
      @apply hover:shadow-md active:shadow-none;

      &:hover::before {
        content: "";
        z-index: -2;
        @apply absolute bottom-0 w-4 h-4 left-1/2 -translate-x-1/2 bg-blue-400 select-none;
      }

      &:hover::after {
        content: "";
        z-index: -1;
        @apply absolute inset-0 backdrop-blur-xl select-none;
      }
    }

    .f-btn-content {
      @apply px-2 py-2;
    }

  }

}
</style>
