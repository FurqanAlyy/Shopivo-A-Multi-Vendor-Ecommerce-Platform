import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Icon from '../ui/Icon'

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSearch(params.get('search') || '')
  }, [location.search])

  const handleLogout = async () => {
    await logout()
    setMenuOpen(false)
    navigate('/')
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  const handleSearch = event => {
    event.preventDefault()

    const value = search.trim()

    if (!value) {
      navigate('/products')
      closeMenu()
      return
    }

    navigate(`/products?search=${encodeURIComponent(value)}`)
    closeMenu()
  }

  const isActive = path => {
    if (path === '/') {
      return location.pathname === '/'
    }

    return location.pathname.startsWith(path)
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={closeMenu}
          className="shrink-0 text-[22px] font-bold tracking-tight text-emerald-800"
        >
          Shopivo
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <Link
            to="/"
            className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
              isActive('/')
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-700'
            }`}
          >
            Home
          </Link>

          <Link
            to="/products"
            className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
              isActive('/products')
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-700'
            }`}
          >
            Shop
          </Link>

          <Link
            to="/products"
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-emerald-700"
          >
            Categories
          </Link>
        </div>

        <form
          onSubmit={handleSearch}
          className="ml-auto hidden h-10 w-full max-w-[340px] items-center rounded-xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100 lg:flex"
        >
          <Icon
            name="search"
            size={17}
            className="shrink-0 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Search products..."
            className="min-w-0 flex-1 bg-transparent px-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="mr-1 rounded-full p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
              aria-label="Clear search"
            >
              <Icon name="close" size={14} />
            </button>
          )}

          <button
            type="submit"
            className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-800"
          >
            Search
          </button>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 lg:ml-0">
          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-50 hover:text-emerald-700"
            aria-label="Shopping cart"
          >
            <Icon name="cart" size={20} />
          </Link>

          {isAuthenticated ? (
            <>
              <div className="hidden items-center gap-2 lg:flex">
                <Link
                  to="/profile"
                  className={`max-w-[130px] truncate rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive('/profile')
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-700'
                  }`}
                >
                  Hi, {user.name}
                </Link>

                {user.role === 'buyer' && (
                  <Link
                    to="/seller/apply"
                    className="whitespace-nowrap rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    Become a seller
                  </Link>
                )}

                {(user.role === 'seller' || user.role === 'admin') && (
                  <Link
                    to={
                      user.role === 'seller'
                        ? '/seller/dashboard'
                        : '/admin/dashboard'
                    }
                    className="rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    Dashboard
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  Logout
                </button>
              </div>

              <button
                type="button"
                onClick={() => setMenuOpen(value => !value)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-50 hover:text-emerald-700 lg:hidden"
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
              >
                <Icon
                  name={menuOpen ? 'close' : 'menu'}
                  size={21}
                />
              </button>
            </>
          ) : (
            <>
              <div className="hidden items-center gap-1 lg:flex">
                <Link
                  to="/login"
                  className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-emerald-700"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  Sign up
                </Link>
              </div>

              <button
                type="button"
                onClick={() => setMenuOpen(value => !value)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-50 hover:text-emerald-700 lg:hidden"
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
              >
                <Icon
                  name={menuOpen ? 'close' : 'menu'}
                  size={21}
                />
              </button>
            </>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-100 bg-white lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <form
              onSubmit={handleSearch}
              className="mb-4 flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100"
            >
              <Icon
                name="search"
                size={18}
                className="shrink-0 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Search products..."
                className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-slate-400"
              />

              <button
                type="submit"
                className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800"
              >
                Search
              </button>
            </form>

            <div className="space-y-1">
              <Link
                to="/"
                onClick={closeMenu}
                className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive('/')
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-700'
                }`}
              >
                Home
              </Link>

              <Link
                to="/products"
                onClick={closeMenu}
                className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive('/products')
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-700'
                }`}
              >
                Shop
              </Link>

              <Link
                to="/products"
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700"
              >
                Categories
              </Link>

              {isAuthenticated && user.role === 'buyer' && (
                <Link
                  to="/seller/apply"
                  onClick={closeMenu}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700"
                >
                  Become a seller
                </Link>
              )}

              {isAuthenticated && user.role === 'seller' && (
                <Link
                  to="/seller/dashboard"
                  onClick={closeMenu}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700"
                >
                  Seller dashboard
                </Link>
              )}

              {isAuthenticated && user.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  onClick={closeMenu}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700"
                >
                  Admin dashboard
                </Link>
              )}

              {isAuthenticated ? (
                <div className="mt-3 border-t border-slate-100 pt-3">
                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive('/profile')
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-700'
                    }`}
                  >
                    Hi, {user.name}
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    onClick={closeMenu}
                    className="rounded-xl bg-emerald-700 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-800"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar