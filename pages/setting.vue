<script setup>
const auth = useAuth()
const settingStore = useSettingStore()

if (import.meta.browser) {
  auth.state.value.loginDialogVisible = !auth.state.value.isLogin
}

/// region 博客设置
const savingSettings = ref(false)
const saveSettingError = ref(null)

async function saveSetting() {
  saveSettingError.value = null
  savingSettings.value = true
  try {
    const data = await api({ url: '/attribute/settings', method: 'POST', payload: settingStore.value })
    settingStore.value = {
      ...settingStore.value,
      ...data,
    }
  } catch (e) {
    saveSettingError.value = e.message
  } finally {
    savingSettings.value = false
  }
}

/// endregion 博客设置

/// region daemon 设置
const token = ref('')

function getToken() {
  token.value = sessionStorage.getItem('token') || localStorage.getItem('token')
}

/// endregion daemon 设置

const title = `设置 - ${settingStore.value.siteTitle ?? '博客'}`
const description = `博客设置`
const meta = {
  title,
  description,
  ogTitle: title,
  ogDescription: description,
}
useSeoMeta(meta)
</script>

<template>
  <div class="page">
    <template v-if="auth.state.value.isLogin">
      <div class="flex flex-col items-center gap-6">
        <h3 class="text-lg w-full">
          基础信息设置
        </h3>
        <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          <label class="text-sm flex flex-wrap items-center gap-4">
            <span>站点标题</span>
            <input
              v-model="settingStore.siteTitle" :disabled="savingSettings" class="flex-1" name="title"
              placeholder="站点标题" required type="text">
          </label>
          <label class="text-sm flex flex-wrap items-center gap-4">
            <span>站点图标链接</span>
            <input
              v-model="settingStore.favicon" :disabled="savingSettings" class="flex-1" name="favicon"
              placeholder="站点图标链接" required type="text">
          </label>
          <label class="text-sm flex flex-wrap items-center gap-4">
            <span>默认封面链接</span>
            <input
              v-model="settingStore.banner" :disabled="savingSettings" class="flex-1" name="banner"
              placeholder="默认封面链接" required type="text">
          </label>
        </div>
        <div class="w-full">
          <label class="text-sm flex flex-col gap-4">
            <span>站点底部信息（支持Markdown）</span>
            <textarea
              v-model="settingStore.footer"
              :disabled="savingSettings" class="p-2" name="footer"
              placeholder="站点底部信息" required type="text"></textarea>
          </label>
        </div>
        <h3 class="text-lg w-full">
          个人信息设置
        </h3>
        <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          <label class="text-sm flex flex-wrap items-center gap-4">
            <span>头像链接</span>
            <input
              v-model="settingStore.avatar" :disabled="savingSettings" class="flex-1" name="avatar"
              placeholder="头像链接" required type="text">
          </label>
          <label class="text-sm flex flex-wrap items-center gap-4">
            <span>作者名</span>
            <input
              v-model="settingStore.name" :disabled="savingSettings" class="flex-1" name="name"
              placeholder="作者名" required type="text">
          </label>
          <div class="flex items-center gap-4 col-span-2">
            <label class="text-sm flex flex-wrap items-center gap-4 flex-1">
              <span>站点信息</span>
              <input
                v-model="settingStore.info"
                :disabled="settingStore.hitoko || savingSettings" class="flex-1" name="info"
                placeholder="站点信息" required type="text">
            </label>
            <label class="text-sm flex flex-wrap items-center gap-2">
              <span>随机一言</span>
              <input
                v-model="settingStore.hitoko" :disabled="savingSettings" class="flex-1" name="hitoko"
                placeholder="随机一言" required type="checkbox">
            </label>
          </div>
          <label class="text-sm flex flex-wrap items-center gap-4">
            <span>邮箱</span>
            <input
              v-model="settingStore.email" :disabled="savingSettings" class="flex-1" name="email"
              placeholder="邮箱" required type="text">
          </label>
        </div>
        <h3 class="text-lg w-full">
          活动设置
        </h3>
        <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          <label class="text-sm flex flex-wrap items-center gap-4">
            <span>wakatime</span>
            <input
              v-model="settingStore.wakatime" :disabled="savingSettings" class="flex-1" name="wakatime"
              placeholder="wakatime" required type="text">
          </label>
        </div>
        <h3 class="text-lg w-full">
          Giscus 设置
        </h3>
        <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          <label class="text-sm flex flex-wrap items-center gap-4">
            <span>giscusRepo</span>
            <input
              v-model="settingStore.giscusRepo" :disabled="savingSettings" class="flex-1" name="giscusRepo"
              placeholder="giscusRepo" required type="text">
          </label>
          <label class="text-sm flex flex-wrap items-center gap-4">
            <span>giscusRepoId</span>
            <input
              v-model="settingStore.giscusRepoId" :disabled="savingSettings" class="flex-1"
              name="giscusRepoId"
              placeholder="giscusRepoId" required type="text">
          </label>
          <label class="text-sm flex flex-wrap items-center gap-4">
            <span>giscusCategory</span>
            <input
              v-model="settingStore.giscusCategory" :disabled="savingSettings" class="flex-1"
              name="giscusCategory"
              placeholder="giscusCategory" required type="text">
          </label>
          <label class="text-sm flex flex-wrap items-center gap-4">
            <span>giscusCategoryId</span>
            <input
              v-model="settingStore.giscusCategoryId" :disabled="savingSettings" class="flex-1"
              name="giscusCategoryId"
              placeholder="giscusCategoryId" required type="text">
          </label>
        </div>
        <error-alert :show="saveSettingError" :text="saveSettingError" />
        <f-btn :disabled="savingSettings" class="w-full my-8 max-w-xl" @click="saveSetting()">
          保存设置
        </f-btn>
        <h3 class="text-lg w-full">
          Daemon token
        </h3>
        <textarea
          v-model="token" class="p-2 w-full" name="token" placeholder="点击显示token" readonly type="text"
          @blur="token = ''" @focus="getToken"></textarea>
      </div>
    </template>
    <page-head v-else title="请登录" />
  </div>
</template>
