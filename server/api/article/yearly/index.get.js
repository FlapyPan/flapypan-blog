export default eventHandler(() => {
  return ArticleSchema.aggregate([
    // 按照创建时间倒叙
    { $sort: { createdAt: -1 } },
    // 按照年份分组
    { $group: { _id: { $year: '$createdAt' }, list: { $push: '$$ROOT' } } },
    // 根据年份从大到小排列
    { $sort: { _id: -1 } },
    // 重命名结果，筛选字段
    {
      $project: {
        _id: 0,
        year: '$_id',
        list: { _id: 1, title: 1, path: 1, cover: 1, tags: 1, createdAt: 1, updatedAt: 1 },
      },
    },
  ])
})
