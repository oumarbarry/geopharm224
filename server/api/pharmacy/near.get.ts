import { z } from 'zod'

const coordinatesSchema = z.object({
  longitude: z.coerce.number().min(-180).max(180),
  latitude: z.coerce.number().min(-90).max(90),
})

export default defineEventHandler(async (event) => {
  const { longitude, latitude } = await getValidatedQuery(event, coordinatesSchema.parse)

  try {
    return await Pharmacy.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: 5000,
        },
      },
    })
  }
  catch { throw createError({ statusCode: 500, statusMessage: 'Something went wrong.' }) }
})
