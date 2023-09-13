# FlapyPan Blog Vue

基于 Vue 3 开发的一款简单高效的博客系统(前端页面)

**本仓库为前端项目，要配合下列其中之一的后端项目使用**

**请对应版本号，例：前端版本`v1.2.x`则后端也使用`v1.2.x`**

| 名称                     | Gitea 地址                                                 | Github 地址                                        |
|------------------------|----------------------------------------------------------|--------------------------------------------------|
| flapypan-blog-java(推荐) | <https://git.flapypan.top/FlapyPan/flapypan-blog-java>   | https://github.com/FlapyPan/flapypan-blog-java   |
| flapypan-blog-kotlin   | <https://git.flapypan.top/FlapyPan/flapypan-blog-kotlin> | https://github.com/FlapyPan/flapypan-blog-kotlin |

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
- Vite
- Vuetify
- Pinia
- Vue Router
- Vueuse

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

> 请确保后端程序已运行，并且运行在本地`8080`端口，如果不是请修改`vite.confg.js`里的反向代理地址

```shell
pnpm dev # 运行开发服务器
```

### 编译部署

编译完成后可以在`dist`目录下可以找到编译产物

```shell
pnpm build # 打包编译
```

注意：因为使用的是 cookie 模式来认证，为了保证安全，禁止了跨域请求。

前端访问 /api 作为后端，所以请使用 http 代理服务器将 /api 的请求转发到后端。

caddy v2 参考示例:

```text
:80 { # 也可以直接写域名
        encode zstd gzip
        root * <前端页面路径>
        route {
                # handle_path 去除前缀
                handle_path /api/* {
                        reverse_proxy localhost:8180
                }
                # 单页面应用
                try_files {path}.html {path} /
                file_server
        }
}
```

## 评论系统配置(可选)

参考 Giscus [官方教程](https://giscus.app/zh-CN)

获取到对应的 `repo` `repoid` `category` `categoryid` 后，登录博客后台填入相应的位置保存即可
