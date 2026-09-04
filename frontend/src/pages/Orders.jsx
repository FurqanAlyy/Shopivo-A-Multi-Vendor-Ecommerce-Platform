import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import { getMyOrders } from '../services/orderService'

const statusStyles = {
  pending: 'bg-amber-50 text-amber-700',
  confirmed: 'bg-blue-50 text-blue-700',
  processing: 'bg-purple-50 text-purple-700',
  shipped: 'bg-indigo-50 text-indigo-700',
  delivered: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-red-50 text-red-700'
}

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const response = await getMyOrders()
        setOrders(response.orders || [])
      } catch (error) {
        setError(
          error.response?.data?.message ||
          'Failed to load orders'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8faf9]">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <div className="h-9 w-48 animate-pulse rounded-lg bg-slate-200" />

          <div className="mt-8 space-y-4">
            {[1, 2, 3].map(item => (
              <div
                key={item}
                className="h-36 animate-pulse rounded-3xl bg-white"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8faf9] px-6">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8 lg:py-14">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-emerald-700">
            Account
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            My Orders
          </h1>

          <p className="mt-2 text-slate-500">
            Track and view your previous orders.
          </p>
        </div>

        {!orders.length ? (
          <div className="mt-10 rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <Icon name="cart" size={28} />
            </div>

            <h2 className="mt-6 text-xl font-semibold text-slate-900">
              No orders yet
            </h2>

            <p className="mt-2 text-slate-500">
              Your completed orders will appear here.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 font-medium text-white transition hover:bg-emerald-800"
            >
              Start Shopping
              <Icon name="arrowRight" size={18} />
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map(order => {
              const itemCount =
                order.sellerOrders?.reduce(
                  (total, sellerOrder) =>
                    total +
                    sellerOrder.items.reduce(
                      (count, item) =>
                        count + item.quantity,
                      0
                    ),
                  0
                ) || 0

              return (
                <Link
                  key={order._id}
                  to={`/orders/${order._id}`}
                  className="block rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400">
                        Order
                      </p>

                      <h2 className="mt-1 font-semibold text-slate-900">
                        {order.orderNumber}
                      </h2>

                      <p className="mt-2 text-sm text-slate-500">
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString()}{' '}
                        · {itemCount}{' '}
                        {itemCount === 1
                          ? 'item'
                          : 'items'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-6 sm:justify-end">
                      <div className="text-left sm:text-right">
                        <p className="text-xs uppercase tracking-wider text-slate-400">
                          Total
                        </p>

                        <p className="mt-1 font-semibold text-slate-900">
                          Rs.{' '}
                          {order.total.toLocaleString()}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize ${
                          statusStyles[order.status] ||
                          'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {order.status}
                      </span>

                      <Icon
                        name="arrowRight"
                        size={18}
                        className="text-slate-400"
                      />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders