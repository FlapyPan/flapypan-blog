module.exports = {
  apps: [
    {
      name: 'flapypan-blog-page',
      script: './.output/server/index.mjs',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
      env: {
        PORT: 3300,
        BACKEND_API: 'http://localhost:8080',
      },
    },
  ],
}
