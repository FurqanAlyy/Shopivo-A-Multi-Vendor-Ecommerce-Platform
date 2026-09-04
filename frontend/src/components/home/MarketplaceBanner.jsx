import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'

const MarketplaceBanner = () => {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[28px] bg-emerald-900 px-6 py-14 sm:px-10 sm:py-16 lg:px-16">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-emerald-700/30 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-10 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
                The Shopivo marketplace
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                One marketplace.
                <br />
                Plenty of possibilities.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-6 text-emerald-100/75 sm:text-base">
                Browse products from different sellers, compare your
                options, and find something that fits your everyday
                needs.
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50"
            >
              Start shopping
              <Icon name="arrowRight" size={17} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MarketplaceBanner