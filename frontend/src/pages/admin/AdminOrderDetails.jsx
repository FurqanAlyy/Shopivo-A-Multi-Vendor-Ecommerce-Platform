import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  getAdminOrder,
  updateAdminOrderStatus
} from '../../services/adminService'
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

const AdminOrderDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await getAdminOrder(id)

        setOrder(response.order)
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Failed to load order'
        )
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [id])

  const handleStatusUpdate = async status => {
    try {
      setUpdating(true)
      setError('')
      setSuccess('')

      const response = await updateAdminOrderStatus(id, status)

      setOrder(response.order)
      setSuccess(
        response.message ||
        'Order status updated successfully'
      )
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to update order status'
      )
    } finally {
      setUpdating(false)
    }
  }

  const formatDate = date => {
    if (!date) return 'N/A'

    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatDateTime = date => {
    if (!date) return 'N/A'

    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const formatPrice = value => {
    return `$${Number(value || 0).toLocaleString()}`
  }

  const getItemCount = () => {
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8faf9]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-700" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f8faf9] px-6 py-12">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            Order not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            This order could not be found.
          </p>

          <button
            onClick={() => navigate('/admin/orders')}
            className="mt-6 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-800"
          >
            Back to Orders
          </button>
        </div>
      </div>
    )
  }

  const statuses = [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled'
  ]

  return (
    <div className="min-h-screen bg-[#f8faf9] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/orders')}
            className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-700"
          >
            <Icon name="arrowLeft" size={17} />
            Back to Orders
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700">
                Administration
              </p>

              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
                Order Details
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {order.orderNumber}
              </p>
            </div>

            <span
              className={`inline-flex w-fit rounded-full border px-4 py-2 text-sm font-medium ${
                statusStyles[order.status] ||
                'border-slate-200 bg-slate-50 text-slate-600'
              }`}
            >
              {statusLabels[order.status] || order.status}
            </span>
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

        {success && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Order Items
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Products included in this order
                  </p>
                </div>

                <span className="text-sm text-slate-400">
                  {getItemCount()}{' '}
                  {getItemCount() === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div className="space-y-6">
                {(order.sellerOrders || []).map(
                  sellerOrder => (
                    <div
                      key={sellerOrder._id}
                      className="rounded-xl border border-slate-200"
                    >
                      <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            Seller Order
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {sellerOrder.items?.length || 0}{' '}
                            {(sellerOrder.items?.length || 0) === 1
                              ? 'product'
                              : 'products'}
                          </p>
                        </div>

                        <span
                          className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-xs font-medium ${
                            statusStyles[sellerOrder.status] ||
                            'border-slate-200 bg-white text-slate-600'
                          }`}
                        >
                          {statusLabels[sellerOrder.status] ||
                            sellerOrder.status}
                        </span>
                      </div>

                      <div className="divide-y divide-slate-100 px-5">
                        {(sellerOrder.items || []).map(item => (
                          <div
                            key={item._id}
                            className="flex gap-4 py-5"
                          >
                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-slate-400">
                                  <Icon name="box" size={24} />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium text-slate-900">
                                {item.name}
                              </h3>

                              <p className="mt-1 text-sm text-slate-500">
                                SKU: {item.sku}
                              </p>

                              <p className="mt-1 text-sm text-slate-500">
                                Quantity: {item.quantity}
                              </p>

                              <p className="mt-1 text-sm text-slate-500">
                                Unit price:{' '}
                                {formatPrice(item.unitPrice)}
                              </p>

                              {item.discount > 0 && (
                                <p className="mt-1 text-xs text-emerald-600">
                                  {item.discount}% discount
                                </p>
                              )}
                            </div>

                            <div className="text-right">
                              <p className="font-semibold text-slate-900">
                                {formatPrice(item.totalPrice)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-slate-100 px-5 py-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">
                            Seller subtotal
                          </span>

                          <span className="font-medium text-slate-800">
                            {formatPrice(sellerOrder.subtotal)}
                          </span>
                        </div>

                        <div className="mt-2 flex justify-between text-sm">
                          <span className="text-slate-500">
                            Shipping
                          </span>

                          <span className="font-medium text-slate-800">
                            {formatPrice(sellerOrder.shippingFee)}
                          </span>
                        </div>

                        <div className="mt-3 flex justify-between border-t border-slate-100 pt-3">
                          <span className="font-semibold text-slate-900">
                            Seller total
                          </span>

                          <span className="font-semibold text-slate-900">
                            {formatPrice(sellerOrder.total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-slate-900">
                Customer
              </h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Name
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {order.buyer?.name || 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm font-medium text-slate-800">
                    {order.buyer?.email || 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Order Date
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Payment Method
                  </p>

                  <p className="mt-1 text-sm font-medium uppercase text-slate-800">
                    {order.paymentMethod}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-slate-900">
                Shipping Address
              </h2>

              <div className="mt-5 rounded-xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-900">
                  {order.shippingAddress?.fullName}
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {order.shippingAddress?.address}
                  <br />
                  {order.shippingAddress?.city}
                  {order.shippingAddress?.postalCode
                    ? `, ${order.shippingAddress.postalCode}`
                    : ''}
                  <br />
                  {order.shippingAddress?.country}
                </p>

                <p className="mt-3 text-sm text-slate-600">
                  Phone: {order.shippingAddress?.phone}
                </p>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Update Order Status
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Admin can directly update the parent order status.
              </p>

              <div className="mt-5">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Status
                </label>

                <select
                  value={order.status}
                  disabled={updating}
                  onChange={event =>
                    handleStatusUpdate(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {statusLabels[status]}
                    </option>
                  ))}
                </select>

                {updating && (
                  <p className="mt-2 text-xs text-slate-400">
                    Updating order status...
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Payment
              </h2>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">
                    Method
                  </span>

                  <span className="text-sm font-medium uppercase text-slate-800">
                    {order.paymentMethod}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">
                    Payment Status
                  </span>

                  <span className="text-sm font-medium capitalize text-slate-800">
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Order Summary
              </h2>

              <div className="mt-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    Subtotal
                  </span>

                  <span className="font-medium text-slate-800">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    Shipping
                  </span>

                  <span className="font-medium text-slate-800">
                    {formatPrice(order.shippingFee)}
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-900">
                      Total
                    </span>

                    <span className="font-semibold text-slate-900">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Created
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {formatDateTime(order.createdAt)}
              </p>

              {order.paidAt && (
                <div className="mt-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Paid
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {formatDateTime(order.paidAt)}
                  </p>
                </div>
              )}

              {order.deliveredAt && (
                <div className="mt-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Delivered
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {formatDateTime(order.deliveredAt)}
                  </p>
                </div>
              )}

              {order.cancelledAt && (
                <div className="mt-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Cancelled
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {formatDateTime(order.cancelledAt)}
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminOrderDetails