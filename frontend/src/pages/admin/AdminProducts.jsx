import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getAdminProducts,
  deleteAdminProduct
} from '../../services/adminService'
import Icon from '../../components/ui/Icon'

const statusStyles = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  draft: 'bg-amber-50 text-amber-700 border-amber-200',
  inactive: 'bg-slate-50 text-slate-700 border-slate-200',
  rejected: 'bg-red-50 text-red-700 border-red-200'
}

const statusLabels = {
  active: 'Active',
  draft: 'Draft',
  inactive: 'Inactive',
  rejected: 'Rejected'
}

const AdminProducts = () => {
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await getAdminProducts()

        setProducts(response.products || [])
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Failed to load products'
        )
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const handleDelete = async id => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this product? This action cannot be undone.'
    )

    if (!confirmed) return

    try {
      setDeletingId(id)
      setError('')

      await deleteAdminProduct(id)

      setProducts(current =>
        current.filter(product => product._id !== id)
      )
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to delete product'
      )
    } finally {
      setDeletingId(null)
    }
  }

  const formatPrice = price => {
    return `$${Number(price || 0).toLocaleString()}`
  }

  const getDiscountedPrice = product => {
    const price = Number(product.price || 0)
    const discount = Number(product.discount || 0)

    return price - (price * discount) / 100
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8faf9]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-700" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-700"
          >
            <Icon name="arrowLeft" size={17} />
            Back to Dashboard
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700">
                Administration
              </p>

              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
                Manage Products
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Monitor and manage products listed on the marketplace.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Total Products
              </p>

              <p className="mt-1 text-xl font-semibold text-slate-900">
                {products.length}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError('')}
              className="shrink-0 font-medium hover:text-red-900"
            >
              Dismiss
            </button>
          </div>
        )}

        {products.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
              <Icon name="box" size={26} />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              No products found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              There are currently no products listed on the marketplace.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Product
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Seller
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Price
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Stock
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {products.map(product => (
                    <tr
                      key={product._id}
                      className="transition hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
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
                            <p className="max-w-[240px] truncate font-medium text-slate-900">
                              {product.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              SKU: {product.sku}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-medium text-slate-800">
                          {product.seller?.name || 'N/A'}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {product.seller?.email || 'N/A'}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <span className="text-sm text-slate-600">
                          {product.category?.name || 'N/A'}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        {product.discount > 0 ? (
                          <div>
                            <p className="font-medium text-slate-900">
                              {formatPrice(
                                getDiscountedPrice(product)
                              )}
                            </p>

                            <p className="mt-1 text-xs text-slate-400 line-through">
                              {formatPrice(product.price)}
                            </p>
                          </div>
                        ) : (
                          <p className="font-medium text-slate-900">
                            {formatPrice(product.price)}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`text-sm font-medium ${
                            Number(product.stock) === 0
                              ? 'text-red-600'
                              : Number(product.stock) <= 5
                                ? 'text-amber-600'
                                : 'text-slate-700'
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${
                            statusStyles[product.status] ||
                            'border-slate-200 bg-slate-50 text-slate-600'
                          }`}
                        >
                          {statusLabels[product.status] ||
                            product.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button
                          type="button"
                          disabled={deletingId === product._id}
                          onClick={() =>
                            handleDelete(product._id)
                          }
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === product._id
                            ? 'Deleting...'
                            : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminProducts