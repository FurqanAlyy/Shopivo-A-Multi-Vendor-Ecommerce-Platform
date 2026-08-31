require('dotenv').config()

const connectDB = require('../config/db')
const User = require('../models/User')

const seedAdmin = async () => {
  try {
    await connectDB()

    const existingAdmin = await User.findOne({
      email: process.env.ADMIN_EMAIL
    })

    if (existingAdmin) {
      console.log('Admin already exists')
      process.exit(0)
    }

    const admin = await User.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin'
    })

    console.log(`Admin created: ${admin.email}`)

    process.exit(0)
  } catch (error) {
    console.error('Admin seeding failed:', error.message)
    process.exit(1)
  }
}

seedAdmin()