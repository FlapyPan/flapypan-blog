import { Schema } from 'mongoose'
import { defineMongooseModel } from '#nuxt/mongoose'

export interface IArticle {
  title: string
  path: string
  cover?: string
  content: string
  pinned?: boolean
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export const ArticleSchema = defineMongooseModel<IArticle>('Article', {
  title: {
    type: Schema.Types.String,
    required: true,
  },
  path: {
    type: Schema.Types.String,
    required: true,
    unique: true,
  },
  cover: {
    type: Schema.Types.String,
  },
  content: {
    type: Schema.Types.String,
    required: true,
  },
  pinned: {
    type: Schema.Types.Boolean,
  },
  tags: {
    type: [Schema.Types.String],
    default: () => [],
  },
  createdAt: {
    type: Schema.Types.Date,
    default: () => new Date(),
  },
  updatedAt: {
    type: Schema.Types.Date,
    default: () => new Date(),
  },
})
