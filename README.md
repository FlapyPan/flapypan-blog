# FlapyPan Blog

一款简单高效的博客系统，基于 SpringBoot 3 和 Vue 3 开发

**功能列表**

- 单用户登录
- 文章的在线查看、新建、编辑、删除
- Giscus 评论系统 (version >= 1.2.0)
- 文章搜索
- 标签管理
- 使用 Markdown 渲染，支持 mermaid 流程图和 latex 语法
- 图片快速上传
- 亮色、暗色模式切换
- 文章编辑本地及时保存
- 支持 Postgresql、MySQL、H2(默认)数据库
- 其他自定义设置功能

**技术栈**

- Kotlin
- Spring Boot 3.x
- Spring Data JPA
- Spring Validation
- SaToken
- Postgres、MySQL、H2
- Vue 3.x
- Vite
- Vuetify
- Pinia
- Vue Router
- Vueuse

## 启动方法

### 编译

**前置要求**

- `jdk` (version >= 17)
- `gradle` (version >= 8 非必须)
- `node.js` (version >= 18)
- `pnpm` (version >= 6)

> pnpm 可以使用 npm 来安装 `npm install -g pnpm`

克隆本仓库源码，并进入对应目录

```shell
git clone <仓库地址> # 替换成对应的仓库地址
cd flapypan-blog
```

#### 编译后端 api

在`build/libs`目录下可以找到编译好的 jar 包

```shell
cd flapypan-blog-api # 进入目录
# 如果没有 gradle 可以使用 .\gradlew bootJar，将自动下载 gradle
gradle bootJar # 编译 jar
```

#### 编译前端页面

编译页面，在`dist`目录下可以找到编译产物

```shell
cd flapypan-blog-vue # 进入目录
pnpm i && pnpm build # 编译
```

### 运行

**前置要求**

- `jdk` (version >= 17)
- `nginx`或`caddy v2` 等 http 服务器

#### 后端 api 运行

**环境变量说明**

| 环境变量           | 默认值                               | 说明        |
|----------------|-----------------------------------|-----------|
| PORT           | 8080                              | 运行端口      |
| ADMIN_USERNAME | 无                                 | 管理员用户名    |
| ADMIN_PASSWORD | 无                                 | 管理员密码(加密) |
| DB_URL         | jdbc:h2:file:./data/flapypan-blog | 数据库连接地址   |
| DB_PASSWORD    | sa                                | 数据库用户名    |
| DB_PASSWORD    | 无                                 | 数据库密码     |
| UPLOAD_DIR     | ./upload                          | 图片上传的路径   |

管理员密码需要使用 hash 加密过的密码，可以使用下列方式获得

```shell
java -jar flapypan-blog.jar hash <密码>
```

H2 示例

```shell
export ADMIN_USERNAME='admin'
# admin
export ADMIN_PASSWORD='$2a$10$6MRSKmrdg7kjYn1Dh4pFT.5jxDMQ7wPYV9M.Qhs9A2QOjIWX.DFDi'

java -jar flapypan-blog.jar
```

Postgres 示例

```shell
export ADMIN_USERNAME='admin'
# admin
export ADMIN_PASSWORD='$2a$10$6MRSKmrdg7kjYn1Dh4pFT.5jxDMQ7wPYV9M.Qhs9A2QOjIWX.DFDi'
export DB_URL='jdbc:postgresql://127.0.0.1:5432/db_blog'
export DB_USERNAME='postgres'
export DB_PASSWORD='postgres'

java -jar flapypan-blog.jar
```

MySQL 示例

```shell
export ADMIN_USERNAME='admin'
# admin
export ADMIN_PASSWORD='$2a$10$6MRSKmrdg7kjYn1Dh4pFT.5jxDMQ7wPYV9M.Qhs9A2QOjIWX.DFDi'
export DB_URL='jdbc:mysql://127.0.0.1:3306/db_blog?useSSL=false&serverTimezone=UTC'
export DB_USERNAME='root'
export DB_PASSWORD='root'

java -jar flapypan-blog.jar
```

#### 前端页面部署

下面是一些参考配置，caddy v2 的配置测试过可以使用

> 注意：因为使用的是 cookie 模式来认证，为了保证安全，禁止了跨域请求。
> 前端访问 /api 作为后端，所以请使用 http 代理服务器将 /api 的请求转发到后端。


caddy v2 参考示例

```text
:80 {
    root * <前端页面路径>
    file_server
    try_files {path}.html {path} /
    encode zstd gzip
}
:80/api/* {
    # handle_path 去除前缀
    handle_path /api/* {
        reverse_proxy <后端地址>
    }
}
```

nginx 参考示例

```text
server {
    listen                  80;

    gzip            on;
    gzip_vary       on;
    gzip_proxied    any;
    gzip_comp_level 6;
    gzip_types      text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;

    root <前端页面路径>;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass            http://<后端地址>$request_uri;
        proxy_set_header Host $host;
        # 下面的部分设置因为nginx版本问题可能无效甚至导致报错，自行排查
        proxy_http_version                 1.1;
        proxy_cache_bypass                 $http_upgrade;
        proxy_set_header Upgrade           $http_upgrade;
        proxy_set_header Connection        $connection_upgrade;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header Forwarded         $proxy_add_forwarded;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host  $host;
        proxy_set_header X-Forwarded-Port  $server_port;
        proxy_connect_timeout              60s;
        proxy_send_timeout                 60s;
        proxy_read_timeout                 60s;
    }

}
```

## 评论系统配置(可选)

参考 Giscus [官方教程](https://giscus.app/zh-CN)

获取到对应的 `repo` `repoid` `category` `categoryid` 后，登录博客后台填入相应的位置保存即可
