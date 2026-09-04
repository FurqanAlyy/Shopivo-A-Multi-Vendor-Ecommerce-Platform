import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProduct, updateProduct } from '../../services/productService'
import { getCategories } from '../../services/categoryService'
import Icon from '../../components/ui/Icon'

const EditProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [categories, setCategories] = useState([])
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    discount: '',
    stock: '',
    sku: ''
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError('')

        const [productResponse, categoryResponse] = await Promise.all([
          getProduct(id),
          getCategories()
        ])

        const currentProduct = productResponse.product

        setProduct(currentProduct)
        setCategories(categoryResponse.categories || [])

        setForm({
          name: currentProduct.name || '',
          description: currentProduct.description || '',
          category: currentProduct.category?._id || currentProduct.category || '',
          price: currentProduct.price ?? '',
          discount: currentProduct.discount ?? '',
          stock: currentProduct.stock ?? '',
          sku: currentProduct.sku || ''
        })
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Failed to load product'
        )
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview))
    }
  }, [previews])

  const handleChange = e => {
    const { name, value } = e.target

    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = e => {
    const selectedFiles = Array.from(e.target.files || [])

    if (!selectedFiles.length) {
      return
    }

    if (selectedFiles.length > 5) {
      setError('You can upload a maximum of 5 images')
      e.target.value = ''
      return
    }

    const invalidFile = selectedFiles.find(
      file => !file.type.startsWith('image/')
    )

    if (invalidFile) {
      setError('Only image files are allowed')
      e.target.value = ''
      return
    }

    const oversizedFile = selectedFiles.find(
      file => file.size > 5 * 1024 * 1024
    )

    if (oversizedFile) {
      setError('Each image must be smaller than 5MB')
      e.target.value = ''
      return
    }

    previews.forEach(preview => URL.revokeObjectURL(preview))

    setImages(selectedFiles)
    setPreviews(selectedFiles.map(file => URL.createObjectURL(file)))
    setError('')
    e.target.value = ''
  }

  const removeNewImage = index => {
    const newImages = images.filter((_, imageIndex) => imageIndex !== index)

    previews.forEach((preview, previewIndex) => {
      if (previewIndex === index) {
        URL.revokeObjectURL(preview)
      }
    })

    setImages(newImages)
    setPreviews(newImages.map(file => URL.createObjectURL(file)))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      setSubmitting(true)
      setError('')
      setSuccess('')

      const productData = new FormData()

      productData.append('name', form.name)
      productData.append('description', form.description)
      productData.append('category', form.category)
      productData.append('price', form.price)
      productData.append('discount', form.discount || 0)
      productData.append('stock', form.stock)
      productData.append('sku', form.sku)

      images.forEach(image => {
        productData.append('images', image)
      })

      await updateProduct(id, productData)

      setSuccess('Product updated successfully')

      setTimeout(() => {
        navigate('/seller/products')
      }, 1000)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to update product'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8faf9]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-700" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f8faf9] px-6 py-12">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            Product not found
          </h1>

          <button
            onClick={() => navigate('/seller/products')}
            className="mt-6 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-800"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              onClick={() => navigate('/seller/products')}
              className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-700"
            >
              <Icon name="arrowLeft" size={17} />
              Back to Products
            </button>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Edit Product
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Update your product information and inventory
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  Product Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update the basic information about your product
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Product Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    minLength={2}
                    maxLength={150}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    minLength={10}
                    maxLength={5000}
                    rows={6}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Describe your product"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Category
                  </label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">Select category</option>

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
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  Pricing & Inventory
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage pricing, discount and available stock
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Price
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      $
                    </span>

                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-8 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Discount
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      name="discount"
                      value={form.discount}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                      placeholder="0"
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      %
                    </span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    required
                    min="0"
                    step="1"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    SKU
                  </label>

                  <input
                    type="text"
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    minLength={2}
                    maxLength={50}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm uppercase text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    placeholder="e.g. SHP-001"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  Product Images
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Upload new images if you want to replace the current ones
                </p>
              </div>

              <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-sm font-medium text-amber-800">
                  Important
                </p>

                <p className="mt-1 text-sm text-amber-700">
                  Selecting new images will replace all existing product
                  images. If you don't select any new images, your current
                  images will remain unchanged.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {images.length > 0
                  ? images.map((image, index) => (
                      <div
                        key={`${image.name}-${index}`}
                        className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                      >
                        <img
                          src={previews[index]}
                          alt={`New product ${index + 1}`}
                          className="h-full w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Icon name="close" size={16} />
                        </button>
                      </div>
                    ))
                  : product.images?.map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
              </div>

              <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 px-6 py-10 text-center transition hover:border-emerald-400 hover:bg-emerald-50/30">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <Icon name="plus" size={22} />
                </div>

                <span className="text-sm font-medium text-slate-700">
                  Choose new images
                </span>

                <span className="mt-1 text-xs text-slate-400">
                  Up to 5 images, maximum 5MB each
                </span>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </section>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate('/seller/products')}
                disabled={submitting}
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}

                {submitting ? 'Updating...' : 'Update Product'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProduct