import { z } from 'zod'

export const PharmacySchema = z.object({
  name: z.string().max(150),
  location: z.object({
    type: z.literal('Point'),
    coordinates: z.number().array().length(2),
  }),
  phoneNumber: z.string().trim().regex(/^\+?\d+(\s\d+)*$/).min(9).max(15),
  area: z.string().max(150),
})

export type IPharmacy = z.infer<typeof PharmacySchema>
