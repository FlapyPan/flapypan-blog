import { getAllAccessCount, getTodayAccessCount } from '~/server/data/access'

export default eventHandler(async () => {
  const [all, today] = await Promise.all([getAllAccessCount(), getTodayAccessCount()])
  return { all, today }
})
