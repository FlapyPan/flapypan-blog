import type { H3Event } from 'h3'

export interface Pageable {
  orderBy?: Record<string, string>
  cursor?: string
  size?: number
}

export function getPageable(event: H3Event, defaultOrder: Record<string, string>): Pageable {
  const query = getQuery(event)
  const queryOrderBy = (<string | undefined>query.orderBy)?.split(',')
  const orderBy: Record<string, string> = { ...defaultOrder }
  if (queryOrderBy?.length) {
    orderBy[queryOrderBy[0]] = queryOrderBy[1] ?? 'asc'
  }
  const anchor = <string | undefined>query.anchor
  const size = <string | undefined>query.size
  return {
    orderBy,
    cursor: anchor,
    size: +(size ?? 6),
  }
}
