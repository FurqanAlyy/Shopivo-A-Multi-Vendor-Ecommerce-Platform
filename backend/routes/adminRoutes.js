const express = require('express')

const {
  getDashboardStats,
  getUsers,
  getSellers,
  updateSellerStatus,
  getAllProducts,
  deleteProductByAdmin,
  getAllOrders,
  getOrderByAdmin,
  updateOrderStatusByAdmin
} = require('../controllers/adminController')

const authMiddleware = require('../middleware/authMiddleware')
const authorize = require('../middleware/roleMiddleware')

const router = express.Router()

router.use(authMiddleware)
router.use(authorize('admin'))

router.get('/dashboard', getDashboardStats)

router.get('/users', getUsers)

router.get('/sellers', getSellers)

router.patch('/sellers/:id/status', updateSellerStatus)

router.get('/products', getAllProducts)

router.delete('/products/:id', deleteProductByAdmin)

router.get('/orders', getAllOrders)

router.get('/orders/:id', getOrderByAdmin)

router.patch('/orders/:id/status', updateOrderStatusByAdmin)

module.exports = router