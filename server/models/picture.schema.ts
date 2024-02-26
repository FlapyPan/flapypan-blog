import type { IPicture } from '~/types/models'
import { Schema } from 'mongoose'
import { defineMongooseModel } from '#nuxt/mongoose'

export const PictureSchema = defineMongooseModel<IPicture>('Picture', {
  name: {
    type: Schema.Types.String,
    required: true,
  },
  bytes: {
    type: Buffer,
    required: true,
  },
  createdAt: {
    type: Schema.Types.Date,
    default: () => new Date(),
  },
})
