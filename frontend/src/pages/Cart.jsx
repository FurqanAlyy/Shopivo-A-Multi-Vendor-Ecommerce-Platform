import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/home/Navbar'
import Footer from '../components/home/Footer'
import Icon from '../components/ui/Icon'
import {
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from '../services/cartService'

const Cart = () => {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updatingItem, setUpdatingItem] = useState(null)
  const [removingItem, setRemovingItem] = useState(null)
  const [clearingCart, setClearingCart] = useState(false)
  const [error, setError] = useState('')

  const fetchCart = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await getCart()
      setCart(response.cart)
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Failed to load your cart'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

const updateQuantity = async (itemId, quantity) => {
  if (quantity < 1) return

  try {
    setUpdatingItem(itemId)
    setError('')

    await updateCartItem(itemId, quantity)

    const response = await getCart()
    setCart(response.cart)
  } catch (error) {
    setError(
      error.response?.data?.message ||
      'Failed to update cart item'
    )
  } finally {
    setUpdatingItem(null)
  }
}

const handleRemove = async (itemId) => {
  try {
    setRemovingItem(itemId)
    setError('')

    await removeCartItem(itemId)

    const response = await getCart()
    setCart(response.cart)
  } catch (error) {
    setError(
      error.response?.data?.message ||
      'Failed to remove product'
    )
  } finally {
    setRemovingItem(null)
  }
}

const handleClearCart = async () => {
  try {
    setClearingCart(true)
    setError('')

    await clearCart()

    const response = await getCart()
    setCart(response.cart)
  } catch (error) {
    setError(
      error.response?.data?.message ||
      'Failed to clear cart'
    )
  } finally {
    setClearingCart(false)
  }
}

  const subtotal = useMemo(() => {
    if (!cart?.items) return 0

    return cart.items.reduce((total, item) => {
      if (!item.product) return total

      const price =
        item.product.discount > 0
          ? item.product.price -
            (item.product.price * item.product.discount) / 100
          : item.product.price

      return total + price * item.quantity
    }, 0)
  }, [cart])

  const totalItems = useMemo(() => {
    if (!cart?.items) return 0

    return cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    )
  }, [cart])

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-[#f8faf9]">
          <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
            <div className="h-10 w-32 animate-pulse rounded bg-slate-200" />

            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <div className="h-28 w-28 animate-pulse rounded-xl bg-slate-200" />

                    <div className="flex-1 space-y-3">
                      <div className="h-5 w-1/2 animate-pulse rounded bg-slate-200" />
                      <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
                      <div className="h-5 w-24 animate-pulse rounded bg-slate-200" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
            </div>
          </div>
        </main>

        <Footer />
      </>
    )
  }

  if (error && !cart) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center bg-[#f8faf9] px-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-slate-900">
              Unable to load cart
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {error}
            </p>

            <button
              onClick={fetchCart}
              className="mt-6 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-800"
            >
              Try again
            </button>
          </div>
        </main>

        <Footer />
      </>
    )
  }

  const items = cart?.items || []

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f8faf9]">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-700">
                Your cart
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Shopping Cart
              </h1>
            </div>

            {items.length > 0 && (
              <button
                onClick={handleClearCart}
                disabled={clearingCart}
                className="text-sm font-medium text-red-500 hover:text-red-600 disabled:opacity-50"
              >
                {clearingCart ? 'Clearing...' : 'Clear cart'}
              </button>
            )}
          </div>

          {error && (
            <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {items.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <Icon
                  name="cart"
                  size={28}
                  className="text-slate-400"
                />
              </div>

              <h2 className="mt-5 text-xl font-semibold text-slate-900">
                Your cart is empty
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Looks like you haven't added anything yet.
              </p>

              <Link
                to="/products"
                className="mt-6 inline-flex rounded-xl bg-emerald-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-800"
              >
                Continue shopping
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
              <section className="space-y-4">
                {items.map((item) => {
                  if (!item.product) {
                    return null
                  }

                  const product = item.product

                  const price =
                    product.discount > 0
                      ? product.price -
                        (product.price * product.discount) / 100
                      : product.price

                  const itemTotal = price * item.quantity

                  const isUpdating = updatingItem === item._id
                  const isRemoving = removingItem === item._id

                  return (
                    <article
                      key={item._id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
                    >
                      <div className="flex gap-4 sm:gap-5">
                        <Link
                          to={`/products/${product._id}`}
                          className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-36 sm:w-36"
                        >
                          <img
                            src={product.images?.[0]}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </Link>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <Link
                                to={`/products/${product._id}`}
                                className="line-clamp-2 font-semibold text-slate-900 hover:text-emerald-700"
                              >
                                {product.name}
                              </Link>

                              {item.seller?.storeName && (
                                <p className="mt-1 text-sm text-slate-500">
                                  {item.seller.storeName}
                                </p>
                              )}
                            </div>

                            <button
                              onClick={() => handleRemove(item._id)}
                              disabled={isRemoving}
                              className="flex-shrink-0 text-slate-400 transition hover:text-red-500 disabled:opacity-40"
                              aria-label="Remove product"
                            >
                              <Icon name="close" size={19} />
                            </button>
                          </div>

                          <div className="mt-3 flex items-center gap-2">
                            <span className="font-semibold text-slate-900">
                              Rs. {price.toLocaleString()}
                            </span>

                            {product.discount > 0 && (
                              <span className="text-sm text-slate-400 line-through">
                                Rs. {product.price.toLocaleString()}
                              </span>
                            )}
                          </div>

                          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center rounded-xl border border-slate-200">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item._id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={
                                  item.quantity === 1 ||
                                  isUpdating ||
                                  isRemoving
                                }
                                className="flex h-9 w-9 items-center justify-center text-slate-600 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <Icon name="minus" size={15} />
                              </button>

                              <span className="w-10 text-center text-sm font-semibold text-slate-900">
                                {isUpdating ? '...' : item.quantity}
                              </span>

                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item._id,
                                    item.quantity + 1
                                  )
                                }
                                disabled={
                                  item.quantity >= product.stock ||
                                  isUpdating ||
                                  isRemoving
                                }
                                className="flex h-9 w-9 items-center justify-center text-slate-600 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <Icon name="plus" size={15} />
                              </button>
                            </div>

                            <p className="font-semibold text-slate-900">
                              Rs. {itemTotal.toLocaleString()}
                            </p>
                          </div>

                          {product.stock === 0 && (
                            <p className="mt-3 text-xs font-medium text-red-500">
                              This product is currently out of stock.
                            </p>
                          )}

                          {product.stock > 0 &&
                            item.quantity >= product.stock && (
                              <p className="mt-3 text-xs text-slate-500">
                                Maximum available quantity reached.
                              </p>
                            )}
                        </div>
                      </div>
                    </article>
                  )
                })}
              </section>

              <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 lg:sticky lg:top-24">
                <h2 className="text-lg font-semibold text-slate-900">
                  Order Summary
                </h2>

                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>
                      Subtotal ({totalItems}{' '}
                      {totalItems === 1 ? 'item' : 'items'})
                    </span>

                    <span className="font-medium text-slate-900">
                      Rs. {subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>Delivery</span>
                    <span className="font-medium text-slate-900">
                      Calculated at checkout
                    </span>
                  </div>

                  <div className="h-px bg-slate-200" />

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">
                      Total
                    </span>

                    <span className="text-xl font-semibold text-slate-900">
                      Rs. {subtotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="mt-7 flex w-full items-center justify-center rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  to="/products"
                  className="mt-4 flex w-full items-center justify-center text-sm font-medium text-slate-600 hover:text-emerald-700"
                >
                  Continue shopping
                </Link>
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

export default Cart