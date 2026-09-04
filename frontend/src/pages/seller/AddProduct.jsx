import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../../components/ui/Icon'
import { getCategories } from '../../services/categoryService'
import { createProduct } from '../../services/productService'

const AddProduct = () => {
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    discount: '',
    stock: '',
    sku: ''
  })

  const [images, setImages] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories()
        setCategories(response.categories || [])
      } catch (error) {
        setError(
          error.response?.data?.message ||
          'Unable to load categories'
        )
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  const handleChange = event => {
    const { name, value } = event.target

    setFormData(previous => ({
      ...previous,
      [name]: value
    }))
  }

  const handleImages = event => {
    const selectedFiles = Array.from(event.target.files || [])

    if (selectedFiles.length > 5) {
      setError('You can upload a maximum of 5 images')
      setImages(selectedFiles.slice(0, 5))
      return
    }

    setError('')
    setImages(selectedFiles)
  }

  const removeImage = index => {
    setImages(previous =>
      previous.filter((_, imageIndex) => imageIndex !== index)
    )
  }

  const handleSubmit = async event => {
    event.preventDefault()

    if (images.length === 0) {
      setError('At least one product image is required')
      return
    }

    try {
      setSubmitting(true)
      setError('')

      const data = new FormData()

      data.append('name', formData.name)
      data.append('description', formData.description)
      data.append('category', formData.category)
      data.append('price', formData.price)
      data.append('discount', formData.discount || 0)
      data.append('stock', formData.stock)
      data.append('sku', formData.sku)

      images.forEach(image => {
        data.append('images', image)
      })

      await createProduct(data)

      navigate('/seller/products', {
        replace: true
      })
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Failed to create product'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
        <Link
          to="/seller/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-700"
        >
          <Icon name="arrowLeft" size={17} />
          My Products
        </Link>

        <div className="mt-7">
          <p className="text-sm font-medium uppercase tracking-wider text-emerald-700">
            Seller
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Add Product
          </h1>

          <p className="mt-2 text-slate-500">
            Add a new product to your Shopivo store.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900">
              Product Information
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  minLength={2}
                  maxLength={150}
                  placeholder="Enter product name"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={6}
                  placeholder="Describe your product"
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  disabled={loadingCategories}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">
                    {loadingCategories
                      ? 'Loading categories...'
                      : 'Select a category'}
                  </option>

                  {categories.map(category => (
                    <option
                      key={category._id}
                      value={category._id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900">
              Pricing & Inventory
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Discount (%)
                </label>

                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="0"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Stock
                </label>

                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  step="1"
                  placeholder="0"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  SKU
                </label>

                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                  placeholder="e.g. SHOE-001"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 uppercase outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Product Images
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Upload up to 5 images. Each image must be 5 MB or smaller.
              </p>
            </div>

            <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 px-6 py-12 text-center transition hover:border-emerald-400 hover:bg-emerald-50/30">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <Icon name="plus" size={25} />
              </div>

              <p className="mt-4 font-medium text-slate-800">
                Choose product images
              </p>

              <p className="mt-1 text-sm text-slate-400">
                PNG, JPG, JPEG up to 5 MB each
              </p>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImages}
                className="hidden"
              />
            </label>

            {images.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                {images.map((image, index) => (
                  <div
                    key={`${image.name}-${index}`}
                    className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100"
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Product ${index + 1}`}
                      className="h-full w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-600 shadow-sm transition hover:bg-white"
                    >
                      <Icon name="close" size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              to="/seller/products"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-6 py-3 font-medium text-slate-700 transition hover:bg-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting || loadingCategories}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-7 py-3 font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? 'Creating Product...'
                : 'Create Product'}

              {!submitting && <Icon name="arrowRight" size={18} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProduct