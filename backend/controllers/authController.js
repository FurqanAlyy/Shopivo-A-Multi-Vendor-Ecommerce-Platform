const User = require('../models/User')
const generateToken = require('../utils/generateToken')

const setAuthCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
}

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      const error = new Error('User already exists with this email')
      error.statusCode = 409
      return next(error)
    }

    const user = await User.create({
      name,
      email,
      password
    })

    const token = generateToken(user._id)

    setAuthCookie(res, token)

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      const error = new Error('Invalid email or password')
      error.statusCode = 401
      return next(error)
    }

    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
      const error = new Error('Invalid email or password')
      error.statusCode = 401
      return next(error)
    }

    if (!user.isActive) {
      const error = new Error('Your account has been deactivated')
      error.statusCode = 403
      return next(error)
    }

    const token = generateToken(user._id)

    setAuthCookie(res, token)

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    next(error)
  }
}

const logout = async (req, res, next) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      expires: new Date(0)
    })

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    })
  } catch (error) {
    next(error)
  }
}

const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  register,
  login,
  logout,
  getMe
}