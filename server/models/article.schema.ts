import { Schema } from 'mongoose'
import type { IArticle } from '~/types/models'
import { defineMongooseModel } from '#nuxt/mongoose'

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
    default: '/banner.webp',
  },
  content: {
    type: Schema.Types.String,
    required: true,
  },
  summary: {
    type: Schema.Types.String,
  },
  pinned: {
    type: Schema.Types.Boolean,
    index: true,
    default: false,
  },
  tags: {
    type: [Schema.Types.String],
    index: true,
    default: () => [],
  },
  createdAt: {
    type: Schema.Types.Date,
    index: true,
    default: () => new Date(),
  },
  updatedAt: {
    type: Schema.Types.Date,
    index: true,
    default: () => new Date(),
  },
})
