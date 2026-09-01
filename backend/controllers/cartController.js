const Cart = require('../models/Cart')
const Product = require('../models/Product')

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({
    user: userId
  })

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: []
    })
  }

  return cart
}

const getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id)

    await cart.populate([
      {
        path: 'items.product',
        select: 'name slug images price discount stock status seller'
      },
      {
        path: 'items.seller',
        select: 'storeName status'
      }
    ])

    res.status(200).json({
      success: true,
      cart
    })
  } catch (error) {
    next(error)
  }
}

const addToCart = async (req, res, next) => {
  try {
    const { product: productId, quantity } = req.body

    const product = await Product.findOne({
      _id: productId,
      status: 'active'
    }).populate('seller', 'status')

    if (!product) {
      const error = new Error('Product not found')
      error.statusCode = 404
      return next(error)
    }

    if (!product.seller || product.seller.status !== 'approved') {
      const error = new Error('Seller is not available')
      error.statusCode = 400
      return next(error)
    }

    if (product.stock < quantity) {
      const error = new Error('Insufficient stock')
      error.statusCode = 400
      return next(error)
    }

    const cart = await getOrCreateCart(req.user._id)

    const existingItem = cart.items.find(
      item => item.product.toString() === product._id.toString()
    )

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity

      if (newQuantity > product.stock) {
        const error = new Error('Requested quantity exceeds available stock')
        error.statusCode = 400
        return next(error)
      }

      existingItem.quantity = newQuantity
    } else {
      cart.items.push({
        product: product._id,
        seller: product.seller._id,
        quantity
      })
    }

    await cart.save()

    await cart.populate([
      {
        path: 'items.product',
        select: 'name slug images price discount stock status seller'
      },
      {
        path: 'items.seller',
        select: 'storeName status'
      }
    ])

    res.status(200).json({
      success: true,
      message: 'Product added to cart',
      cart
    })
  } catch (error) {
    next(error)
  }
}

const updateCartItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id
    })

    if (!cart) {
      const error = new Error('Cart not found')
      error.statusCode = 404
      return next(error)
    }

    const item = cart.items.id(req.params.itemId)

    if (!item) {
      const error = new Error('Cart item not found')
      error.statusCode = 404
      return next(error)
    }

    const product = await Product.findOne({
      _id: item.product,
      status: 'active'
    })

    if (!product) {
      const error = new Error('Product is no longer available')
      error.statusCode = 400
      return next(error)
    }

    if (req.body.quantity > product.stock) {
      const error = new Error('Requested quantity exceeds available stock')
      error.statusCode = 400
      return next(error)
    }

    item.quantity = req.body.quantity

    await cart.save()

    res.status(200).json({
      success: true,
      message: 'Cart item updated successfully',
      cart
    })
  } catch (error) {
    next(error)
  }
}

const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id
    })

    if (!cart) {
      const error = new Error('Cart not found')
      error.statusCode = 404
      return next(error)
    }

    const item = cart.items.id(req.params.itemId)

    if (!item) {
      const error = new Error('Cart item not found')
      error.statusCode = 404
      return next(error)
    }

    item.deleteOne()

    await cart.save()

    res.status(200).json({
      success: true,
      message: 'Product removed from cart',
      cart
    })
  } catch (error) {
    next(error)
  }
}

const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id
    })

    if (!cart) {
      const error = new Error('Cart not found')
      error.statusCode = 404
      return next(error)
    }

    cart.items = []

    await cart.save()

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      cart
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
}