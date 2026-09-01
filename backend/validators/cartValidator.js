const { body } = require('express-validator')

const addCartItemValidation = [
  body('product')
    .trim()
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID'),

  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1')
]

const updateCartItemValidation = [
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1')
]

module.exports = {
  addCartItemValidation,
  updateCartItemValidation
}