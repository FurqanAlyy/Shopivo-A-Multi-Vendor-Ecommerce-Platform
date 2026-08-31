const Category = require('../models/Category')

const createCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body

    const existingCategory = await Category.findOne({
      name: { $regex: `^${name}$`, $options: 'i' }
    })

    if (existingCategory) {
      const error = new Error('Category already exists')
      error.statusCode = 409
      return next(error)
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const category = await Category.create({
      name,
      slug,
      description,
      image
    })

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category
    })
  } catch (error) {
    next(error)
  }
}

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({
      isActive: true
    }).sort({ name: 1 })

    res.status(200).json({
      success: true,
      count: categories.length,
      categories
    })
  } catch (error) {
    next(error)
  }
}

const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      isActive: true
    })

    if (!category) {
      const error = new Error('Category not found')
      error.statusCode = 404
      return next(error)
    }

    res.status(200).json({
      success: true,
      category
    })
  } catch (error) {
    next(error)
  }
}

const updateCategory = async (req, res, next) => {
  try {
    const { name, description, image, isActive } = req.body

    const category = await Category.findById(req.params.id)

    if (!category) {
      const error = new Error('Category not found')
      error.statusCode = 404
      return next(error)
    }

    if (name && name.toLowerCase() !== category.name.toLowerCase()) {
      const existingCategory = await Category.findOne({
        name: { $regex: `^${name}$`, $options: 'i' },
        _id: { $ne: category._id }
      })

      if (existingCategory) {
        const error = new Error('Category already exists')
        error.statusCode = 409
        return next(error)
      }

      category.name = name
      category.slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }

    if (description !== undefined) {
      category.description = description
    }

    if (image !== undefined) {
      category.image = image
    }

    if (isActive !== undefined) {
      category.isActive = isActive
    }

    await category.save()

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      category
    })
  } catch (error) {
    next(error)
  }
}

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id)

    if (!category) {
      const error = new Error('Category not found')
      error.statusCode = 404
      return next(error)
    }

    category.isActive = false

    await category.save()

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
}