import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Icon from '../ui/Icon'

const BecomeSeller = () => {
  const { user, isAuthenticated } = useAuth()

  if (isAuthenticated && user?.role !== 'buyer') {
    return null
  }

  return (
    <section className="bg-[#eef3ef] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-[28px] border border-emerald-100 bg-white lg:grid-cols-2">
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Grow with Shopivo
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Have something to sell?
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-6 text-slate-500 sm:text-base">
              Turn your products into a storefront on Shopivo. Manage
              your products, inventory, and orders from your seller
              dashboard.
            </p>

            <div className="mt-7">
              <Link
                to={isAuthenticated ? '/seller/apply' : '/signup'}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                {isAuthenticated ? 'Become a seller' : 'Create your account'}
                <Icon name="arrowRight" size={17} />
              </Link>
            </div>
          </div>

          <div className="relative min-h-[300px] overflow-hidden bg-[#dfe9e2] lg:min-h-full">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85"
              alt="Seller managing products"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-emerald-950/20" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default BecomeSeller