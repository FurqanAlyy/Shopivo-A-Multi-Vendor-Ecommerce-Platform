const mongoose = require('mongoose')

const sellerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },

    storeName: {
      type: String,
      required: [true, 'Store name is required'],
      trim: true,
      minlength: [2, 'Store name must be at least 2 characters'],
      maxlength: [100, 'Store name cannot exceed 100 characters']
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: ''
    },

    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },

    address: {
      street: {
        type: String,
        required: [true, 'Street address is required'],
        trim: true
      },

      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
      },

      state: {
        type: String,
        trim: true,
        default: ''
      },

      postalCode: {
        type: String,
        required: [true, 'Postal code is required'],
        trim: true
      },

      country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true
      }
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending'
    },

    rejectionReason: {
      type: String,
      trim: true,
      maxlength: [500, 'Rejection reason cannot exceed 500 characters'],
      default: ''
    },

    approvedAt: {
      type: Date,
      default: null
    },

    rejectedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Seller', sellerSchema)