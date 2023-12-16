import { createHooks } from 'hookable'

export interface AuthorStatusData {
  state: string | null | undefined
  active: number | null | undefined
}

export interface StatusHooks {
  'authorStatus:get': (data: AuthorStatusData) => any | void
  'authorStatus:set': (data: AuthorStatusData) => any | void
}

export const statusHooks = createHooks<StatusHooks>()

function defaultAuthorStatusData(): AuthorStatusData {
  return {
    state: null,
    active: null,
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
    this._data = data
  },
}

statusHooks.hook('authorStatus:set', (data) => {
  return statusDataHolder.set(data)
})
