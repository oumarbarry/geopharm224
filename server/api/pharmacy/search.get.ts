import { z } from 'zod'

const querySchema = z.object({ query: z.string().max(150) })

export default defineEventHandler(async (event) => {
  const { query } = await getValidatedQuery(event, querySchema.parse)

  try {
    const regex = new RegExp(query, 'i')

    return await Pharmacy.find({
      $or: [
        { name: { $regex: regex } },
        { area: { $regex: regex } },
      ],
    })
  }
  catch { throw createError({ statusCode: 500, statusMessage: 'Something went wrong.' }) }
})
