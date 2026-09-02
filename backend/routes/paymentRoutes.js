const express = require('express')

const authMiddleware = require('../middleware/authMiddleware')
const authorize = require('../middleware/roleMiddleware')

const {
  createCheckoutSession
} = require('../controllers/paymentController')

const router = express.Router()

router.post(
  '/create-checkout-session/:orderId',
  authMiddleware,
  authorize('buyer', 'seller'),
  createCheckoutSession
)

module.exports = router