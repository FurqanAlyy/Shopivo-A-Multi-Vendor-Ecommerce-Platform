import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import { getMyOrder } from '../services/orderService'

const statusStyles = {
  pending: 'bg-amber-50 text-amber-700',
  confirmed: 'bg-blue-50 text-blue-700',
  processing: 'bg-purple-50 text-purple-700',
  shipped: 'bg-indigo-50 text-indigo-700',
  delivered: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-red-50 text-red-700'
}

const OrderDetails = () => {
  const { id } = useParams()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await getMyOrder(id)
        setOrder(response.order)
      } catch (error) {
        setError(
          error.response?.data?.message ||
          'Failed to load order'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8faf9]">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-8 h-40 animate-pulse rounded-3xl bg-white" />
          <div className="mt-6 h-72 animate-pulse rounded-3xl bg-white" />
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8faf9] px-6">
        <div className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
            <Icon name="close" size={28} />
          </div>

          <h1 className="mt-6 text-2xl font-semibold text-slate-900">
            Order Not Found
          </h1>

          <p className="mt-2 text-slate-500">
            {error || 'We could not find this order.'}
          </p>

          <Link
            to="/products"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 font-medium text-white transition hover:bg-emerald-800"
          >
            Continue Shopping
            <Icon name="arrowRight" size={18} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8 lg:py-14">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-700"
        >
          <Icon name="arrowLeft" size={17} />
          My Orders
        </Link>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Order Number
              </p>

              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                {order.orderNumber}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Placed on{' '}
                {new Date(
                  order.createdAt
                ).toLocaleDateString()}
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-4 py-2 text-sm font-medium capitalize ${
                statusStyles[order.status] ||
                'bg-slate-100 text-slate-700'
              }`}
            >
              {order.status}
            </span>
          </div>

          <div className="mt-8 grid gap-4 border-t border-slate-200 pt-7 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Payment
              </p>

              <p className="mt-1 font-medium capitalize text-slate-900">
                {order.paymentMethod === 'cod'
                  ? 'Cash on Delivery'
                  : 'Stripe'}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Payment Status
              </p>

              <p className="mt-1 font-medium capitalize text-slate-900">
                {order.paymentStatus}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Total
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                Rs. {order.total.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_330px]">
          <div className="space-y-6">
            {order.sellerOrders.map(sellerOrder => (
              <section
                key={sellerOrder._id}
                className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-7"
              >
                <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400">
                      Seller
                    </p>

                    <h2 className="mt-1 font-semibold text-slate-900">
                      {sellerOrder.seller?.storeName ||
                        'Seller'}
                    </h2>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1.5 text-xs font-medium capitalize ${
                      statusStyles[
                        sellerOrder.status
                      ] ||
                      'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {sellerOrder.status}
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {sellerOrder.items.map(item => (
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
                          <div className="flex h-full items-center justify-center text-slate-400">
                            <Icon
                              name="cart"
                              size={22}
                            />
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
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold text-slate-900">
                        Rs.{' '}
                        {item.totalPrice.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 pt-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">
                      Seller subtotal
                    </span>

                    <span className="font-semibold text-slate-900">
                      Rs.{' '}
                      {sellerOrder.subtotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </section>
            ))}
          </div>

          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                Delivery Address
              </h2>

              <div className="mt-5 space-y-2 text-sm">
                <p className="font-medium text-slate-900">
                  {order.shippingAddress.fullName}
                </p>

                <p className="text-slate-500">
                  {order.shippingAddress.phone}
                </p>

                <p className="leading-6 text-slate-500">
                  {order.shippingAddress.address}
                  <br />
                  {order.shippingAddress.city},{' '}
                  {order.shippingAddress.postalCode}
                  <br />
                  {order.shippingAddress.country}
                </p>
              </div>

              <div className="my-6 border-t border-slate-200" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Subtotal
                  </span>

                  <span className="font-medium text-slate-900">
                    Rs.{' '}
                    {order.subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Shipping
                  </span>

                  <span className="font-medium text-emerald-700">
                    Free
                  </span>
                </div>
              </div>

              <div className="my-6 border-t border-slate-200" />

              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700">
                  Total
                </span>

                <span className="text-xl font-semibold text-slate-900">
                  Rs. {order.total.toLocaleString()}
                </span>
              </div>

              <Link
                to="/products"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-medium text-white transition hover:bg-emerald-800"
              >
                Continue Shopping
                <Icon name="arrowRight" size={18} />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails