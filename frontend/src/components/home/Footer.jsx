import { Link } from 'react-router-dom'

const columns = [
  {
    title: 'Shop',
    links: [
      { label: 'All products', to: '/products' },
      { label: 'Categories', to: '/products' },
      { label: 'My orders', to: '/orders' }
    ]
  },
  {
    title: 'Account',
    links: [
      { label: 'Login', to: '/login' },
      { label: 'Create account', to: '/signup' },
      { label: 'Cart', to: '/cart' }
    ]
  },
  {
    title: 'Sell',
    links: [
      { label: 'Become a seller', to: '/seller/apply' },
      { label: 'Seller dashboard', to: '/seller/dashboard' }
    ]
  }
]

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-emerald-800"
          >
            Shopivo
          </Link>

          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
            A multi-vendor marketplace connecting shoppers with
            independent sellers and trusted brands.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
          >
            Explore the marketplace
          </Link>
        </div>

        {columns.map(column => (
          <div key={column.title}>
            <h3 className="text-sm font-semibold text-slate-900">
              {column.title}
            </h3>

            <ul className="mt-4 space-y-3">
              {column.links.map(link => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-500 transition hover:text-emerald-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span>© 2026 Shopivo. All rights reserved.</span>

          <span>
            Built for a better marketplace experience.
          </span>
        </div>
      </div>
    </footer>
  )
}