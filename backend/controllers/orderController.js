const mongoose = require('mongoose')

const Cart = require('../models/Cart')
const Product = require('../models/Product')
const Seller = require('../models/Seller')
const Order = require('../models/Order')


const generateOrderNumber = () => {
  return `SH-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`
}


const checkout = async (req, res, next) => {
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const cart = await Cart.findOne({
      user: req.user._id
    }).session(session)

    if (!cart || cart.items.length === 0) {
      const error = new Error('Cart is empty')
      error.statusCode = 400
      throw error
    }

    const productIds = cart.items.map(item => item.product)

    const products = await Product.find({
      _id: { $in: productIds },
      status: 'active'
    }).session(session)

    if (products.length !== productIds.length) {
      const error = new Error(
        'One or more products are no longer available'
      )
      error.statusCode = 400
      throw error
    }

    const productMap = new Map(
      products.map(product => [
        product._id.toString(),
        product
      ])
    )

    const sellerGroups = new Map()

    let subtotal = 0

    for (const cartItem of cart.items) {
      const product = productMap.get(
        cartItem.product.toString()
      )

      if (!product) {
        const error = new Error('Product not found')
        error.statusCode = 404
        throw error
      }

      if (product.stock < cartItem.quantity) {
        const error = new Error(
          `Insufficient stock for ${product.name}`
        )
        error.statusCode = 400
        throw error
      }

      const unitPrice =
        product.price -
        product.price * (product.discount / 100)

      const totalPrice =
        unitPrice * cartItem.quantity

      subtotal += totalPrice

      const sellerId = product.seller.toString()

      if (!sellerGroups.has(sellerId)) {
        sellerGroups.set(sellerId, {
          seller: product.seller,
          items: [],
          subtotal: 0
        })
      }

      const sellerGroup = sellerGroups.get(sellerId)

      sellerGroup.items.push({
        product: product._id,
        seller: product.seller,
        name: product.name,
        image: product.images[0] || '',
        sku: product.sku,
        quantity: cartItem.quantity,
        unitPrice,
        discount: product.discount,
        totalPrice
      })

      sellerGroup.subtotal += totalPrice
    }

    const shippingFee = 0

    const sellerOrders = Array.from(
      sellerGroups.values()
    ).map(group => ({
      seller: group.seller,
      items: group.items,
      subtotal: group.subtotal,
      shippingFee: 0,
      total: group.subtotal,
      status: 'pending'
    }))

    const order = await Order.create(
      [
        {
          orderNumber: generateOrderNumber(),

          buyer: req.user._id,

          sellerOrders,

          shippingAddress: req.body.shippingAddress,

          subtotal,

          shippingFee,

          total: subtotal + shippingFee,

          paymentStatus:
            req.body.paymentMethod === 'cod'
              ? 'pending'
              : 'pending',

          paymentMethod: req.body.paymentMethod,

          status: 'pending'
        }
      ],
      { session }
    )

    for (const cartItem of cart.items) {
      const product = productMap.get(
        cartItem.product.toString()
      )

      const updatedProduct =
        await Product.findOneAndUpdate(
          {
            _id: product._id,
            stock: {
              $gte: cartItem.quantity
            }
          },
          {
            $inc: {
              stock: -cartItem.quantity
            }
          },
          {
            new: true,
            session
          }
        )

      if (!updatedProduct) {
        const error = new Error(
          `Unable to reserve stock for ${product.name}`
        )
        error.statusCode = 409
        throw error
      }
    }

    cart.items = []

    await cart.save({ session })

    await session.commitTransaction()

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: order[0]
    })
  } catch (error) {
    await session.abortTransaction()
    next(error)
  } finally {
    await session.endSession()
  }
}

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      buyer: req.user._id
    })
      .populate(
        'sellerOrders.seller',
        'storeName'
      )
      .sort({
        createdAt: -1
      })

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    })
  } catch (error) {
    next(error)
  }
}

const getMyOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      buyer: req.user._id
    }).populate(
      'sellerOrders.seller',
      'storeName'
    )

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

