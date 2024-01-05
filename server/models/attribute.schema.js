import { Schema } from 'mongoose'
import { defineMongooseModel } from '#nuxt/mongoose'

export const AttributeSchema = defineMongooseModel('Attribute', {
  key: {
    type: Schema.Types.String,
    required: true,
    unique: true,
  },
  value: {
    type: Schema.Types.Mixed,
  },
})
