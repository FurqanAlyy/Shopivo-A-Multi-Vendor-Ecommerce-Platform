const { body } = require('express-validator')

const sellerApplicationValidation = [
  body('storeName')
    .trim()
    .notEmpty()
    .withMessage('Store name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Store name must be between 2 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .isLength({ min: 7, max: 20 })
    .withMessage('Phone number must be between 7 and 20 characters'),

  body('address.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),

  body('address.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),

  body('address.state')
    .optional()
    .trim(),

  body('address.postalCode')
    .trim()
    .notEmpty()
    .withMessage('Postal code is required'),

  body('address.country')
    .trim()
    .notEmpty()
    .withMessage('Country is required')
]

const sellerDecisionValidation = [
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Reason cannot exceed 500 characters')
]

module.exports = {
  sellerApplicationValidation,
  sellerDecisionValidation
}