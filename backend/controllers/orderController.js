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

module.exports = {
  checkout,
  getMyOrders,
  getMyOrder
}