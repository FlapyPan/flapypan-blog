import { getAllAccessCount, getTodayAccessCount } from '~/server/data/access'

export default cachedEventHandler(async () => {
  const [all, today] = await Promise.all([
    getAllAccessCount(),
    getTodayAccessCount()
  ])
  return { all, today }
})
