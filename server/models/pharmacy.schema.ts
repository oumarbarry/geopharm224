import { Schema, model } from 'mongoose'
import type { IPharmacy } from '~/utils/common'

const pharmacySchema = new Schema<IPharmacy>({
  name: { type: 'string', max: 250, required: true },
  location: {
    type: { type: 'string', enum: ['Point'] },
    coordinates: ['number'],
  },
  phoneNumber: { type: 'string', max: 250, required: true },
  area: { type: 'string', max: 250, required: true },
})

pharmacySchema.index({ location: '2dsphere' })

export const Pharmacy = model<IPharmacy>('Pharmacy', pharmacySchema)
