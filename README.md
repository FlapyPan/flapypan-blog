# FlapyPan Blog

> [!WARNING]
> 自 `2.x` 版本起，不再依赖额外后端，`2.x` 与 `1.x` 的数据并不兼容

基于 Vue 3 开发的一款简单高效的博客系统

## 技术栈

- Vue 3.x
- Nuxt.js 3
- TailwindCSS
- MongoDB
- md-editor-v3

## 启动方法

**前置要求**

- `node.js` (version >= 18)
- `pnpm` (version >= 6)

> pnpm 可以使用 npm 来安装 `npm install -g pnpm`

克隆本仓库源码，并安装依赖

```shell
git clone <仓库地址> # 替换成对应的仓库地址
cd flapypan-blog # 进入对应目录
pnpm i # 安装依赖
```

### 环境配置

查看 `.env.example` 示例

### 开发模式启动

```shell
pnpm dev # 运行开发服务器
```

### 编译运行

编译完成后可以在`.output`目录下可以找到编译产物

```shell
pnpm build # 编译
# 运行
pnpm run start
# 或
node .output/server/index.mjs
```

## 评论系统配置(可选)

参考 Giscus [官方教程](https://giscus.app/zh-CN)

获取到对应的 `repo` `repoid` `category` `categoryid` 后，登录博客后台填入相应的位置保存即可

## 配置 AI 摘要生成(可选)

前往[讯飞开放平台](https://console.xfyun.cn/services/bm35)获取 API 配置(仅支持 V3.5 模型)

参考`.env.example`配置环境变量
