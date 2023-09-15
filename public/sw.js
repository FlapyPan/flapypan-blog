// 缓存名
const cacheName = 'sw-cache'

// 定义要缓存的固定文件路径
const cachePaths = [
  '/avatar.webp',
  '/banner.webp',
]
// 定义要缓存的通配符路径
const cachePattern = new RegExp('^/api/static/')

// 监听 install 事件
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(cachePaths)))
})

// 监听 fetch 事件
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果缓存中有匹配的资源，则从返回缓存
        if (response) { return response }
        // 如果缓存中没有匹配的资源，则从网络请求资源
        return fetch(event.request).then((response) => {
          // 检测通配符路径
          if (event.request.url.match(cachePattern)) {
            // 克隆响应并将其添加到缓存中
            const responseToCache = response.clone()
            caches.open(cacheName).then((cache) => cache.put(event.request, responseToCache))
          }
          return response
        })
      }),
  )
})
