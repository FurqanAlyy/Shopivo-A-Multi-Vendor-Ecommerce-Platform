const express = require('express')

const authMiddleware = require('../middleware/authMiddleware')
const authorize = require('../middleware/roleMiddleware')
const validateMiddleware = require('../middleware/validateMiddleware')

const {
  categoryValidation
} = require('../validators/categoryValidator')

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController')

const router = express.Router()

router.get('/', getCategories)

router.get('/:id', getCategory)

router.post(
  '/',
  authMiddleware,
  authorize('admin'),
  categoryValidation,
  validateMiddleware,
  createCategory
)

router.patch(
  '/:id',
  authMiddleware,
  authorize('admin'),
  categoryValidation,
  validateMiddleware,
  updateCategory
)

router.delete(
  '/:id',
  authMiddleware,
  authorize('admin'),
  deleteCategory
)

module.exports = router