import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'

export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8 lg:pt-6">
      <div className="relative min-h-[570px] overflow-hidden rounded-[28px] bg-[#dfe9e2]">
        <img
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=85"
          alt="Curated products and modern lifestyle"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/10" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

        <div className="relative flex min-h-[570px] items-center px-6 py-16 sm:px-10 lg:px-16">
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-800/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-700" />
              Your everyday marketplace
            </div>

            <h1 className="text-4xl font-bold leading-[1.04] tracking-tight text-slate-900 sm:text-5xl lg:text-[64px]">
              Find what you love.
              <br />
              <span className="text-emerald-800">
                Shop it your way.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
              Discover quality products from independent sellers and
              trusted brands, all brought together in one simple
              marketplace.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-700 active:scale-[0.98]"
              >
                Shop now
                <Icon name="arrowRight" size={17} />
              </Link>

              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-700 backdrop-blur transition hover:border-emerald-600 hover:text-emerald-800 active:scale-[0.98]"
              >
                Explore categories
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-700 text-white">
                  <Icon name="check" size={12} strokeWidth={2.5} />
                </span>
                Trusted sellers
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-700 text-white">
                  <Icon name="check" size={12} strokeWidth={2.5} />
                </span>
                Cash on delivery
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-700 text-white">
                  <Icon name="check" size={12} strokeWidth={2.5} />
                </span>
                Easy ordering
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}