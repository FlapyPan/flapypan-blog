import { createHooks } from 'hookable'

export interface AuthorStatusData {
  state: string | undefined
  active: number | undefined
}

export interface StatusHooks {
  'authorStatus:get': (data: AuthorStatusData) => any | void
  'authorStatus:set': (data: AuthorStatusData) => any | void
}

export const statusHooks = createHooks<StatusHooks>()

function defaultAuthorStatusData(): AuthorStatusData {
  return {
    state: '',
    active: 0,
  }
}

export const statusDataHolder = {
  _data: defaultAuthorStatusData(),
  get(): AuthorStatusData {
    return this._data
  },
  async set(data: AuthorStatusData) {
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

statusHooks.hook('authorStatus:set', (data) => {
  return statusDataHolder.set(data)
})
