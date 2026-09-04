import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import { useAuth } from '../context/AuthContext'
import { getCart } from '../services/cartService'
import { checkoutOrder } from '../services/orderService'
import { createCheckoutSession } from '../services/paymentService'

const Checkout = () => {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [placingOrder, setPlacingOrder] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Pakistan'
  })

  const [paymentMethod, setPaymentMethod] = useState('cod')

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', {
        replace: true,
        state: {
          from: '/checkout'
        }
      })
    }
  }, [authLoading, user, navigate])

  useEffect(() => {
    if (user?.name) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.name
      }))
    }
  }, [user])

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return

      try {
        setLoading(true)
        setError('')

        const response = await getCart()
        setCart(response.cart)
      } catch (error) {
        setError(
          error.response?.data?.message ||
          'Failed to load cart'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [user])

  const items = cart?.items || []

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => {
      if (!item.product) return total

      const product = item.product

      const discountedPrice =
        product.price -
        product.price * ((product.discount || 0) / 100)

      return total + discountedPrice * item.quantity
    }, 0)
  }, [items])

  const shippingFee = 0
  const total = subtotal + shippingFee

  const handleChange = event => {
    const { name, value } = event.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async event => {
    event.preventDefault()

    if (!items.length) {
      setError('Your cart is empty')
      return
    }

    try {
      setPlacingOrder(true)
      setError('')

      const response = await checkoutOrder({
        shippingAddress: formData,
        paymentMethod
      })

      const order = response.order

      if (paymentMethod === 'stripe') {
        const paymentResponse =
          await createCheckoutSession(order._id)

        if (!paymentResponse.checkoutUrl) {
          throw new Error(
            'Unable to create Stripe checkout session'
          )
        }

        window.location.href =
          paymentResponse.checkoutUrl

        return
      }

      navigate(`/orders/${order._id}`, {
        replace: true,
        state: {
          orderCreated: true
        }
      })
    } catch (error) {
      setError(
        error.response?.data?.message ||
        error.message ||
        'Failed to place order'
      )
      setPlacingOrder(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#f8faf9]">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="h-10 w-48 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="h-[500px] animate-pulse rounded-3xl bg-white" />
            <div className="h-[400px] animate-pulse rounded-3xl bg-white" />
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!items.length && !error) {
    return (
      <div className="min-h-screen bg-[#f8faf9]">
        <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6">
          <div className="w-full rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <Icon name="cart" size={28} />
            </div>

            <h1 className="mt-6 text-2xl font-semibold text-slate-900">
              Your cart is empty
            </h1>

            <p className="mt-2 text-slate-500">
              Add some products before proceeding to checkout.
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
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
        <div className="mb-10">
          <Link
            to="/cart"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-700"
          >
            <Icon name="arrowLeft" size={17} />
            Back to Cart
          </Link>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-2 text-slate-500">
            Complete your details and place your order.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[1fr_390px]"
        >
          <div className="space-y-8">
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
              <div className="mb-7">
                <p className="text-sm font-medium uppercase tracking-wider text-emerald-700">
                  Step 01
                </p>

                <h2 className="mt-1 text-xl font-semibold text-slate-900">
                  Shipping Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Where should we deliver your order?
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Full Name
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    minLength={2}
                    maxLength={100}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                    placeholder="+92 300 1234567"
                  />
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    City
                  </label>

                  <input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                    placeholder="Lahore"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Complete Address
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    minLength={5}
                    maxLength={300}
                    rows={4}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                    placeholder="House number, street, area..."
                  />
                </div>

                <div>
                  <label
                    htmlFor="postalCode"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Postal Code
                  </label>

                  <input
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                    placeholder="54000"
                  />
                </div>

                <div>
                  <label
                    htmlFor="country"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Country
                  </label>

                  <input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
              <div className="mb-7">
                <p className="text-sm font-medium uppercase tracking-wider text-emerald-700">
                  Step 02
                </p>

                <h2 className="mt-1 text-xl font-semibold text-slate-900">
                  Payment Method
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Choose how you want to pay.
                </p>
              </div>

              <div className="space-y-4">
                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-5 transition ${
                    paymentMethod === 'cod'
                      ? 'border-emerald-600 bg-emerald-50/60'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={event =>
                      setPaymentMethod(event.target.value)
                    }
                    className="h-4 w-4 accent-emerald-700"
                  />

                  <div className="flex-1">
                    <p className="font-medium text-slate-900">
                      Cash on Delivery
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Pay when your order arrives.
                    </p>
                  </div>

                  <span className="rounded-lg bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                    COD
                  </span>
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-5 transition ${
                    paymentMethod === 'stripe'
                      ? 'border-emerald-600 bg-emerald-50/60'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    checked={paymentMethod === 'stripe'}
                    onChange={event =>
                      setPaymentMethod(event.target.value)
                    }
                    className="h-4 w-4 accent-emerald-700"
                  />

                  <div className="flex-1">
                    <p className="font-medium text-slate-900">
                      Card Payment
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Secure checkout powered by Stripe.
                    </p>
                  </div>

                  <span className="rounded-lg bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                    Stripe
                  </span>
                </label>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-7">
              <h2 className="text-xl font-semibold text-slate-900">
                Order Summary
              </h2>

              <div className="mt-6 max-h-80 space-y-4 overflow-y-auto pr-1">
                {items.map(item => {
                  if (!item.product) return null

                  const product = item.product

                  const price =
                    product.price -
                    product.price *
                      ((product.discount || 0) / 100)

                  return (
                    <div
                      key={item._id}
                      className="flex gap-3"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                        <img
                          src={product.images?.[0]}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-medium text-slate-900">
                          {product.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Qty: {item.quantity}
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          Rs.{' '}
                          {(price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="my-6 border-t border-slate-200" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900">
                    Rs. {subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>Shipping</span>
                  <span className="font-medium text-emerald-700">
                    Free
                  </span>
                </div>
              </div>

              <div className="my-6 border-t border-slate-200" />

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Total
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">
                    Rs. {total.toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={placingOrder}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3.5 font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {placingOrder ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {paymentMethod === 'stripe'
                      ? 'Redirecting...'
                      : 'Placing Order...'}
                  </>
                ) : (
                  <>
                    {paymentMethod === 'cod'
                      ? 'Place Order'
                      : 'Continue to Payment'}
                    <Icon name="arrowRight" size={18} />
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                By placing your order, you agree to the order
                details and delivery information provided above.
              </p>
            </div>
          </aside>
        </form>
      </div>
    </div>
  )
}

export default Checkout