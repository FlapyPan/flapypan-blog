// 退出登录
export default eventHandler(() => {
  // jwt 退出登录需要用用白名单或黑名单记录，这里直接返回成功就行了
  return { status: 'ok' };
});
