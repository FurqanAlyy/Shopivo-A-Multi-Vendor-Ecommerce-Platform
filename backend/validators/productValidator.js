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
    .withMessage('Description must be between 10 and 5000 characters'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isMongoId()
    .withMessage('Invalid category ID'),

  body('images')
    .isArray({ min: 1 })
    .withMessage('At least one product image is required'),

  body('images.*')
    .isURL()
    .withMessage('Each image must be a valid URL'),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('discount')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount must be between 0 and 100'),

  body('stock')
    .notEmpty()
    .withMessage('Stock is required')
    .isInt({ min: 0 })
    .withMessage('Stock cannot be negative'),

  body('sku')
    .trim()
    .notEmpty()
    .withMessage('SKU is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('SKU must be between 2 and 50 characters')
]

module.exports = {
  productValidation
}