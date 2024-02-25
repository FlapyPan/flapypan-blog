import { Schema } from 'mongoose'
import { defineMongooseModel } from '#nuxt/mongoose'

export interface IPicture {
  name: string
  bytes: Buffer
  createdAt: Date
}

export const PictureSchema = defineMongooseModel<IPicture>('Picture', {
  name: {
    type: Schema.Types.String,
    required: true
  },
  bytes: {
    type: Buffer,
    required: true
  },
  createdAt: {
    type: Schema.Types.Date,
    default: () => new Date()
  }
})