const getSellerOrders = async (req, res, next) => {
  try {
    const seller = await Seller.findOne({
      user: req.user._id,
      status: 'approved'
    })

    if (!seller) {
      const error = new Error('Approved seller account required')
      error.statusCode = 403
      return next(error)
    }

    const orders = await Order.find({
      'sellerOrders.seller': seller._id
    })
      .populate('buyer', 'name email')
      .sort({ createdAt: -1 })

    const sellerOrders = []

    for (const order of orders) {
      const sellerOrder = order.sellerOrders.find(
        item =>
          item.seller.toString() ===
          seller._id.toString()
      )

      if (sellerOrder) {
        sellerOrders.push({
          orderId: order._id,
          orderNumber: order.orderNumber,
          buyer: order.buyer,
          shippingAddress: order.shippingAddress,
          paymentStatus: order.paymentStatus,
          paymentMethod: order.paymentMethod,
          createdAt: order.createdAt,
          ...sellerOrder.toObject()
        })
      }
    }

    res.status(200).json({
      success: true,
      count: sellerOrders.length,
      orders: sellerOrders
    })
  } catch (error) {
    next(error)
  }
}

const getSellerOrder = async (req, res, next) => {
  try {
    const seller = await Seller.findOne({
      user: req.user._id,
      status: 'approved'
    })

    if (!seller) {
      const error = new Error('Approved seller account required')
      error.statusCode = 403
      return next(error)
    }

    const order = await Order.findOne({
      _id: req.params.id,
      'sellerOrders.seller': seller._id
    }).populate(
      'buyer',
      'name email'
    )

    if (!order) {
      const error = new Error('Order not found')
      error.statusCode = 404
      return next(error)
    }

    const sellerOrder = order.sellerOrders.find(
      item =>
        item.seller.toString() ===
        seller._id.toString()
    )

    res.status(200).json({
      success: true,
      order: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        buyer: order.buyer,
        shippingAddress: order.shippingAddress,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
        ...sellerOrder.toObject()
      }
    })
  } catch (error) {
    next(error)
  }
}

const updateSellerOrderStatus = async (
  req,
  res,
  next
) => {
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const seller = await Seller.findOne({
      user: req.user._id,
      status: 'approved'
    }).session(session)

    if (!seller) {
      const error = new Error(
        'Approved seller account required'
      )
      error.statusCode = 403
      throw error
    }

    const order = await Order.findOne({
      _id: req.params.id,
      'sellerOrders.seller': seller._id
    }).session(session)

    if (!order) {
      const error = new Error('Order not found')
      error.statusCode = 404
      throw error
    }

    const sellerOrder = order.sellerOrders.find(
      item =>
        item.seller.toString() ===
        seller._id.toString()
    )

    if (!sellerOrder) {
      const error = new Error('Seller order not found')
      error.statusCode = 404
      throw error
    }

    const currentStatus = sellerOrder.status
    const newStatus = req.body.status

    const allowedTransitions = {
      pending: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [],
      cancelled: []
    }

    if (
      !allowedTransitions[currentStatus].includes(
        newStatus
      )
    ) {
      const error = new Error(
        `Cannot change order status from ${currentStatus} to ${newStatus}`
      )
      error.statusCode = 400
      throw error
    }

    sellerOrder.status = newStatus

    if (newStatus === 'delivered') {
      sellerOrder.deliveredAt = new Date()
    }

    if (newStatus === 'cancelled') {
      sellerOrder.cancelledAt = new Date()
    }

    updateParentOrderStatus(order)
    
    await order.save({ session })

    await session.commitTransaction()

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order
    })
  } catch (error) {
    await session.abortTransaction()
    next(error)
  } finally {
    await session.endSession()
  }
}

const updateParentOrderStatus = order => {
  const statuses = order.sellerOrders.map(
    sellerOrder => sellerOrder.status
  )

  if (statuses.every(status => status === 'delivered')) {
    order.status = 'delivered'
    return
  }

  if (
    statuses.every(
      status => status === 'cancelled'
    )
  ) {
    order.status = 'cancelled'
    return
  }

  if (
    statuses.some(
      status => status === 'shipped'
    )
  ) {
    order.status = 'shipped'
    return
  }

  if (
    statuses.some(
      status => status === 'processing'
    )
  ) {
    order.status = 'processing'
    return
  }

  order.status = 'confirmed'
}

module.exports = {
  checkout,
  getMyOrders,
  getMyOrder,
  getSellerOrders,
  getSellerOrder,
  updateSellerOrderStatus,
  updateParentOrderStatus
}