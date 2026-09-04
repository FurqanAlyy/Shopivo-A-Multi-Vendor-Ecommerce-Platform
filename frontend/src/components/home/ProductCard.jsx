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
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            No image
          </div>
        )}

        {product.discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white">
            {product.discount}% OFF
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {product.category?.name}
        </p>

        <h3 className="mt-1 line-clamp-2 font-medium text-slate-900 transition group-hover:text-emerald-700">
          {product.name}
        </h3>

        <div className="mt-2 flex items-center gap-2">
          <span className="font-semibold text-slate-900">
            ${discountedPrice.toFixed(2)}
          </span>

          {product.discount > 0 && (
            <span className="text-sm text-slate-400 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {product.seller?.storeName && (
          <p className="mt-1 text-xs text-slate-400">
            {product.seller.storeName}
          </p>
        )}
      </div>
    </Link>
  )
}

export default ProductCard