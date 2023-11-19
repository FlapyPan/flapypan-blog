import { Schema } from 'mongoose'
import { defineMongooseModel } from '#nuxt/mongoose'

export const PictureSchema = defineMongooseModel('Picture', {
  name: {
    type: Schema.Types.String,
    required: true,
  },
  bytes: {
    type: Schema.Types.Buffer,
    required: true,
  },
  // @ts-expect-error 莫名其妙的错误
  createdAt: {
    type: Schema.Types.Date,
    default: () => new Date(),
  },
})
