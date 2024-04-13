import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const url = process.env.MONGODB_URI
const client = new MongoClient(url)

async function main() {
  try {
    await client.connect()

    console.log('Connected successfully')

    const db = client.db('test')

    process.exit(0)
  } catch (error) {
    console.log(error.message)
  }
}

main()