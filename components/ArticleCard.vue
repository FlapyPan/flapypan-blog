<script setup>
const props = defineProps({
  article: {},
});
const emits = defineEmits(['onRoute']);

const settingStore = useSettingStore();

const coverSrc = shallowRef(props.article.cover || settingStore.value.banner);

const formattedDate = useDateTimeFormat(props.article.updatedAt);
</script>

<template>
  <nuxt-link class="article-card group" :to="`/${article.path}`" @click="emits('onRoute')">
    <img :src="coverSrc" alt="" class="absolute inset-0 -z-10 object-cover object-center">
    <div class="rounded-b-xl flex flex-col justify-center p-4">
      <h3 class="text-lg">
        {{ article.title }}
      </h3>
      <div class="text-xs">
        {{ formattedDate }}
      </div>
    </div>
    <Icon class="mr-4 text-xl transition-transform translate-x-12 group-hover:translate-x-0"
          name="mingcute:arrow-right-line" />
  </nuxt-link>
</template>

<style scoped>
.article-card {
  @apply relative rounded-xl overflow-hidden transition flex items-center justify-between;

  &::after {
    content: "";
    @apply absolute inset-0 -z-10 bg-zinc-100 bg-opacity-60 dark:bg-zinc-800 dark:bg-opacity-50;
  }

}
</style>
