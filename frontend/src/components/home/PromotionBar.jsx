import { Link } from 'react-router-dom'

export default function PromotionBar() {
  return (
    <div className="bg-emerald-900 px-4 py-2.5 text-center text-xs font-medium tracking-wide text-white">
      <span>Discover new products from Shopivo sellers.</span>

      <Link
        to="/products"
        className="ml-2 font-semibold underline underline-offset-2 transition hover:text-emerald-200"
      >
        Shop now
      </Link>
    </div>
  )
}