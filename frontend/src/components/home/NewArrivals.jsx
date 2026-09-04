import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../../services/productService'
import ProductCard from './ProductCard'
import Icon from '../ui/Icon'

const NewArrivals = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts({
          sort: 'price_asc',
          page: 1,
          limit: 4
        })

        setProducts(response.products || [])
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (!loading && !products.length) {
    return null
  }

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              More to explore
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everyday picks
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
              Discover more products worth adding to your cart.
            </p>
          </div>

          <Link
            to="/products"
            className="hidden items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800 sm:flex"
          >
            Browse shop
            <Icon name="arrowRight" size={17} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-5">
            {[1, 2, 3, 4].map(item => (
              <div key={item}>
                <div className="aspect-square animate-pulse rounded-2xl bg-slate-200" />
                <div className="mt-4 h-3 w-20 animate-pulse rounded bg-slate-200" />
                <div className="mt-2 h-5 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="mt-3 h-4 w-24 animate-pulse rounded bg-slate-200" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-4 md:gap-5">
            {products.map(product => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}

        <Link
          to="/products"
          className="mt-9 flex items-center justify-center gap-2 text-sm font-semibold text-emerald-700 sm:hidden"
        >
          Browse all products
          <Icon name="arrowRight" size={17} />
        </Link>
      </div>
    </section>
  )
}

export default NewArrivals