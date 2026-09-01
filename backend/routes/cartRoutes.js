const express = require('express')

const authMiddleware = require('../middleware/authMiddleware')
const authorize = require('../middleware/roleMiddleware')
const validateMiddleware = require('../middleware/validateMiddleware')

const {
  addCartItemValidation,
  updateCartItemValidation
} = require('../validators/cartValidator')

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController')

const router = express.Router()

router.use(
  authMiddleware,
  authorize('buyer', 'seller')
)

router.get('/', getCart)

router.post(
  '/items',
  addCartItemValidation,
  validateMiddleware,
  addToCart
)

router.patch(
  '/items/:itemId',
  updateCartItemValidation,
  validateMiddleware,
  updateCartItem
)

router.delete(
  '/items/:itemId',
  removeFromCart
)

router.delete(
  '/',
  clearCart
)

module.exports = router