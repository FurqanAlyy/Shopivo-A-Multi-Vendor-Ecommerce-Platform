const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Protected route accessed successfully',
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    })
  } catch (error) {
    next(error)
  }
}

const getSellerArea = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Seller area accessed successfully'
    })
  } catch (error) {
    next(error)
  }
}

const getAdminArea = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Admin area accessed successfully'
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getProfile,
  getSellerArea,
  getAdminArea
}