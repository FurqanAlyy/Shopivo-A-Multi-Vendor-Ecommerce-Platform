import { useState } from 'react'
import Icon from '../ui/Icon'

const navItems = ['Shop', 'Categories', 'Deals', 'New Arrivals']

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-950/10 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
        <div className="flex items-center gap-10">
          <a
            href="/"
            className="text-xl font-bold tracking-tight text-emerald-800"
          >
            Shopivo
          </a>

          <nav className="hidden items-center gap-7 md:flex">
            {navItems.map(item => (
              <a
                key={item}
                href="#"
                className="text-sm font-medium text-slate-600 transition hover:text-emerald-700"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="relative">
            <Icon
              name="search"
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search products..."
              className="w-64 rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-3 focus:ring-emerald-500/10"
            />
          </div>

          <button
            aria-label="Favorites"
            className="rounded-full p-2.5 text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Icon name="heart" />
          </button>

          <button
            aria-label="Cart"
            className="relative rounded-full p-2.5 text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Icon name="cart" />

            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-600" />
          </button>

          <button
            aria-label="Account"
            className="flex items-center gap-2 rounded-full p-2.5 text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Icon name="user" />
            <span className="text-sm font-medium">Account</span>
          </button>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <button
            className="rounded-full p-2.5 text-slate-600 hover:bg-emerald-50"
          >
            <Icon name="search" />
          </button>

          <button
            className="rounded-full p-2.5 text-slate-600 hover:bg-emerald-50"
          >
            <Icon name="cart" />
          </button>

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="rounded-full p-2.5 text-slate-600 hover:bg-emerald-50"
          >
            <Icon name={mobileMenu ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

      {mobileMenu && (
        <div className="border-t border-slate-100 bg-white px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map(item => (
              <a
                key={item}
                href="#"
                className="rounded-lg px-3 py-3 text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
              >
                {item}
              </a>
            ))}

            <a
              href="#"
              className="rounded-lg px-3 py-3 text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
            >
              Account
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}