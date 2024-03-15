<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { useAuthStore, useSettingStore } from '~/store'

const auth = useAuthStore()
const settingStore = useSettingStore()
const toast = useToast()

/// region 博客设置
const savingSettings = shallowRef(false)

async function saveSetting() {
  savingSettings.value = true
  try {
    await settingStore.save()
    toast.success('设置保存成功')
  } finally {
    savingSettings.value = false
  }
}
/// endregion

/// region 自定义样式
const { data: customStyleValue, execute: fetchCustomStyle } = useLazyAsyncData(
  'customStyle',
  () => api<string>('/attribute/custom-style'),
  { deep: false, immediate: false, server: false },
)
const savingCustomStyle = shallowRef(false)
async function saveCustomStyle() {
  savingCustomStyle.value = true
  try {
    await api<string>('/attribute/custom-style', 'POST', customStyleValue.value)
    toast.success('自定义样式保存成功，刷新页面生效')
  } finally {
    savingCustomStyle.value = false
  }
}
/// endregion

/// region 自定义 js
const { data: customScriptValue, execute: fetchCustomScript } = useLazyAsyncData(
  'customScript',
  () => api<string>('/attribute/custom-script'),
  { deep: false, immediate: false, server: false },
)
const savingCustomScript = shallowRef(false)
async function saveCustomScript() {
  savingCustomScript.value = true
  try {
    await api('/attribute/custom-script', 'POST', customScriptValue.value)
    toast.success('自定义脚本保存成功，刷新页面生效')
  } finally {
    savingCustomScript.value = false
  }
}
/// endregion

const title = `设置 - ${settingStore.setting.siteTitle ?? '博客'}`
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
  <main class="page">
    <template v-if="auth.isLogin">
      <div>
        <TextFieldContainer title="基础信息">
          <TextField v-model="settingStore.setting.siteTitle" :disabled="savingSettings" label="站点标题" />
          <TextField v-model="settingStore.setting.favicon" :disabled="savingSettings" label="站点图标链接" />
          <TextField v-model="settingStore.setting.banner" :disabled="savingSettings" label="默认封面链接" />
          <TextField v-model="settingStore.setting.footer" :disabled="savingSettings" label="站点底部信息" />
        </TextFieldContainer>
        <TextFieldContainer title="个人信息">
          <TextField v-model="settingStore.setting.avatar" :disabled="savingSettings" label="头像链接" />
          <TextField v-model="settingStore.setting.name" :disabled="savingSettings" label="作者名" />
          <div class="flex items-center gap-2">
            <TextField
              v-model="settingStore.setting.info"
              class="flex-1"
              :disabled="settingStore.setting.hitoko || savingSettings"
              label="站点信息"
            />
            <TextField
              v-model="settingStore.setting.hitoko"
              :disabled="savingSettings"
              label="一言"
              type="checkbox"
            />
          </div>
          <TextField
            v-model="settingStore.setting.email"
            :disabled="savingSettings"
            label="邮箱"
            placeholder="邮箱"
            required
            type="text"
          />
        </TextFieldContainer>
        <TextFieldContainer title="活动">
          <TextField v-model="settingStore.setting.wakatime" :disabled="savingSettings" label="wakatime" />
        </TextFieldContainer>
        <TextFieldContainer title="Giscus">
          <TextField v-model="settingStore.setting.giscusRepo" :disabled="savingSettings" label="giscusRepo" />
          <TextField v-model="settingStore.setting.giscusRepoId" :disabled="savingSettings" label="giscusRepoId" />
          <TextField v-model="settingStore.setting.giscusCategory" :disabled="savingSettings" label="giscusCategory" />
          <TextField v-model="settingStore.setting.giscusCategory" :disabled="savingSettings" label="giscusCategory" />
        </TextFieldContainer>
        <Btn primary :disabled="savingSettings" class="mt-8" @click="saveSetting()">
          保存设置
        </Btn>
        <TextFieldContainer title="自定义样式(CSS)" :md-cols="1">
          <TextBlock
            v-model="customStyleValue"
            rows="6"
            label="自定义样式将被插入到head标签"
            placeholder="CSS"
            @focus.once="fetchCustomStyle()"
          />
        </TextFieldContainer>
        <Btn primary :disabled="savingCustomScript" class="mt-4" @click="saveCustomStyle()">
          保存自定义样式
        </Btn>
        <TextFieldContainer title="自定义脚本(JS)" :md-cols="1">
          <TextBlock
            v-model="customScriptValue"
            rows="6"
            label="自定义脚本将插入body标签"
            placeholder="JS"
            @focus.once="fetchCustomScript()"
          />
        </TextFieldContainer>
        <Btn primary :disabled="savingCustomScript" class="mt-4" @click="saveCustomScript()">
          保存自定义脚本
        </Btn>
      </div>
    </template>
    <h2 v-else class="text-3xl">
      请登录
    </h2>
  </main>
</template>
