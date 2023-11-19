import { Schema } from 'mongoose'
import { defineMongooseModel } from '#nuxt/mongoose'

export const ArticleSchema = defineMongooseModel('Article', {
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
  },
  // @ts-expect-error 莫名其妙的错误
  createdAt: {
    type: Schema.Types.Date,
    default: () => new Date(),
  },
  // @ts-expect-error 莫名其妙的错误
  updatedAt: {
    type: Schema.Types.Date,
    default: () => new Date(),
  },
})
