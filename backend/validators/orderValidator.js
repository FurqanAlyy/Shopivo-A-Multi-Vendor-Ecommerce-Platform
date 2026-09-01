const { body } = require('express-validator')

const checkoutValidation = [
  body('shippingAddress.fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),

  body('shippingAddress.phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\+?[0-9\s-]{10,15}$/)
    .withMessage('Invalid phone number'),

  body('shippingAddress.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ min: 5, max: 300 })
    .withMessage('Address must be between 5 and 300 characters'),

  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),

  body('shippingAddress.postalCode')
    .trim()
    .notEmpty()
    .withMessage('Postal code is required'),

  body('shippingAddress.country')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Country cannot be empty'),

  body('paymentMethod')
    .isIn(['cod', 'stripe'])
    .withMessage('Invalid payment method')
]

module.exports = {
  checkoutValidation
}