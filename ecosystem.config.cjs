module.exports = {
  apps: [
    {
      name: 'flapypan-blog-page',
      script: './.output/server/index.mjs',
      instances: 4,
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
    },
  ],
}
