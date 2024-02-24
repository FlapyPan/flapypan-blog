<script setup>
import { useSettingStore } from '~/store';

const props = defineProps({
  article: {},
});
const emits = defineEmits(['onRoute']);

const settingStore = useSettingStore();

const coverSrc = shallowRef(props.article.cover || settingStore.setting.banner);

const formattedDate = useDateTimeFormat(props.article.updatedAt);
</script>

<template>
  <nuxt-link
    :to="`/${article.path}`"
    class="group relative flex items-center justify-between overflow-hidden rounded-xl border-2 border-transparent transition hover:border-primary-500"
    @click="emits('onRoute')">
    <img :src="coverSrc" alt="" class="absolute inset-0 -z-10 object-cover object-center" />
    <div class="flex flex-col justify-center rounded-b-xl p-5">
      <h3 class="text-lg">
        {{ article.title }}
      </h3>
      <div class="text-xs">
        {{ formattedDate }}
      </div>
    </div>
    <Icon
      class="mr-4 translate-x-12 text-xl text-primary-500 transition-transform group-hover:translate-x-0 dark:text-primary-300"
      name="mingcute:arrow-right-line" />
    <div
      class="absolute inset-0 -z-10 bg-zinc-100 bg-opacity-60 dark:bg-zinc-800 dark:bg-opacity-60"></div>
  </nuxt-link>
</template>
