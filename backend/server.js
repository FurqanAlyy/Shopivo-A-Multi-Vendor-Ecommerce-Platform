const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const connectDB = require('./config/db')
const notFoundMiddleware = require('./middleware/notFoundMiddleware')
const errorMiddleware = require('./middleware/errorMiddleware')

dotenv.config()

connectDB()

const app = express()

app.use(helmet())

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  }
})

app.use('/api', apiLimiter)

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Multi-vendor e-commerce API is running'
  })
})

app.use(notFoundMiddleware)
app.use(errorMiddleware)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})