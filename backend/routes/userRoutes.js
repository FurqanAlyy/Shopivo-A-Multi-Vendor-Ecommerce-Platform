const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const authorize = require('../middleware/roleMiddleware')

const {
  getProfile,
  getSellerArea,
  getAdminArea
} = require('../controllers/userController')

const router = express.Router()

router.get(
  '/profile',
  authMiddleware,
  getProfile
)

router.get(
  '/seller-area',
  authMiddleware,
  authorize('seller'),
  getSellerArea
)

router.get(
  '/admin-area',
  authMiddleware,
  authorize('admin'),
  getAdminArea
)

module.exports = router