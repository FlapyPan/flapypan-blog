<script setup>
const visible = defineModel({ type: Boolean });
const props = defineProps({
  title: { type: String, default: '' },
  closable: { type: Boolean, default: false },
  role: { type: String, default: 'dialog' },
});

function close() {
  if (!props.closable) return;
  visible.value = false;
}
</script>

<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition duration-300"
      enter-from-class="transform opacity-0"
      enter-to-class="transform opacity-100"
      leave-active-class="transition duration-300"
      leave-from-class="transform opacity-100"
      leave-to-class="transform opacity-0">
      <div
        v-show="visible"
        @click="close"
        class="fixed inset-0 z-50 overflow-x-hidden overscroll-contain bg-black bg-opacity-50 dark:bg-opacity-70"></div>
    </transition>
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-75 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-75 opacity-0">
      <dialog
        v-show="visible"
        open
        :role="role"
        class="fixed inset-0 z-[100] w-96 max-w-full overscroll-contain rounded-xl bg-zinc-100 p-4 text-current dark:bg-zinc-900"
        @close="close">
        <h3 v-if="title" class="text-lg font-medium leading-6">
          {{ title }}
        </h3>
        <div class="mt-2">
          <slot></slot>
        </div>
      </dialog>
    </transition>
  </Teleport>
</template>
