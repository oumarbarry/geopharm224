import { z } from 'zod'

const insertPharmacySchema = z.object({
  name: z.string().max(150),
  longitude: z.number().min(-180).max(180),
  latitude: z.number().min(-90).max(90),
  phoneNumber: z.string().trim().regex(/^\+?\d+(\s\d+)*$/).min(9).max(15),
  area: z.string().max(150),
})

export default defineEventHandler(async (event) => {
  const { name, longitude, latitude, phoneNumber, area } = await readValidatedBody(event, insertPharmacySchema.parse)

  const existingPharmacy = await Pharmacy.findOne({
    'location.coordinates': [longitude, latitude],
  })

  if (existingPharmacy)
    throw createError({ statusCode: 409, statusMessage: 'A pharmacy already exists at this location.' })

  try {
    const newPharmacy = await Pharmacy.create({
      name,
      location: { type: 'Point', coordinates: [longitude, latitude] },
      phoneNumber: phoneNumber.replace(' ', ''),
      area,
    })

    setResponseStatus(event, 201, 'Created successfully.')

    return { message: 'success', data: newPharmacy.toObject() }
  }
  catch { throw createError({ statusCode: 500, statusMessage: 'Something went wrong.' }) }
})
