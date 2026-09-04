import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../../services/productService'
import ProductCard from './ProductCard'
import Icon from '../ui/Icon'

const TrendingProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setError('')

        const response = await getProducts({
          sort: 'newest',
          page: 1,
          limit: 4
        })

        setProducts(response.products)
      } catch (error) {
        console.error('Failed to fetch products:', error)
        setError('Unable to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <section className="bg-[#eef3ef] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
              Featured
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Latest products
            </h2>

            <p className="mt-3 text-slate-500">
              Fresh products from our marketplace.
            </p>
          </div>

          <Link
            to="/products"
            className="hidden items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800 sm:flex"
          >
            View all
            <Icon name="arrowRight" size={17} />
          </Link>
        </div>

        {loading && (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item}>
                <div className="aspect-square animate-pulse rounded-2xl bg-slate-200" />

                <div className="mt-4 h-3 w-20 animate-pulse rounded bg-slate-200" />

                <div className="mt-2 h-5 w-3/4 animate-pulse rounded bg-slate-200" />

                <div className="mt-3 h-4 w-24 animate-pulse rounded bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && !products.length && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center">
            <p className="text-sm text-slate-500">
              No products available yet.
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-5">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}

        <Link
          to="/products"
          className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-emerald-700 sm:hidden"
        >
          View all products
          <Icon name="arrowRight" size={17} />
        </Link>
      </div>
    </section>
  )
}

export default TrendingProducts