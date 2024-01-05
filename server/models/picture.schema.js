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
  createdAt: {
    type: Schema.Types.Date,
    default: () => new Date(),
  },
})
