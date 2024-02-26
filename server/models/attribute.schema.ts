import type { IAttribute } from '~/types/models'
import { Schema } from 'mongoose'
import { defineMongooseModel } from '#nuxt/mongoose'

export const AttributeSchema = defineMongooseModel<IAttribute>('Attribute', {
  key: {
    type: Schema.Types.String,
    required: true,
    unique: true,
  },
  value: {
    type: Schema.Types.Mixed,
  },
})
