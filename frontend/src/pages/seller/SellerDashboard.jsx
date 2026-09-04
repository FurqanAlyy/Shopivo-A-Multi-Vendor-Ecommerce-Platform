import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/ui/Icon'
import { getMySellerApplication } from '../../services/sellerService'
import { getMyProducts } from '../../services/productService'

const SellerDashboard = () => {
  const [seller, setSeller] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)
        setError('')

        const [sellerResponse, productsResponse] = await Promise.all([
          getMySellerApplication(),
          getMyProducts()
        ])

        setSeller(sellerResponse.seller)
        setProducts(productsResponse.products || [])
      } catch (error) {
        setError(
          error.response?.data?.message ||
          'Unable to load seller dashboard'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8faf9]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-3 h-5 w-96 animate-pulse rounded bg-slate-200" />

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-36 animate-pulse rounded-2xl bg-white ring-1 ring-slate-200"
              />
            ))}
          </div>

          <div className="mt-8 h-80 animate-pulse rounded-2xl bg-white ring-1 ring-slate-200" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8faf9] px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl bg-red-50 p-6 text-center text-red-700">
          {error}
        </div>
      </div>
    )
  }

  const totalProducts = products.length

  const activeProducts = products.filter(
    product => product.status === 'active'
  ).length

  const inactiveProducts = products.filter(
    product => product.status !== 'active'
  ).length

  const totalStock = products.reduce(
    (total, product) => total + (product.stock || 0),
    0
  )

  const lowStockProducts = products.filter(
    product => product.stock > 0 && product.stock <= 5
  )

  const outOfStockProducts = products.filter(
    product => product.stock === 0
  )

  const stats = [
    {
      label: 'Total Products',
      value: totalProducts,
      icon: 'box'
    },
    {
      label: 'Active Products',
      value: activeProducts,
      icon: 'check'
    },
    {
      label: 'Total Stock',
      value: totalStock,
      icon: 'layers'
    },
    {
      label: 'Low Stock',
      value: lowStockProducts.length + outOfStockProducts.length,
      icon: 'warning'
    }
  ]

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-emerald-700">
              Seller Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Welcome back, {seller?.storeName}
            </h1>

            <p className="mt-2 text-slate-500">
              Manage your store and keep track of your products.
            </p>
          </div>

          <Link
            to="/seller/products"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-medium text-white transition hover:bg-emerald-800"
          >
            Manage Products
            <Icon name="arrowRight" size={18} />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(stat => (
            <div
              key={stat.label}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    {stat.label}
                  </p>

                  <p className="mt-3 text-3xl font-semibold text-slate-900">
                    {stat.value}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Icon name={stat.icon} size={21} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Your Products
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Recently added products in your store
                </p>
              </div>

              <Link
                to="/seller/products"
                className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
              >
                View all
              </Link>
            </div>

            {products.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <Icon name="box" size={25} />
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  No products yet
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Add your first product to start selling.
                </p>

                <Link
                  to="/seller/products/new"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
                >
                  Add Product
                  <Icon name="plus" size={17} />
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {products.slice(0, 5).map(product => (
                  <div
                    key={product._id}
                    className="flex items-center gap-4 px-6 py-4"
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                          <Icon name="box" size={20} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-900">
                        {product.name}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        SKU: {product.sku}
                      </p>
                    </div>

                    <div className="hidden text-right sm:block">
                      <p className="font-medium text-slate-900">
                        ${product.price?.toLocaleString()}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {product.stock} in stock
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                        product.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {product.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="font-semibold text-slate-900">
              Inventory Alerts
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Products that need your attention
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-red-50 px-4 py-4">
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Out of stock
                  </p>

                  <p className="mt-1 text-xs text-red-600">
                    Products unavailable for purchase
                  </p>
                </div>

                <span className="text-xl font-semibold text-red-700">
                  {outOfStockProducts.length}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-4">
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    Low stock
                  </p>

                  <p className="mt-1 text-xs text-amber-600">
                    Five or fewer units remaining
                  </p>
                </div>

                <span className="text-xl font-semibold text-amber-700">
                  {lowStockProducts.length}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-4">
                <div>
                  <p className="text-sm font-medium text-emerald-800">
                    Active products
                  </p>

                  <p className="mt-1 text-xs text-emerald-600">
                    Currently available products
                  </p>
                </div>

                <span className="text-xl font-semibold text-emerald-700">
                  {activeProducts}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-emerald-700">
                Store Status
              </p>

              <h2 className="mt-1 text-xl font-semibold text-slate-900">
                Your store is {seller?.status}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {seller?.status === 'approved'
                  ? 'Your store is approved and you can sell products on Shopivo.'
                  : 'Your seller account is currently not approved.'}
              </p>
            </div>

            <span className="w-fit rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium capitalize text-emerald-700">
              {seller?.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerDashboard