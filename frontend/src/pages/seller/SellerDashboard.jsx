import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getMySellerApplication
} from '../../services/sellerService'
import {
  getMyProducts
} from '../../services/productService'
import {
  getSellerOrders
} from '../../services/orderService'
import Icon from '../../components/ui/Icon'

const statusStyles = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped: 'bg-violet-50 text-violet-700 border-violet-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200'
}

const statusLabels = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
}

const SellerDashboard = () => {
  const [seller, setSeller] = useState(null)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true)
        setError('')

        const [
          sellerResponse,
          productsResponse,
          ordersResponse
        ] = await Promise.all([
          getMySellerApplication(),
          getMyProducts(),
          getSellerOrders()
        ])

        setSeller(sellerResponse.seller)
        setProducts(productsResponse.products || [])
        setOrders(ordersResponse.orders || [])
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Failed to load seller dashboard'
        )
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const totalProducts = products.length

  const activeProducts = products.filter(
    product => product.status === 'active'
  ).length

  const totalStock = products.reduce(
    (total, product) => total + Number(product.stock || 0),
    0
  )

  const lowStockProducts = products.filter(
    product =>
      Number(product.stock || 0) > 0 &&
      Number(product.stock || 0) <= 5
  )

  const outOfStockProducts = products.filter(
    product => Number(product.stock || 0) === 0
  )

  const pendingOrders = orders.filter(
    order => order.status === 'pending'
  ).length

  const processingOrders = orders.filter(
    order => order.status === 'processing'
  ).length

  const shippedOrders = orders.filter(
    order => order.status === 'shipped'
  ).length

  const recentProducts = [...products]
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt) -
        new Date(a.updatedAt || a.createdAt)
    )
    .slice(0, 5)

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .slice(0, 5)

  const formatDate = date => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
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

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-emerald-700">
              Seller Center
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              {seller?.storeName || 'Seller Dashboard'}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage your products, inventory and customer orders from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/seller/products/new"
              className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-800"
            >
              <Icon name="plus" size={18} />
              Add Product
            </Link>

            <Link
              to="/seller/orders"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <Icon name="box" size={18} />
              Manage Orders
            </Link>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Total Products
                </p>

                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {totalProducts}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Icon name="box" size={21} />
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Products in your store
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Active Products
                </p>

                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {activeProducts}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Icon name="check" size={21} />
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Currently available
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Total Stock
                </p>

                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {totalStock}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <Icon name="layers" size={21} />
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Units currently available
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Orders
                </p>

                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {orders.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <Icon name="box" size={21} />
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Orders containing your products
            </p>
          </div>
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_340px]">

          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Order Overview
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Current order status
                </p>
              </div>

              <Link
                to="/seller/orders"
                className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
              >
                View all
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-amber-50 p-5">
                <p className="text-sm text-amber-700">
                  Pending
                </p>

                <p className="mt-2 text-2xl font-semibold text-amber-800">
                  {pendingOrders}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-5">
                <p className="text-sm text-blue-700">
                  Processing
                </p>

                <p className="mt-2 text-2xl font-semibold text-blue-800">
                  {processingOrders}
                </p>
              </div>

              <div className="rounded-xl bg-violet-50 p-5">
                <p className="text-sm text-violet-700">
                  Shipped
                </p>

                <p className="mt-2 text-2xl font-semibold text-violet-800">
                  {shippedOrders}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Store Status
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Seller account
                </p>
              </div>

              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium capitalize text-emerald-700">
                {seller?.status}
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Store
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {seller?.storeName}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Phone
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {seller?.phone}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Location
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {seller?.address?.city}
                  {seller?.address?.country
                    ? `, ${seller.address.country}`
                    : ''}
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          <section className="rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Recent Orders
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Latest orders for your store
                </p>
              </div>

              <Link
                to="/seller/orders"
                className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
              >
                View all
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <Icon name="box" size={22} />
                </div>

                <p className="mt-4 text-sm font-medium text-slate-700">
                  No orders yet
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Orders will appear here once customers purchase your products.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentOrders.map(order => (
                  <Link
                    key={order.orderId}
                    to={`/seller/orders/${order.orderId}`}
                    className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-slate-50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {order.orderNumber}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {order.buyer?.name || 'Customer'} ·{' '}
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                          statusStyles[order.status] ||
                          'border-slate-200 bg-slate-50 text-slate-600'
                        }`}
                      >
                        {statusLabels[order.status] ||
                          order.status}
                      </span>

                      <Icon
                        name="arrowRight"
                        size={16}
                        className="text-slate-400"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Recent Products
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Recently updated products
                </p>
              </div>

              <Link
                to="/seller/products"
                className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
              >
                View all
              </Link>
            </div>

            {recentProducts.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <Icon name="box" size={22} />
                </div>

                <p className="mt-4 text-sm font-medium text-slate-700">
                  No products yet
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Start by adding your first product.
                </p>

                <Link
                  to="/seller/products/new"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-800"
                >
                  <Icon name="plus" size={15} />
                  Add Product
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentProducts.map(product => (
                  <Link
                    key={product._id}
                    to={`/seller/products/${product._id}/edit`}
                    className="flex items-center gap-4 px-6 py-4 transition hover:bg-slate-50"
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                          <Icon name="box" size={18} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {product.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Stock: {product.stock}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">
                        ${Number(product.price || 0).toFixed(2)}
                      </p>

                      <p className="mt-1 text-xs capitalize text-slate-400">
                        {product.status}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Icon
                  name="warning"
                  size={19}
                  className="text-amber-600"
                />

                <h2 className="font-semibold text-slate-900">
                  Inventory Alerts
                </h2>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Products that need your attention
              </p>
            </div>

            <Link
              to="/seller/products"
              className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              Manage Inventory
            </Link>
          </div>

          {lowStockProducts.length === 0 &&
          outOfStockProducts.length === 0 ? (
            <div className="mt-5 rounded-xl bg-emerald-50 px-4 py-4">
              <div className="flex items-center gap-3">
                <Icon
                  name="check"
                  size={18}
                  className="text-emerald-700"
                />

                <p className="text-sm font-medium text-emerald-700">
                  All products have healthy inventory levels.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {outOfStockProducts.map(product => (
                <Link
                  key={product._id}
                  to={`/seller/products/${product._id}/edit`}
                  className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 transition hover:bg-red-100"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-red-800">
                      {product.name}
                    </p>

                    <p className="mt-1 text-xs text-red-600">
                      Out of stock
                    </p>
                  </div>

                  <span className="ml-4 shrink-0 text-xs font-semibold text-red-700">
                    0 units
                  </span>
                </Link>
              ))}

              {lowStockProducts.map(product => (
                <Link
                  key={product._id}
                  to={`/seller/products/${product._id}/edit`}
                  className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 transition hover:bg-amber-100"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-amber-800">
                      {product.name}
                    </p>

                    <p className="mt-1 text-xs text-amber-600">
                      Low stock
                    </p>
                  </div>

                  <span className="ml-4 shrink-0 text-xs font-semibold text-amber-700">
                    {product.stock} units
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default SellerDashboard