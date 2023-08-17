/**
 * 睡眠
 * @param ms 睡眠的毫秒
 */
export default (ms) => new Promise((resolve) => setTimeout(resolve, ms))
