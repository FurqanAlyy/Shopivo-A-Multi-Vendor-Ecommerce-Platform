const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      unique: true
    },

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    currency: {
      type: String,
      default: 'usd',
      lowercase: true
    },

    method: {
      type: String,
      enum: ['stripe'],
      default: 'stripe'
    },

    status: {
      type: String,
      enum: [
        'pending',
        'paid',
        'failed',
        'refunded'
      ],
      default: 'pending'
    },

    stripeSessionId: {
      type: String,
      unique: true,
      sparse: true
    },

    stripePaymentIntentId: {
      type: String,
      unique: true,
      sparse: true
    },

    paidAt: {
      type: Date,
      default: null
    },

    refundedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Payment', paymentSchema)