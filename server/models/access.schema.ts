import { Schema, type Types } from 'mongoose'
import { defineMongooseModel } from '#nuxt/mongoose'

export interface IAccess {
  ip?: string
  referrer?: string
  ua?: string
  articleId?: Types.ObjectId
  createdAt: Date
}

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
  },
  createdAt: {
    type: Schema.Types.Date,
    default: () => new Date(),
  },
})
