import { connect } from 'mongoose'

export default defineNitroPlugin(async () => {
  try {
    await connect(useRuntimeConfig().mongodbUri)
    console.info('DB connection established.')
  }
  catch { console.info('DB connection failed.') }
})
