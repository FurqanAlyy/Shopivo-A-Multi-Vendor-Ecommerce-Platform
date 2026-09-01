const express = require('express')

const authMiddleware = require('../middleware/authMiddleware')
const authorize = require('../middleware/roleMiddleware')
const validateMiddleware = require('../middleware/validateMiddleware')

const {
  checkoutValidation,
  sellerOrderStatusValidation
} = require('../validators/orderValidator')

const {
  checkout,
  getMyOrders,
  getMyOrder,
  getSellerOrders,
  getSellerOrder,
  updateSellerOrderStatus
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
  '/seller',
  authorize('seller'),
  getSellerOrders
)

router.get(
  '/seller/:id',
  authorize('seller'),
  getSellerOrder
)

router.patch(
  '/seller/:id/status',
  authorize('seller'),
  sellerOrderStatusValidation,
  validateMiddleware,
  updateSellerOrderStatus
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