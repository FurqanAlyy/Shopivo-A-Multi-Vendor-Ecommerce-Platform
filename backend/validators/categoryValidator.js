const { body } = require('express-validator')

const categoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be between 2 and 50 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  body('image')
    .optional()
    .trim()
    .isURL()
    .withMessage('Image must be a valid URL')
]

module.exports = {
  categoryValidation
}