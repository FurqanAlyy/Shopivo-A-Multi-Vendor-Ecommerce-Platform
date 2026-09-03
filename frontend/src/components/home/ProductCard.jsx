import { useState } from 'react'
import Icon from '../ui/Icon'

export default function ProductCard({ product }) {
  const [favorite, setFavorite] = useState(false)

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-900/5">
      <div className="relative h-64 overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {product.sale && (
          <span className="absolute left-4 top-4 rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white">
            Sale
          </span>
        )}

        <button
          onClick={() => setFavorite(!favorite)}
          aria-label="Add to favorites"
          className={`absolute right-4 top-4 rounded-full bg-white/90 p-2.5 backdrop-blur transition hover:bg-white ${
            favorite ? 'text-emerald-700' : 'text-slate-600'
          }`}
        >
          <Icon name="heart" size={18} />
        </button>
      </div>

      <div className="flex flex-col p-5">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-800">
            {product.vendor.charAt(0)}
          </div>

          <span className="text-xs font-medium text-slate-500">
            {product.vendor}
          </span>

          {product.verified && (
            <span className="text-xs font-bold text-emerald-600">
              ✓
            </span>
          )}
        </div>

        <h3 className="min-h-[48px] text-base font-semibold leading-6 text-slate-900">
          {product.name}
        </h3>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-emerald-800">
              ${product.price.toFixed(2)}
            </span>

            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            aria-label="Add to cart"
            className="rounded-full bg-emerald-50 p-2.5 text-emerald-700 transition hover:bg-emerald-700 hover:text-white active:scale-95"
          >
            <Icon name="cart" size={17} />
          </button>
        </div>
      </div>
    </article>
  )
}