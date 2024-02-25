<script setup>
const visible = defineModel({ type: Boolean });
const props = defineProps({
  closable: { type: Boolean, default: true },
  role: { type: String, default: 'dialog' },
  location: { type: String, default: 'left' },
  size: { type: [String, Number], default: '20rem' },
  maxSize: { type: [String, Number], default: '100%' },
});

const computedTransition = computed(() => {
  const enterActiveClass = 'transition-gpu duration-200';
  const leaveActiveClass = 'transition-gpu duration-200';
  let hideClass = 'transform -translate-x-full';
  let showClass = 'transform translate-x-0';
  if (props.location.startsWith('right')) {
    hideClass = 'transform translate-x-full';
    showClass = 'transform translate-x-0';
  }
  if (props.location === 'top') {
    hideClass = 'transform -translate-y-full';
    showClass = 'transform translate-y-0';
  }
  if (props.location === 'bottom') {
    hideClass = 'transform translate-y-full';
    showClass = 'transform translate-y-0';
  }
  return {
    enterActiveClass,
    leaveActiveClass,
    enterFromClass: hideClass,
    enterToClass: showClass,
    leaveFromClass: showClass,
    leaveToClass: hideClass,
  };
});

const computedSize = computed(() => {
  const size = typeof props.size === 'number' ? `${props.size}px` : props.size;
  if (props.location === 'top' || props.location === 'bottom') {
    return `height: ${size};`;
  }
  return `width: ${size};`;
});
const computedMaxSize = computed(() => {
  const size = typeof props.maxSize === 'number' ? `${props.maxSize}px` : props.maxSize;
  if (props.location === 'top' || props.location === 'bottom') {
    return `max-height: ${size}; max-width: 100vw;`;
  }
  return `max-width: ${size}; max-height: 100vh;`;
});
const computedLocation = computed(() => {
  if (props.location === 'right' || props.location === 'right-top') {
    return 'top: var(--safe-top); right:var(--safe-right);';
  }
  if (props.location === 'right-bottom') {
    return 'bottom: var(--safe-bottom); right:var(--safe-right);';
  }
  if (props.location === 'top') {
    return 'top: var(--safe-top); right: var(--safe-right); left: var(--safe-left);';
  }
  if (props.location === 'bottom') {
    return 'bottom: var(--safe-bottom); right: var(--safe-right); left:var(--safe-left);';
  }
  if (props.location === 'left-bottom') {
    return 'bottom: var(--safe-bottom); right:var(--safe-left);';
  }
  return 'top: var(--safe-top); left: var(--safe-left);';
});
const computedStyle = computed(
  () => `${computedLocation.value} ${computedSize.value} ${computedMaxSize.value}`,
);

function close() {
  if (!props.closable) return;
  visible.value = false;
}
</script>

<template>
  <Teleport to="body">
    <div v-bind="$attrs" class="print:hidden">
      <Backdrop v-model="visible" @close="close"></Backdrop>
      <Transition v-bind="computedTransition">
        <div v-if="visible" role="menu" :style="computedStyle" class="fixed z-[100]">
          <div
            class="themed-scrollbar relative max-h-full max-w-full overflow-auto overscroll-contain p-4">
            <slot></slot>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>
