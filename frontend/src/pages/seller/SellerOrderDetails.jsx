import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  getSellerOrder,
  updateSellerOrderStatus
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

const nextStatuses = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: []
}

const SellerOrderDetails = () => {
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

        const response = await getSellerOrder(id)

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

      const response = await updateSellerOrderStatus(id, status)

      setSuccess(response.message || 'Order status updated')

      const refreshedOrder = await getSellerOrder(id)

      setOrder(refreshedOrder.order)
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
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatDateTime = date => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
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
            This order could not be found or does not belong to your store.
          </p>

          <button
            onClick={() => navigate('/seller/orders')}
            className="mt-6 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-800"
          >
            Back to Orders
          </button>
        </div>
      </div>
    )
  }

  const availableStatuses =
    nextStatuses[order.status] || []

  return (
    <div className="min-h-screen bg-[#f8faf9] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <button
            onClick={() => navigate('/seller/orders')}
            className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-700"
          >
            <Icon name="arrowLeft" size={17} />
            Back to Orders
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
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
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
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
                  {order.items?.length || 0}{' '}
                  {order.items?.length === 1
                    ? 'item'
                    : 'items'}
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {order.items?.map(item => (
                  <div
                    key={item._id}
                    className="flex gap-4 py-5 first:pt-0 last:pb-0"
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
                        Unit price: $
                        {Number(item.unitPrice || 0).toFixed(2)}
                      </p>

                      {item.discount > 0 && (
                        <p className="mt-1 text-xs text-emerald-600">
                          {item.discount}% discount
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        $
                        {Number(
                          item.totalPrice || 0
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
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
                    Phone
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {order.shippingAddress?.phone || 'N/A'}
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
                Update Status
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Move this order to the next available stage.
              </p>

              {availableStatuses.length > 0 ? (
                <div className="mt-5 space-y-3">
                  {availableStatuses.map(status => (
                    <button
                      key={status}
                      type="button"
                      disabled={updating}
                      onClick={() => handleStatusUpdate(status)}
                      className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                        status === 'cancelled'
                          ? 'border-red-200 text-red-700 hover:bg-red-50'
                          : 'border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      {updating
                        ? 'Updating...'
                        : `Mark as ${statusLabels[status]}`}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-xl bg-slate-50 px-4 py-4">
                  <p className="text-sm text-slate-500">
                    No further status changes are available for this order.
                  </p>
                </div>
              )}
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
                    ${Number(order.subtotal || 0).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    Shipping
                  </span>

                  <span className="font-medium text-slate-800">
                    ${Number(order.shippingFee || 0).toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-900">
                      Total
                    </span>

                    <span className="font-semibold text-slate-900">
                      ${Number(order.total || 0).toFixed(2)}
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

export default SellerOrderDetails