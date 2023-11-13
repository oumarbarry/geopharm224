export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)

  try {
    return await Pharmacy.findOne({ _id: id })
  }
  catch { throw createError({ statusCode: 500, statusMessage: 'Something went wrong.' }) }
})
