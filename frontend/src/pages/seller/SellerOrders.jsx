import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSellerOrders } from '../../services/orderService'
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

const SellerOrders = () => {
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await getSellerOrders()

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
        <div className="mb-8">
          <button
            onClick={() => navigate('/seller/dashboard')}
            className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-700"
          >
            <Icon name="arrowLeft" size={17} />
            Back to Dashboard
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                Orders
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage orders placed for your products
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
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Icon name="box" size={26} />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              No orders yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Orders containing your products will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="hidden border-b border-slate-200 px-6 py-4 lg:grid lg:grid-cols-[1.2fr_1.2fr_1fr_1fr_1fr_auto] lg:items-center lg:gap-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Order
              </p>

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Customer
              </p>

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Date
              </p>

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Total
              </p>

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Status
              </p>

              <span />
            </div>

            <div className="divide-y divide-slate-100">
              {orders.map(order => (
                <button
                  key={order.orderId}
                  type="button"
                  onClick={() =>
                    navigate(`/seller/orders/${order.orderId}`)
                  }
                  className="w-full text-left transition hover:bg-slate-50"
                >
                  <div className="grid gap-4 px-6 py-5 lg:grid-cols-[1.2fr_1.2fr_1fr_1fr_1fr_auto] lg:items-center lg:gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {order.orderNumber}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {order.items?.length || 0}{' '}
                        {order.items?.length === 1
                          ? 'item'
                          : 'items'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {order.buyer?.name || 'Customer'}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {order.buyer?.email || ''}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-600">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        ${Number(order.total || 0).toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                          statusStyles[order.status] ||
                          'border-slate-200 bg-slate-50 text-slate-600'
                        }`}
                      >
                        {statusLabels[order.status] ||
                          order.status}
                      </span>
                    </div>

                    <div className="hidden text-slate-400 lg:block">
                      <Icon name="arrowRight" size={18} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SellerOrders