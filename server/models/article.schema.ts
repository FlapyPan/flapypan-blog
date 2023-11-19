import { Schema } from 'mongoose'
import { defineMongooseModel } from '#nuxt/mongoose'

export const ArticleSchema = defineMongooseModel('Article', {
  title: {
    type: Schema.Types.String,
    required: true,
    unique: true,
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
  tags: {
    type: [[Schema.Types.String]],
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
