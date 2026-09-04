const { body } = require('express-validator')

const productValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 150 })
    .withMessage('Product name must be between 2 and 150 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Product description must be between 10 and 5000 characters'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isMongoId()
    .withMessage('Invalid category ID'),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a valid positive number'),

  body('discount')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount must be between 0 and 100'),

  body('stock')
    .notEmpty()
    .withMessage('Stock is required')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),

  body('sku')
    .trim()
    .notEmpty()
    .withMessage('SKU is required')
]

const productUpdateValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage('Product name must be between 2 and 150 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters'),

  body('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid category ID'),

  body('images')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one product image is required'),

  body('images.*')
    .optional()
    .isURL()
    .withMessage('Each image must be a valid URL'),

  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price cannot be negative'),

  body('discount')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount must be between 0 and 100'),

  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock cannot be negative'),

  body('sku')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('SKU must be between 2 and 50 characters')
]

const stockValidation = [
  body('stock')
    .notEmpty()
    .withMessage('Stock is required')
    .isInt({ min: 0 })
    .withMessage('Stock cannot be negative')
]

module.exports = {
  productValidation,
  productUpdateValidation,
  stockValidation
}