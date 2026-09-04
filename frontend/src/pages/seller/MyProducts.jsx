import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/ui/Icon'
import {
  deleteProduct,
  getMyProducts,
  updateProductStock
} from '../../services/productService'

const MyProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingStock, setUpdatingStock] = useState(null)
  const [deletingProduct, setDeletingProduct] = useState(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await getMyProducts()
      setProducts(response.products || [])
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Unable to load your products'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleStockUpdate = async (id, currentStock, change) => {
    const newStock = Math.max(0, currentStock + change)

    try {
      setUpdatingStock(id)
      setError('')

      await updateProductStock(id, newStock)
      await fetchProducts()
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Unable to update stock'
      )
    } finally {
      setUpdatingStock(null)
    }
  }

  const handleDelete = async product => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    )

    if (!confirmed) return

    try {
      setDeletingProduct(product._id)
      setError('')

      await deleteProduct(product._id)
      await fetchProducts()
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Unable to delete product'
      )
    } finally {
      setDeletingProduct(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8faf9]">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="h-8 w-56 animate-pulse rounded-lg bg-slate-200" />

          <div className="mt-8 space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-2xl bg-white ring-1 ring-slate-200"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              to="/seller/dashboard"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-700"
            >
              <Icon name="arrowLeft" size={17} />
              Seller Dashboard
            </Link>

            <h1 className="mt-5 text-3xl font-semibold text-slate-900">
              My Products
            </h1>

            <p className="mt-2 text-slate-500">
              Manage your products, inventory and availability.
            </p>
          </div>

          <Link
            to="/seller/products/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-medium text-white transition hover:bg-emerald-800"
          >
            <Icon name="plus" size={18} />
            Add Product
          </Link>
        </div>

        {error && (
          <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          {products.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Icon name="box" size={28} />
              </div>

              <h2 className="mt-5 text-xl font-semibold text-slate-900">
                No products yet
              </h2>

              <p className="mt-2 text-slate-500">
                Add your first product to start selling on Shopivo.
              </p>

              <Link
                to="/seller/products/new"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-medium text-white hover:bg-emerald-800"
              >
                Add Product
                <Icon name="arrowRight" size={18} />
              </Link>
            </div>
          ) : (
            <>
              <div className="hidden border-b border-slate-100 px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-400 lg:grid lg:grid-cols-[2fr_0.8fr_0.8fr_1fr_1fr_0.7fr] lg:items-center lg:gap-5">
                <span>Product</span>
                <span>Price</span>
                <span>Stock</span>
                <span>Status</span>
                <span>Updated</span>
                <span className="text-right">Actions</span>
              </div>

              <div className="divide-y divide-slate-100">
                {products.map(product => (
                  <div
                    key={product._id}
                    className="px-6 py-5"
                  >
                    <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[2fr_0.8fr_0.8fr_1fr_1fr_0.7fr] lg:items-center lg:gap-5">
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                              <Icon name="box" size={22} />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <Link
                            to={`/products/${product._id}`}
                            className="block truncate font-medium text-slate-900 hover:text-emerald-700"
                          >
                            {product.name}
                          </Link>

                          <p className="mt-1 truncate text-sm text-slate-500">
                            SKU: {product.sku}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {product.category?.name || 'Uncategorized'}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400 lg:hidden">
                          Price
                        </p>

                        <p className="mt-1 font-medium text-slate-900 lg:mt-0">
                          ${product.price?.toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400 lg:hidden">
                          Stock
                        </p>

                        <div className="mt-2 flex items-center gap-2 lg:mt-0">
                          <button
                            type="button"
                            disabled={
                              updatingStock === product._id ||
                              product.stock <= 0
                            }
                            onClick={() =>
                              handleStockUpdate(
                                product._id,
                                product.stock,
                                -1
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Icon name="minus" size={15} />
                          </button>

                          <span className="w-8 text-center text-sm font-medium text-slate-900">
                            {product.stock}
                          </span>

                          <button
                            type="button"
                            disabled={updatingStock === product._id}
                            onClick={() =>
                              handleStockUpdate(
                                product._id,
                                product.stock,
                                1
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Icon name="plus" size={15} />
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400 lg:hidden">
                          Status
                        </p>

                        <span
                          className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize lg:mt-0 ${
                            product.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : product.status === 'rejected'
                                ? 'bg-red-50 text-red-700'
                                : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {product.status}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400 lg:hidden">
                          Updated
                        </p>

                        <p className="mt-1 text-sm text-slate-500 lg:mt-0">
                          {product.updatedAt
                            ? new Date(
                                product.updatedAt
                              ).toLocaleDateString()
                            : '—'}
                        </p>
                      </div>

                      <div className="flex justify-start gap-2 lg:justify-end">
                        <Link
                          to={`/seller/products/${product._id}/edit`}
                          className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          disabled={deletingProduct === product._id}
                          onClick={() => handleDelete(product)}
                          className="inline-flex h-9 items-center justify-center rounded-lg border border-red-100 px-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingProduct === product._id
                            ? 'Deleting...'
                            : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyProducts