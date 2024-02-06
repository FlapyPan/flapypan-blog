<script setup>
import { useToast } from 'vue-toastification';

const auth = useAuth();
const settingStore = useSettingStore();
const toast = useToast();

if (import.meta.browser) {
  auth.state.value.loginDialogVisible = !auth.state.value.isLogin;
}

/// region 博客设置
const savingSettings = shallowRef(false);

async function saveSetting() {
  savingSettings.value = true;
  try {
    const data = await api('/attribute/settings', 'POST', settingStore.value);
    settingStore.value = { ...settingStore.value, ...data };
    toast.success('设置保存成功');
  } finally {
    savingSettings.value = false;
  }
}
/// endregion

/// region daemon 设置
const token = shallowRef('');

function getToken() {
  token.value = sessionStorage.getItem('token') || localStorage.getItem('token');
}
/// endregion

/// region 自定义样式
const { data: customStyleValue } = useAsyncData(
  'customStyle',
  () => api('/attribute/custom-style'),
  { deep: false },
);
const savingCustomStyle = shallowRef(false);
async function saveCustomStyle() {
  savingCustomStyle.value = true;
  try {
    await api('/attribute/custom-style', 'POST', customStyleValue.value);
    toast.success('自定义样式保存成功，刷新页面生效');
  } finally {
    savingCustomStyle.value = false;
  }
}
/// endregion

/// region 自定义 js
const { data: customScriptValue } = useAsyncData(
  'customScript',
  () => api('/attribute/custom-script'),
  { deep: false },
);
const savingCustomScript = shallowRef(false);
async function saveCustomScript() {
  savingCustomScript.value = true;
  try {
    await api('/attribute/custom-script', 'POST', customScriptValue.value);
    toast.success('自定义脚本保存成功，刷新页面生效');
  } finally {
    savingCustomScript.value = false;
  }
}
/// endregion

const title = `设置 - ${settingStore.value.siteTitle ?? '博客'}`;
const description = `博客设置`;
const meta = {
  title,
  description,
  ogTitle: title,
  ogDescription: description,
};
useSeoMeta(meta);
</script>

<template>
  <div class="page">
    <template v-if="auth.state.value.isLogin">
      <div class="flex flex-col items-center gap-6">
        <h3 class="w-full text-lg">基础信息设置</h3>
        <div class="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          <label class="flex flex-wrap items-center gap-4 text-sm">
            <span>站点标题</span>
            <input
              v-model="settingStore.siteTitle"
              :disabled="savingSettings"
              class="flex-1"
              name="title"
              placeholder="站点标题"
              required
              type="text" />
          </label>
          <label class="flex flex-wrap items-center gap-4 text-sm">
            <span>站点图标链接</span>
            <input
              v-model="settingStore.favicon"
              :disabled="savingSettings"
              class="flex-1"
              name="favicon"
              placeholder="站点图标链接"
              required
              type="text" />
          </label>
          <label class="flex flex-wrap items-center gap-4 text-sm">
            <span>默认封面链接</span>
            <input
              v-model="settingStore.banner"
              :disabled="savingSettings"
              class="flex-1"
              name="banner"
              placeholder="默认封面链接"
              required
              type="text" />
          </label>
        </div>
        <div class="w-full">
          <label class="flex flex-col gap-4 text-sm">
            <span>站点底部信息</span>
            <textarea
              v-model="settingStore.footer"
              :disabled="savingSettings"
              class="p-2"
              name="footer"
              placeholder="站点底部信息"
              required
              type="text"></textarea>
          </label>
        </div>
        <h3 class="w-full text-lg">个人信息设置</h3>
        <div class="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          <label class="flex flex-wrap items-center gap-4 text-sm">
            <span>头像链接</span>
            <input
              v-model="settingStore.avatar"
              :disabled="savingSettings"
              class="flex-1"
              name="avatar"
              placeholder="头像链接"
              required
              type="text" />
          </label>
          <label class="flex flex-wrap items-center gap-4 text-sm">
            <span>作者名</span>
            <input
              v-model="settingStore.name"
              :disabled="savingSettings"
              class="flex-1"
              name="name"
              placeholder="作者名"
              required
              type="text" />
          </label>
          <div class="col-span-2 flex items-center gap-4">
            <label class="flex flex-1 flex-wrap items-center gap-4 text-sm">
              <span>站点信息</span>
              <input
                v-model="settingStore.info"
                :disabled="settingStore.hitoko || savingSettings"
                class="flex-1"
                name="info"
                placeholder="站点信息"
                required
                type="text" />
            </label>
            <label class="flex flex-wrap items-center gap-2 text-sm">
              <span>随机一言</span>
              <input
                v-model="settingStore.hitoko"
                :disabled="savingSettings"
                class="flex-1"
                name="hitoko"
                placeholder="随机一言"
                required
                type="checkbox" />
            </label>
          </div>
          <label class="flex flex-wrap items-center gap-4 text-sm">
            <span>邮箱</span>
            <input
              v-model="settingStore.email"
              :disabled="savingSettings"
              class="flex-1"
              name="email"
              placeholder="邮箱"
              required
              type="text" />
          </label>
        </div>
        <h3 class="w-full text-lg">活动设置</h3>
        <div class="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          <label class="flex flex-wrap items-center gap-4 text-sm">
            <span>wakatime</span>
            <input
              v-model="settingStore.wakatime"
              :disabled="savingSettings"
              class="flex-1"
              name="wakatime"
              placeholder="wakatime"
              required
              type="text" />
          </label>
        </div>
        <h3 class="w-full text-lg">Giscus 设置</h3>
        <div class="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          <label class="flex flex-wrap items-center gap-4 text-sm">
            <span>giscusRepo</span>
            <input
              v-model="settingStore.giscusRepo"
              :disabled="savingSettings"
              class="flex-1"
              name="giscusRepo"
              placeholder="giscusRepo"
              required
              type="text" />
          </label>
          <label class="flex flex-wrap items-center gap-4 text-sm">
            <span>giscusRepoId</span>
            <input
              v-model="settingStore.giscusRepoId"
              :disabled="savingSettings"
              class="flex-1"
              name="giscusRepoId"
              placeholder="giscusRepoId"
              required
              type="text" />
          </label>
          <label class="flex flex-wrap items-center gap-4 text-sm">
            <span>giscusCategory</span>
            <input
              v-model="settingStore.giscusCategory"
              :disabled="savingSettings"
              class="flex-1"
              name="giscusCategory"
              placeholder="giscusCategory"
              required
              type="text" />
          </label>
          <label class="flex flex-wrap items-center gap-4 text-sm">
            <span>giscusCategoryId</span>
            <input
              v-model="settingStore.giscusCategoryId"
              :disabled="savingSettings"
              class="flex-1"
              name="giscusCategoryId"
              placeholder="giscusCategoryId"
              required
              type="text" />
          </label>
        </div>
        <f-btn :disabled="savingSettings" class="my-8 w-full max-w-xl" @click="saveSetting()">
          保存设置
        </f-btn>
        <h3 class="w-full text-lg">自定义样式</h3>
        <textarea
          v-model="customStyleValue"
          class="w-full p-2"
          name="customStyle"
          placeholder="添加自定义样式"
          type="text"></textarea>
        <f-btn
          :disabled="savingCustomStyle"
          class="my-8 w-full max-w-xl"
          @click="saveCustomStyle()">
          保存自定义样式
        </f-btn>
        <h3 class="w-full text-lg">自定义脚本</h3>
        <textarea
          v-model="customScriptValue"
          class="w-full p-2"
          name="customScript"
          placeholder="添加自定义脚本"
          type="text"></textarea>
        <f-btn
          :disabled="savingCustomScript"
          class="my-8 w-full max-w-xl"
          @click="saveCustomScript()">
          保存自定义脚本
        </f-btn>
        <h3 class="w-full text-lg">Daemon token</h3>
        <textarea
          v-model="token"
          class="w-full p-2"
          name="token"
          placeholder="点击显示token"
          readonly
          type="text"
          @blur="token = ''"
          @focus="getToken"></textarea>
      </div>
    </template>
    <page-head v-else title="请登录" />
  </div>
</template>
