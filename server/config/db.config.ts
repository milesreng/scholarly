import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const url = process.env.MONGODB_URI
// const url = 'mongodb://localhost:27017'

mongoose.set('strictQuery', true)

export const connectDB = async () => {
  try {
    await mongoose.connect(url)
    console.log('connected to MongoDB')
  } catch (error) {
    console.log(error.message)
    process.exit(1)
  }
}
