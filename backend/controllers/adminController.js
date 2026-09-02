const User = require('../models/User')
const Seller = require('../models/Seller')
const Product = require('../models/Product')
const Order = require('../models/Order')

const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalSellers,
      totalProducts,
      totalOrders
    ] = await Promise.all([
      User.countDocuments(),
      Seller.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments()
    ])

    const revenueResult = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: '$total'
          }
        }
      }
    ])

    const totalRevenue =
      revenueResult[0]?.totalRevenue || 0

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalSellers,
        totalProducts,
        totalOrders,
        totalRevenue
      }
    })
  } catch (error) {
    next(error)
  }
}

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: users.length,
      users
    })
  } catch (error) {
    next(error)
  }
}

const getSellers = async (req, res, next) => {
  try {
    const sellers = await Seller.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: sellers.length,
      sellers
    })
  } catch (error) {
    next(error)
  }
}

const updateSellerStatus = async (req, res, next) => {
  try {
    const { status } = req.body

    const allowedStatuses = [
      'pending',
      'approved',
      'rejected',
      'suspended'
    ]

    if (!allowedStatuses.includes(status)) {
      const error = new Error('Invalid seller status')
      error.statusCode = 400
      return next(error)
    }

    const seller = await Seller.findById(req.params.id)

    if (!seller) {
      const error = new Error('Seller not found')
      error.statusCode = 404
      return next(error)
    }

    seller.status = status

    await seller.save()

    res.status(200).json({
      success: true,
      message: `Seller ${status} successfully`,
      seller
    })
  } catch (error) {
    next(error)
  }
}

const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate('seller', 'name email')
      .populate('category', 'name')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: products.length,
      products
    })
  } catch (error) {
    next(error)
  }
}

const deleteProductByAdmin = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      const error = new Error('Product not found')
      error.statusCode = 404
      return next(error)
    }

    await Product.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('buyer', 'name email')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    })
  } catch (error) {
    next(error)
  }
}

const getOrderByAdmin = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name email')

    if (!order) {
      const error = new Error('Order not found')
      error.statusCode = 404
      return next(error)
    }

    res.status(200).json({
      success: true,
      order
    })
  } catch (error) {
    next(error)
  }
}

const updateOrderStatusByAdmin = async (req, res, next) => {
  try {
    const { status } = req.body

    const allowedStatuses = [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled'
    ]

    if (!allowedStatuses.includes(status)) {
      const error = new Error('Invalid order status')
      error.statusCode = 400
      return next(error)
    }

    const order = await Order.findById(req.params.id)

    if (!order) {
      const error = new Error('Order not found')
      error.statusCode = 404
      return next(error)
    }

    order.status = status

    await order.save()

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getDashboardStats,
  getUsers,
  getSellers,
  updateSellerStatus,
    getAllProducts,
    deleteProductByAdmin,
    getAllOrders,
    getOrderByAdmin,
    updateOrderStatusByAdmin
}