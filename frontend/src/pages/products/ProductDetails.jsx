import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../components/home/Navbar'
import Footer from '../../components/home/Footer'
import Icon from '../../components/ui/Icon'
import { getProduct } from '../../services/productService'
import { addToCart } from '../../services/cartService'
import { useAuth } from '../../context/AuthContext'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const [error, setError] = useState('')
  const [cartMessage, setCartMessage] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await getProduct(id)

        setProduct(response.product)
        setSelectedImage(response.product?.images?.[0] || '')
      } catch (error) {
        setError(
          error.response?.data?.message ||
          'Failed to load product'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const discountedPrice =
    product?.discount > 0
      ? product.price - (product.price * product.discount) / 100
      : product?.price

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((current) => current + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((current) => current - 1)
    }
  }

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login', {
        state: {
          from: `/products/${id}`
        }
      })

      return
    }

    try {
      setAddingToCart(true)
      setCartMessage('')

      await addToCart(product._id, quantity)

      setCartMessage('Product added to cart')
    } catch (error) {
      setCartMessage(
        error.response?.data?.message ||
        'Failed to add product to cart'
      )
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-[#f8faf9]">
          <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="aspect-square animate-pulse rounded-3xl bg-slate-200" />

              <div className="space-y-5 py-4">
                <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                <div className="h-10 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="h-8 w-32 animate-pulse rounded bg-slate-200" />
                <div className="h-24 w-full animate-pulse rounded bg-slate-200" />
                <div className="h-12 w-full animate-pulse rounded bg-slate-200" />
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </>
    )
  }

  if (error || !product) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center bg-[#f8faf9] px-6">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Icon
                name="search"
                size={26}
                className="text-slate-400"
              />
            </div>

            <h1 className="mt-5 text-2xl font-semibold text-slate-900">
              Product not found
            </h1>

            <p className="mt-2 text-slate-500">
              {error || 'This product may no longer be available.'}
            </p>

            <Link
              to="/products"
              className="mt-6 inline-flex rounded-xl bg-emerald-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-800"
            >
              Back to shop
            </Link>
          </div>
        </main>

        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f8faf9]">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-emerald-700"
          >
            <Icon name="arrowLeft" size={17} />
            Back
          </button>

          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <div className="relative overflow-hidden rounded-3xl bg-white">
                {product.discount > 0 && (
                  <span className="absolute left-5 top-5 z-10 rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white">
                    -{product.discount}%
                  </span>
                )}

                <div className="aspect-square">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                      No image available
                    </div>
                  )}
                </div>
              </div>

              {product.images?.length > 1 && (
                <div className="mt-4 grid grid-cols-5 gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      onClick={() => setSelectedImage(image)}
                      className={`aspect-square overflow-hidden rounded-xl border-2 bg-white ${
                        selectedImage === image
                          ? 'border-emerald-700'
                          : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center">
              {product.category && (
                <Link
                  to={`/products?category=${product.category._id}`}
                  className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-emerald-700"
                >
                  {product.category.name}
                </Link>
              )}

              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                {product.name}
              </h1>

              {product.seller?.storeName && (
                <p className="mt-3 text-sm text-slate-500">
                  Sold by{' '}
                  <span className="font-medium text-slate-700">
                    {product.seller.storeName}
                  </span>
                </p>
              )}

              <div className="mt-6 flex items-center gap-3">
                <span className="text-3xl font-semibold text-slate-900">
                  Rs. {discountedPrice.toLocaleString()}
                </span>

                {product.discount > 0 && (
                  <span className="text-lg text-slate-400 line-through">
                    Rs. {product.price.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="mt-6 h-px bg-slate-200" />

              <div className="mt-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
                  Description
                </h2>

                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                  {product.description}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    product.stock > 0
                      ? 'bg-emerald-600'
                      : 'bg-red-500'
                  }`}
                />

                <span className="text-sm font-medium text-slate-700">
                  {product.stock > 0
                    ? `${product.stock} available`
                    : 'Out of stock'}
                </span>
              </div>

              {product.stock > 0 && (
                <div className="mt-7">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Quantity
                  </label>

                  <div className="flex w-fit items-center rounded-xl border border-slate-200 bg-white">
                    <button
                      onClick={decreaseQuantity}
                      disabled={quantity === 1}
                      className="flex h-11 w-11 items-center justify-center text-slate-600 transition hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Icon name="minus" size={17} />
                    </button>

                    <span className="w-12 text-center text-sm font-semibold text-slate-900">
                      {quantity}
                    </span>

                    <button
                      onClick={increaseQuantity}
                      disabled={quantity >= product.stock}
                      className="flex h-11 w-11 items-center justify-center text-slate-600 transition hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Icon name="plus" size={17} />
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-4 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <Icon name="cart" size={19} />

                {addingToCart
                  ? 'Adding...'
                  : product.stock > 0
                    ? 'Add to Cart'
                    : 'Out of Stock'}
              </button>

              {cartMessage && (
                <div
                  className={`mt-4 rounded-xl px-4 py-3 text-sm ${
                    cartMessage === 'Product added to cart'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {cartMessage}
                </div>
              )}

              {cartMessage === 'Product added to cart' && (
                <Link
                  to="/cart"
                  className="mt-3 text-center text-sm font-medium text-slate-700 underline underline-offset-4 hover:text-emerald-700"
                >
                  View cart
                </Link>
              )}
            </div>
          </div>

          {product.specifications &&
            Object.keys(product.specifications).length > 0 && (
              <section className="mt-16 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-slate-900">
                  Specifications
                </h2>

                <div className="mt-6 divide-y divide-slate-100">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="grid gap-2 py-4 sm:grid-cols-2"
                      >
                        <span className="text-sm font-medium capitalize text-slate-500">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </span>

                        <span className="text-sm text-slate-900">
                          {value}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </section>
            )}
        </div>
      </main>

      <Footer />
    </>
  )
}

export default ProductDetails