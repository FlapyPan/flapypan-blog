/**
 * 预设颜色表
 * @type {string[]}
 */
const colors = [
  'red',
  'pink',
  'purple',
  'deep-purple',
  'primary',
  'blue',
  'light-blue',
  'cyan',
  'teal',
  'green',
  'light-green',
  'amber',
  'orange',
]

/**
 * 映射缓存
 *  @type {Map<string, string>}
 */
const cache = new Map()

/**
 * 将字符串映射到预设的颜色表
 * @param str
 * @return {string}
 */
export default (str) => {
  if (!str)
    return 'primary'
  // 在缓存中查询
  if (cache.has(str))
    return cache.get(str)
  // 计算字符串的哈希值
  const len = str.length
  let hash = 0
  for (let i = 0; i < len; ++i) {
    const h = str.charCodeAt(i) + ((hash << (len - i)) - hash)
    hash = h & h
  }
  // 获取颜色索引
  const index = Math.abs(hash) % colors.length
  // 存储颜色到缓存中
  const color = colors[index]
  cache.set(str, color)

  return color
}
