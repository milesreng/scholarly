import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import { User } from './models/user.model'

dotenv.config()

const url = process.env.MONGODB_URI
const client = new MongoClient(url)

const users: User[] = [
  {
    name: 'Jim',
    username: 'jim1',
    email: 'jim@example.com'
  }, {
    name: 'Mary Kim',
    username: 'maryjkim',
    email: 'mary@example.com'
  }, {
    name: 'Steve',
    username: 'stevena',
    email: 'steve@example.com'
  }
]

async function main() {
  try {
    await client.connect()

    console.log('Connected successfully')

    const db = client.db('test')

    console.log('inserting users', await db.collection('users').insertMany(users))

    process.exit(0)
  } catch (error) {
    console.log(error.message)
  }
}

main()