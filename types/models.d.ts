import type { Types } from 'mongoose'

interface IAccess {
  ip?: string
  referrer?: string
  ua?: string
  articleId?: Types.ObjectId | string
  createdAt: Date
}

interface IArticle {
  title: string
  path: string
  cover?: string
  content: string
  summary?: string
  pinned?: boolean
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

interface IAttribute {
  key: string
  value?: any
}

interface IPicture {
  name: string
  bytes: Buffer
  createdAt: Date
}
