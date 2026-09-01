const express = require('express')

const authMiddleware = require('../middleware/authMiddleware')
const authorize = require('../middleware/roleMiddleware')
const validateMiddleware = require('../middleware/validateMiddleware')

const {
  checkoutValidation
} = require('../validators/orderValidator')

const {
  checkout,
  getMyOrders,
  getMyOrder
} = require('../controllers/orderController')

const router = express.Router()

router.use(
  authMiddleware,
  authorize('buyer', 'seller')
)

router.post(
  '/checkout',
  checkoutValidation,
  validateMiddleware,
  checkout
)

router.get(
  '/my',
  getMyOrders
)

router.get(
  '/my/:id',
  getMyOrder
)

module.exports = router