const express = require('express')

const authMiddleware = require('../middleware/authMiddleware')
const authorize = require('../middleware/roleMiddleware')
const validateMiddleware = require('../middleware/validateMiddleware')

const {
  sellerApplicationValidation,
  sellerDecisionValidation
} = require('../validators/sellerValidator')

const {
  applyAsSeller,
  getMySellerApplication,
  getSellerApplications,
  approveSeller,
  rejectSeller
} = require('../controllers/sellerController')

const router = express.Router()

router.post(
  '/apply',
  authMiddleware,
  authorize('buyer'),
  sellerApplicationValidation,
  validateMiddleware,
  applyAsSeller
)

router.get(
  '/my-application',
  authMiddleware,
  getMySellerApplication
)

router.get(
  '/applications',
  authMiddleware,
  authorize('admin'),
  getSellerApplications
)

router.patch(
  '/:id/approve',
  authMiddleware,
  authorize('admin'),
  approveSeller
)

router.patch(
  '/:id/reject',
  authMiddleware,
  authorize('admin'),
  sellerDecisionValidation,
  validateMiddleware,
  rejectSeller
)

module.exports = router