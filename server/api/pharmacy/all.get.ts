export default defineEventHandler(async () => {
  try {
    return await Pharmacy.find({})
  }
  catch { throw createError({ statusCode: 500, statusMessage: 'Something went wrong.' }) }
})
