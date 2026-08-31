const express = require('express')

const authMiddleware = require('../middleware/authMiddleware')
const authorize = require('../middleware/roleMiddleware')
const validateMiddleware = require('../middleware/validateMiddleware')

const {
  productValidation
} = require('../validators/productValidator')

const {
  createProduct,
  getProducts,
  getProduct
} = require('../controllers/productController')

const router = express.Router()

router.get('/', getProducts)

router.get('/:id', getProduct)

router.post(
  '/',
  authMiddleware,
  authorize('seller'),
  productValidation,
  validateMiddleware,
  createProduct
)

module.exports = router