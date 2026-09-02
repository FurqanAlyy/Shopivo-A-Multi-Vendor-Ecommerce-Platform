const Product = require('../models/Product')
const Seller = require('../models/Seller')
const Category = require('../models/Category')
const uploadToCloudinary = require('../utils/uploadToCloudinary')

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const createProduct = async (req, res, next) => {
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

    const category = await Category.findOne({
      _id: req.body.category,
      isActive: true
    })

    if (!category) {
      const error = new Error('Category not found or inactive')
      error.statusCode = 404
      return next(error)
    }

    const existingSku = await Product.findOne({
      sku: req.body.sku.toUpperCase()
    })

    if (existingSku) {
      const error = new Error('SKU already exists')
      error.statusCode = 409
      return next(error)
    }

    let slug = generateSlug(req.body.name)

    const existingSlug = await Product.findOne({ slug })

    if (existingSlug) {
      slug = `${slug}-${Date.now()}`
    }

    const uploadedImages = []

    for (const file of req.files || []) {
      const result = await uploadToCloudinary(file.buffer)
      uploadedImages.push(result.secure_url)
    }

    const product = await Product.create({
      seller: seller._id,
      category: category._id,
      name: req.body.name,
      slug,
      description: req.body.description,
      images: uploadedImages,
      price: req.body.price,
      discount: req.body.discount || 0,
      stock: req.body.stock,
      sku: req.body.sku,
      variants: req.body.variants || [],
      specifications: req.body.specifications || {},
      status: 'active'
    })

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    })
  } catch (error) {
    next(error)
  }
}

const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      seller,
      minPrice,
      maxPrice,
      sort = 'newest',
      page = 1,
      limit = 12
    } = req.query

    const filter = {
      status: 'active'
    }

    if (search) {
      filter.$text = {
        $search: search
      }
    }

    if (category) {
      filter.category = category
    }

    if (seller) {
      filter.seller = seller
    }

    if (minPrice || maxPrice) {
      filter.price = {}

      if (minPrice) {
        filter.price.$gte = Number(minPrice)
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice)
      }
    }

    const pageNumber = Math.max(Number(page), 1)
    const limitNumber = Math.min(Math.max(Number(limit), 1), 50)
    const skip = (pageNumber - 1) * limitNumber

    let sortOption = {
      createdAt: -1
    }

    if (sort === 'price_asc') {
      sortOption = { price: 1 }
    }

    if (sort === 'price_desc') {
      sortOption = { price: -1 }
    }

    if (sort === 'rating') {
      sortOption = { rating: -1 }
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('seller', 'storeName')
        .populate('category', 'name slug')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber),

      Product.countDocuments(filter)
    ])

    res.status(200).json({
      success: true,
      products,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber)
      }
    })
  } catch (error) {
    next(error)
  }
}

const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      status: 'active'
    })
      .populate('seller', 'storeName description')
      .populate('category', 'name slug')

    if (!product) {
      const error = new Error('Product not found')
      error.statusCode = 404
      return next(error)
    }

    res.status(200).json({
      success: true,
      product
    })
  } catch (error) {
    next(error)
  }
}

const getMyProducts = async (req, res, next) => {
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

    const products = await Product.find({
      seller: seller._id
    })
      .populate('category', 'name slug')
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

const updateProduct = async (req, res, next) => {
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

    const product = await Product.findOne({
      _id: req.params.id,
      seller: seller._id
    })

    if (!product) {
      const error = new Error('Product not found')
      error.statusCode = 404
      return next(error)
    }

    const {
      name,
      description,
      category,
      images,
      price,
      discount,
      stock,
      sku,
      variants,
      specifications
    } = req.body

    if (category) {
      const categoryExists = await Category.findOne({
        _id: category,
        isActive: true
      })

      if (!categoryExists) {
        const error = new Error('Category not found or inactive')
        error.statusCode = 404
        return next(error)
      }

      product.category = category
    }

    if (sku && sku.toUpperCase() !== product.sku) {
      const existingSku = await Product.findOne({
        sku: sku.toUpperCase(),
        _id: { $ne: product._id }
      })

      if (existingSku) {
        const error = new Error('SKU already exists')
        error.statusCode = 409
        return next(error)
      }

      product.sku = sku
    }

    if (name !== undefined) {
      product.name = name
    }

    if (description !== undefined) {
      product.description = description
    }

    if (images !== undefined) {
      product.images = images
    }

    if (price !== undefined) {
      product.price = price
    }

    if (discount !== undefined) {
      product.discount = discount
    }

    if (stock !== undefined) {
      product.stock = stock
    }

    if (variants !== undefined) {
      product.variants = variants
    }

    if (specifications !== undefined) {
      product.specifications = specifications
    }

    await product.save()

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    })
  } catch (error) {
    next(error)
  }
}

const updateProductStock = async (req, res, next) => {
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

    const product = await Product.findOne({
      _id: req.params.id,
      seller: seller._id
    })

    if (!product) {
      const error = new Error('Product not found')
      error.statusCode = 404
      return next(error)
    }

    product.stock = req.body.stock

    await product.save()

    res.status(200).json({
      success: true,
      message: 'Product stock updated successfully',
      product
    })
  } catch (error) {
    next(error)
  }
}

const deleteProduct = async (req, res, next) => {
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

    const product = await Product.findOne({
      _id: req.params.id,
      seller: seller._id
    })

    if (!product) {
      const error = new Error('Product not found')
      error.statusCode = 404
      return next(error)
    }

    product.status = 'inactive'

    await product.save()

    res.status(200).json({
      success: true,
      message: 'Product deactivated successfully'
    })
  } catch (error) {
    next(error)
  }
}
module.exports = {
  createProduct,
  getProducts,
  getProduct,
  getMyProducts,
  updateProduct,
  updateProductStock,
  deleteProduct
}