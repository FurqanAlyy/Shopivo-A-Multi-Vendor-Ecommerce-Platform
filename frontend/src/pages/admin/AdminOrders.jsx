import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdminOrders } from '../../services/adminService'
import Icon from '../../components/ui/Icon'

const statusStyles = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  processing: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  shipped: 'bg-violet-50 text-violet-700 border-violet-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200'
}

const statusLabels = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
}

const AdminOrders = () => {
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await getAdminOrders()

        setOrders(response.orders || [])
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Failed to load orders'
        )
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  const getItemCount = order => {
    return (order.sellerOrders || []).reduce(
      (total, sellerOrder) =>
        total +
        (sellerOrder.items || []).reduce(
          (sellerTotal, item) =>
            sellerTotal + Number(item.quantity || 0),
          0
        ),
      0
    )
  }

  const formatDate = date => {
    if (!date) return 'N/A'

    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatPrice = price => {
    return `Rs. ${Number(price || 0).toLocaleString()}`
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
                Manage Orders
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Monitor and manage all marketplace orders.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Total Orders
              </p>

              <p className="mt-1 text-xl font-semibold text-slate-900">
                {orders.length}
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

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
              <Icon name="box" size={26} />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              No orders found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              There are currently no orders on the platform.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Order
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Items
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Payment
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Total
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
                  {orders.map(order => (
                    <tr
                      key={order._id}
                      className="transition hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-5">
                        <p className="font-medium text-slate-900">
                          {order.orderNumber}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-medium text-slate-800">
                          {order.buyer?.name || 'N/A'}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {order.buyer?.email || 'N/A'}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm font-medium text-slate-700">
                          {getItemCount(order)}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {(order.sellerOrders || []).length}{' '}
                          {(order.sellerOrders || []).length === 1
                            ? 'seller'
                            : 'sellers'}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm font-medium uppercase text-slate-700">
                          {order.paymentMethod}
                        </p>

                        <p className="mt-1 text-xs capitalize text-slate-400">
                          {order.paymentStatus}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-semibold text-slate-900">
                          {formatPrice(order.total)}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${
                            statusStyles[order.status] ||
                            'border-slate-200 bg-slate-50 text-slate-600'
                          }`}
                        >
                          {statusLabels[order.status] ||
                            order.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/admin/orders/${order._id}`)
                          }
                          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          View
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

export default AdminOrders