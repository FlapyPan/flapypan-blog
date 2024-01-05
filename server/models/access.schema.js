import { Schema } from 'mongoose'
import { defineMongooseModel } from '#nuxt/mongoose'

export const AccessSchema = defineMongooseModel('Access', {
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
    required: true,
  },
  createdAt: {
    type: Schema.Types.Date,
    default: () => new Date(),
  },
})
