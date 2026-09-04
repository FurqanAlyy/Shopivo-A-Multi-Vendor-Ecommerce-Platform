import { Link } from 'react-router-dom'
import Icon from '../../components/ui/Icon'

const PaymentCancel = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8faf9] px-6">
      <div className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-600">
          <Icon name="close" size={34} />
        </div>

        <p className="mt-7 text-sm font-medium uppercase tracking-wider text-amber-600">
          Payment Cancelled
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Payment was cancelled
        </h1>

        <p className="mt-3 leading-6 text-slate-500">
          Your Stripe payment was cancelled. You can return to
          your orders or continue shopping.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/orders"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 font-medium text-white transition hover:bg-emerald-800"
          >
            My Orders
            <Icon name="arrowRight" size={18} />
          </Link>

          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PaymentCancel