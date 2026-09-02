const express = require('express')

const authMiddleware = require('../middleware/authMiddleware')
const authorize = require('../middleware/roleMiddleware')
const validateMiddleware = require('../middleware/validateMiddleware')
const upload = require('../middleware/uploadMiddleware')

const {
  productValidation,
  productUpdateValidation,
  stockValidation
} = require('../validators/productValidator')

const {
  createProduct,
  getProducts,
  getProduct,
  getMyProducts,
  updateProduct,
  updateProductStock,
  deleteProduct
} = require('../controllers/productController')

const router = express.Router()

router.get('/', getProducts)

router.get(
  '/seller/my-products',
  authMiddleware,
  authorize('seller'),
  getMyProducts
)

router.patch(
  '/seller/:id/stock',
  authMiddleware,
  authorize('seller'),
  stockValidation,
  validateMiddleware,
  updateProductStock
)

router.patch(
  '/seller/:id',
  authMiddleware,
  authorize('seller'),
  upload.array('images', 5),
  productUpdateValidation,
  validateMiddleware,
  updateProduct
)

router.delete(
  '/seller/:id',
  authMiddleware,
  authorize('seller'),
  deleteProduct
)

router.get('/:id', getProduct)

router.post(
  '/',
  authMiddleware,
  authorize('seller'),
  upload.array('images', 5),
  productValidation,
  validateMiddleware,
  createProduct
)

module.exports = router