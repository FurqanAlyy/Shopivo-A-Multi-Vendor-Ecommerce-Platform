const Seller = require('../models/Seller')
const User = require('../models/User')

const applyAsSeller = async (req, res, next) => {
  try {
    const existingApplication = await Seller.findOne({
      user: req.user._id
    })

    if (existingApplication) {
      const error = new Error('You already have a seller application')
      error.statusCode = 409
      return next(error)
    }

    const seller = await Seller.create({
      user: req.user._id,
      storeName: req.body.storeName,
      description: req.body.description,
      phone: req.body.phone,
      address: req.body.address
    })

    req.user.sellerProfile = seller._id
    await req.user.save()

    res.status(201).json({
      success: true,
      message: 'Seller application submitted successfully',
      seller
    })
  } catch (error) {
    next(error)
  }
}

const getMySellerApplication = async (req, res, next) => {
  try {
    const seller = await Seller.findOne({
      user: req.user._id
    })

    if (!seller) {
      const error = new Error('Seller application not found')
      error.statusCode = 404
      return next(error)
    }

    res.status(200).json({
      success: true,
      seller
    })
  } catch (error) {
    next(error)
  }
}

const getSellerApplications = async (req, res, next) => {
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

const approveSeller = async (req, res, next) => {
  try {
    const seller = await Seller.findById(req.params.id)

    if (!seller) {
      const error = new Error('Seller application not found')
      error.statusCode = 404
      return next(error)
    }

    if (seller.status === 'approved') {
      const error = new Error('Seller is already approved')
      error.statusCode = 400
      return next(error)
    }

    seller.status = 'approved'
    seller.approvedAt = new Date()
    seller.rejectionReason = ''
    seller.rejectedAt = null

    await seller.save()

    await User.findByIdAndUpdate(seller.user, {
      role: 'seller'
    })

    res.status(200).json({
      success: true,
      message: 'Seller approved successfully',
      seller
    })
  } catch (error) {
    next(error)
  }
}

const rejectSeller = async (req, res, next) => {
  try {
    const seller = await Seller.findById(req.params.id)

    if (!seller) {
      const error = new Error('Seller application not found')
      error.statusCode = 404
      return next(error)
    }

    if (seller.status === 'approved') {
      const error = new Error('Approved sellers cannot be rejected')
      error.statusCode = 400
      return next(error)
    }

    seller.status = 'rejected'
    seller.rejectionReason = req.body.reason || 'Application rejected'
    seller.rejectedAt = new Date()

    await seller.save()

    res.status(200).json({
      success: true,
      message: 'Seller application rejected',
      seller
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  applyAsSeller,
  getMySellerApplication,
  getSellerApplications,
  approveSeller,
  rejectSeller
}