export default eventHandler(async () => {
  // 今日访问量从今日0点0分开始统计
  const todayBegin = new Date()
  todayBegin.setHours(0, 0, 0, 0)
  const [all, today] = await Promise.all([
    AccessSchema.count(),
    AccessSchema.count({ createdAt: { $gte: todayBegin, $lte: new Date() } }),
  ])
  return { all, today }
})
