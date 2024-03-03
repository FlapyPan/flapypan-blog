<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string
    closable?: boolean
    role?: string
  }>(),
  {
    title: '',
    closable: false,
    role: 'dialog',
  },
)
const visible = defineModel<boolean>()
function close() {
  if (!props.closable) return
  visible.value = false
}
</script>

<template>
  <Teleport to="body">
    <Backdrop v-model="visible" @close="close" />
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-75 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-75 opacity-0"
    >
      <dialog
        v-if="visible"
        open
        :role="role"
        v-bind="$attrs"
        class="fixed inset-0 z-[100] w-96 max-w-full overscroll-contain rounded-xl bg-white p-4 text-current border-all dark:bg-black print:hidden"
        @close="close"
      >
        <h3 v-if="title" class="text-lg font-medium leading-6">
          {{ title }}
        </h3>
        <div class="mt-2">
          <slot />
        </div>
      </dialog>
    </Transition>
  </Teleport>
</template>
