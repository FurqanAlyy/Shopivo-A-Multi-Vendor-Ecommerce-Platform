const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token

    if (!token) {
      const error = new Error('Authentication required')
      error.statusCode = 401
      return next(error)
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.userId)

    if (!user) {
      const error = new Error('User not found')
      error.statusCode = 401
      return next(error)
    }

    if (!user.isActive) {
      const error = new Error('Account has been deactivated')
      error.statusCode = 403
      return next(error)
    }

    req.user = user

    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      error.statusCode = 401
      error.message = 'Invalid authentication token'
    }

    if (error.name === 'TokenExpiredError') {
      error.statusCode = 401
      error.message = 'Authentication token expired'
    }

    next(error)
  }
}

module.exports = authMiddleware