import { useState } from 'react'
import ProductCard from './ProductCard'
import Icon from '../ui/Icon'

const products = [
  {
    id: 1,
    name: 'Aero Wireless Headphones',
    vendor: 'Sonic Lab',
    price: 149,
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=85',
    verified: true
  },
  {
    id: 2,
    name: 'Minimal Ceramic Pour-Over',
    vendor: 'Maison Form',
    price: 68,
    originalPrice: 89,
    sale: true,
    image:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=85'
  },
  {
    id: 3,
    name: 'Daily Hydration Serum',
    vendor: 'Verde Beauty',
    price: 42,
    image:
      'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=800&q=85',
    verified: true
  },
  {
    id: 4,
    name: 'Structured Leather Tote',
    vendor: 'Atelier North',
    price: 180,
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85'
  }
]

export default function TrendingProducts() {
  const [offset, setOffset] = useState(0)

  const visibleProducts = products.slice(offset, offset + 4)

  const next = () => {
    setOffset(current => (current + 1) % products.length)
  }

  const previous = () => {
    setOffset(current => (current - 1 + products.length) % products.length)
  }

  return (
    <section className="bg-[#eef3ef] py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-700">
              Trending
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Trending now
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              The products everyone is discovering this week.
            </p>
          </div>

          <div className="hidden gap-2 sm:flex">
            <button
              onClick={previous}
              aria-label="Previous products"
              className="rounded-full border border-slate-300 bg-white p-2.5 text-slate-600 transition hover:border-emerald-600 hover:text-emerald-700"
            >
              <Icon name="arrowLeft" size={18} />
            </button>

            <button
              onClick={next}
              aria-label="Next products"
              className="rounded-full border border-slate-300 bg-white p-2.5 text-slate-600 transition hover:border-emerald-600 hover:text-emerald-700"
            >
              <Icon name="arrowRight" size={18} />
            </button>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visibleProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}