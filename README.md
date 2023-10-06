# FlapyPan Blog Vue

基于 Vue 3 开发的一款简单高效的博客系统(前端页面)

**本仓库为前端项目，要配合后端项目使用。请对应版本号，例：前端版本`v1.2.x`则后端也使用`v1.2.x`**

后端项目：[flapypan-blog-spring](https://github.com/FlapyPan/flapypan-blog-spring)

后端部署方法请参考对应仓库的说明

## 功能列表

- 单用户登录
- 文章的在线查看、新建、编辑、删除
- Giscus 评论系统
- 文章搜索
- 标签管理
- 使用 Markdown 渲染，支持 mermaid 流程图和 latex 语法
- 图片快速上传
- 亮色、暗色模式切换
- 文章编辑本地及时保存
- 其他自定义设置功能

## 技术栈

- Vue 3.x
- Nuxt.js 3
- Vuetify
- md-editor-v3

## 启动方法

**前置要求**

- `node.js` (version >= 18)
- `pnpm` (version >= 6)

> pnpm 可以使用 npm 来安装 `npm install -g pnpm`

克隆本仓库源码，并安装依赖

```shell
git clone <仓库地址> # 替换成对应的仓库地址
cd flapypan-blog-vue # 进入对应目录
pnpm i # 安装依赖
```

### 开发模式启动

```shell
export BACKEND_API='http://localhost:8080' # 设置变量指定后端地址
pnpm dev # 运行开发服务器
```

### 编译运行

编译完成后可以在`.output`目录下可以找到编译产物

#### 单实例

```shell
pnpm build # 编译

export BACKEND_API='http://localhost:8080' # 设置后端地址
export PORT=3000 # 设置前端服务端口号

# 运行
pnpm run start
# 或
node .output/server/index.mjs
```

#### 负载均衡

```shell
pnpm build # 编译

export BACKEND_API='http://localhost:8080' # 设置后端地址
export PORT=3000 # 设置前端服务端口号

# 使用 pm2 运行
node run pm2 # 默认4个集群实例
# 或
pm2 start --name blog-page .output/server/index.mjs -i 4
```

## 评论系统配置(可选)

参考 Giscus [官方教程](https://giscus.app/zh-CN)

获取到对应的 `repo` `repoid` `category` `categoryid` 后，登录博客后台填入相应的位置保存即可
