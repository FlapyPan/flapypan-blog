import { createHooks } from 'hookable'

/**
 * @typedef {Object} AuthorStatusData
 * @property {string} [state]
 * @property {number} [active]
 */

export const statusHooks = createHooks()

/**
 * @return {AuthorStatusData}
 */
function defaultAuthorStatusData() {
  return {
    state: '',
    active: 0,
  }
}

export const statusDataHolder = {
  _data: defaultAuthorStatusData(),
  /**
   * @return {AuthorStatusData}
   */
  get() {
    return this._data
  },
  /**
   * @param {AuthorStatusData} data
   * @return {Promise<void>}
   */
  async set(data) {
    if (this._data.state !== data.state) {
      await statusHooks.callHook('authorStatus:get', data)
    }
    clearInterval(this.intervalId)
    if (data.active) {
      setInterval(() => this.resetData(), 600000)
    }
    this._data = data
  },
  intervalId: 0,
  async resetData() {
    const lastActive = this._data.active
    if (lastActive && Date.now() - lastActive > 1800000) {
      await this.set(defaultAuthorStatusData())
    }
  },
}

statusHooks.hook(
  'authorStatus:set',
  /**
   * @param {AuthorStatusData} data
   */
  (data) => {
    return statusDataHolder.set(data)
  },
)
