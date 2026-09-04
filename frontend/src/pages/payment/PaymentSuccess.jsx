import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Icon from '../../components/ui/Icon'
import { getMyOrders } from '../../services/orderService'

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

 useEffect(() => {
  let cancelled = false
  let attempts = 0

  const findOrder = async () => {
    try {
      const response = await getMyOrders()

      const matchingOrder = response.orders?.find(
        item =>
          item.stripeSessionId === sessionId
      )

      if (matchingOrder) {
        if (!cancelled) {
          setOrder(matchingOrder)
        }

        return
      }

      attempts += 1

      if (attempts < 6 && !cancelled) {
        setTimeout(findOrder, 2000)
        return
      }

      if (!cancelled) {
        setError(
          'Payment was received, but the order is still being processed.'
        )
      }
    } catch (error) {
      if (!cancelled) {
        setError(
          error.response?.data?.message ||
          'Unable to verify your order'
        )
      }
    } finally {
      if (!cancelled) {
        setLoading(false)
      }
    }
  }

  if (sessionId) {
    findOrder()
  } else {
    setError('Stripe session ID is missing')
    setLoading(false)
  }

  return () => {
    cancelled = true
  }
}, [sessionId])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8faf9] px-6">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-700" />

          <h1 className="mt-6 text-xl font-semibold text-slate-900">
            Confirming your payment...
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Please wait while we confirm your order.
          </p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8faf9] px-6">
        <div className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <Icon name="arrowRight" size={28} />
          </div>

          <h1 className="mt-6 text-2xl font-semibold text-slate-900">
            Payment Processing
          </h1>

          <p className="mt-3 leading-6 text-slate-500">
            {error}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/orders"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 font-medium text-white transition hover:bg-emerald-800"
            >
              View My Orders
              <Icon name="arrowRight" size={18} />
            </Link>

            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8faf9] px-6">
      <div className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m5 12 4 4L19 6" />
          </svg>
        </div>

        <p className="mt-7 text-sm font-medium uppercase tracking-wider text-emerald-700">
          Payment Successful
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Thank you for your order!
        </h1>

        <p className="mt-3 text-slate-500">
          Your payment has been received and your order has
          been confirmed.
        </p>

        <div className="mt-7 rounded-2xl bg-slate-50 p-5 text-left">
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">
              Order Number
            </span>

            <span className="text-sm font-semibold text-slate-900">
              {order.orderNumber}
            </span>
          </div>

          <div className="mt-3 flex justify-between">
            <span className="text-sm text-slate-500">
              Total
            </span>

            <span className="text-sm font-semibold text-slate-900">
              Rs. {order.total.toLocaleString()}
            </span>
          </div>
        </div>

        <Link
          to={`/orders/${order._id}`}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3.5 font-medium text-white transition hover:bg-emerald-800"
        >
          View Order
          <Icon name="arrowRight" size={18} />
        </Link>
      </div>
    </div>
  )
}

export default PaymentSuccess