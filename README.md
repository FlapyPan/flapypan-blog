# FlapyPan Blog

[![Netlify Status](https://api.netlify.com/api/v1/badges/873d3af7-747a-4c77-b2f5-cd2ef2a454e9/deploy-status)](https://app.netlify.com/sites/flapypan/deploys)

一款简单高效的在线个人博客系统

## 部署运行

- `node.js` (version >= 18)
- `pnpm` (version >= 6)
- `MongoDB` (version >= 6)

### Serverless 部署

请注意配置必要的环境变量，可参考：[.env.example](.env.example)

Serverless 部署推荐使用 [MongoDB Atlas](https://www.mongodb.com/atlas) 免费数据库

#### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FFlapyPan%2Fflapypan-blog&env=MONGODB_URI,ADMIN_USERNAME,ADMIN_PASSWORD,AUTH_SECRET)

#### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https%3A%2F%2Fgithub.com%2FFlapyPan%2Fflapypan-blog#MONGODB_URI=&ADMIN_USERNAME=&ADMIN_PASSWORD=&AUTH_SECRET=)

#### AWS Amplify

<https://aws.amazon.com/cn/amplify/>

### 自主部署

`.env` 配置文件参考：[.env.example](.env.example)

#### Node.js

```shell
git clone https://github.com/FlapyPan/flapypan-blog
cd flapypan-blog
pnpm insall
# 开发模式
pnpm run dev
# 生产模式
pnpm run build && pnpm run preview
```

#### Deno.js

适配中...

#### Bun.js

适配中...

## 评论系统配置(可选)

参考 Giscus [官方教程](https://giscus.app/zh-CN)

获取到对应的 `repo` `repoid` `category` `categoryid` 后，登录博客后台填入相应的位置保存即可
