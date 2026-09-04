import { Link } from 'react-router-dom'

const ProductCard = ({ product }) => {
  const discountedPrice =
    product.discount > 0
      ? product.price - (product.price * product.discount) / 100
      : product.price

  return (
    <Link
      to={`/products/${product._id}`}
      className="group block"
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            No image
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.discount > 0 && (
            <span className="w-fit rounded-full bg-emerald-700 px-3 py-1 text-[11px] font-bold text-white">
              {product.discount}% OFF
            </span>
          )}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {product.category?.name || 'Product'}
        </p>

        <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-5 text-slate-900 transition group-hover:text-emerald-700 sm:text-base">
          {product.name}
        </h3>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-bold text-slate-900">
            Rs. {discountedPrice.toFixed(0)}
          </span>

          {product.discount > 0 && (
            <span className="text-sm text-slate-400 line-through">
              Rs. {product.price.toFixed(0)}
            </span>
          )}
        </div>

        {product.seller?.storeName && (
          <p className="mt-1.5 truncate text-xs text-slate-400">
            Sold by {product.seller.storeName}
          </p>
        )}
      </div>
    </Link>
  )
}

export default ProductCard