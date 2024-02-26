import type { IAccess } from '~/types/models'
import { Schema } from 'mongoose'
import { defineMongooseModel } from '#nuxt/mongoose'

export const AccessSchema = defineMongooseModel<IAccess>('Access', {
  ip: {
    type: Schema.Types.String,
  },
  referrer: {
    type: Schema.Types.String,
  },
  ua: {
    type: Schema.Types.String,
  },
  articleId: {
    type: Schema.Types.ObjectId,
    index: true,
  },
  createdAt: {
    type: Schema.Types.Date,
    index: true,
    default: () => new Date(),
  },
})
