const mongoose = require('mongoose')

const variantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Variant name is required'],
      trim: true
    },

    value: {
      type: String,
      required: [true, 'Variant value is required'],
      trim: true
    },

    price: {
      type: Number,
      min: [0, 'Price cannot be negative']
    },

    stock: {
      type: Number,
      min: [0, 'Stock cannot be negative'],
      default: 0
    },

    sku: {
      type: String,
      trim: true,
      uppercase: true
    }
  },
  {
    _id: true
  }
)

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seller',
      required: true,
      index: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
      index: true
    },

    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Product name must be at least 2 characters'],
      maxlength: [150, 'Product name cannot exceed 150 characters']
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },

    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [5000, 'Description cannot exceed 5000 characters']
    },

    images: {
      type: [String],
      validate: {
        validator: (images) => images.length >= 1,
        message: 'At least one product image is required'
      }
    },

    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative']
    },

    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100']
    },

    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },

    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true
    },

    variants: {
      type: [variantSchema],
      default: []
    },

    specifications: {
      type: Map,
      of: String,
      default: {}
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    reviewCount: {
      type: Number,
      default: 0,
      min: 0
    },

    status: {
      type: String,
      enum: ['draft', 'active', 'inactive', 'rejected'],
      default: 'draft',
      index: true
    }
  },
  {
    timestamps: true
  }
)

productSchema.index({
  name: 'text',
  description: 'text'
})

module.exports = mongoose.model('Product', productSchema)