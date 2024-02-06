export default eventHandler((event) => {
  const { method, path } = event;
  do {
    // 不认证非 api 请求
    if (!path.startsWith('/api')) break;
    // 不认证 get 请求
    if (method === 'GET') break;
    // 不认证登录请求
    if (path.startsWith('/api/auth/login')) break;

    event.context.user = auth(event);
  } while (false);
});
