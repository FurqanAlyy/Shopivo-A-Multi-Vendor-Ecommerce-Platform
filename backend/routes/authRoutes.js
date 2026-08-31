const express = require('express')
const {
  registerValidation,
  loginValidation
} = require('../validators/authValidator')
const validateMiddleware = require('../middleware/validateMiddleware')
const {
  register,
  login,
  logout,
    getMe
} = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/me', authMiddleware, getMe)

router.post(
  '/register',
  registerValidation,
  validateMiddleware,
  register
)

router.post(
  '/login',
  loginValidation,
  validateMiddleware,
  login
)

router.post('/logout', logout)

module.exports = router