import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Icon from '../ui/Icon'

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    setMenuOpen(false)
    navigate('/')
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={closeMenu}
          className="text-xl font-bold tracking-tight text-emerald-800"
        >
          Shopivo
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-slate-700 transition hover:text-emerald-700"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="text-sm font-medium text-slate-700 transition hover:text-emerald-700"
          >
            Shop
          </Link>

          <Link
            to="/products"
            className="text-sm font-medium text-slate-700 transition hover:text-emerald-700"
          >
            Categories
          </Link>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            to="/products"
            className="rounded-full p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-emerald-700"
            aria-label="Search products"
          >
            <Icon name="search" size={20} />
          </Link>

          <Link
            to="/cart"
            className="rounded-full p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-emerald-700"
            aria-label="Shopping cart"
          >
            <Icon name="cart" size={20} />
          </Link>

          {isAuthenticated ? (
            <>
              <div className="ml-1 hidden items-center gap-3 sm:flex">
                <Link
                  to="/profile"
                  className="max-w-[140px] truncate text-sm font-medium text-slate-700 transition hover:text-emerald-700"
                >
                  Hi, {user.name}
                </Link>

                {user.role === 'buyer' && (
                  <Link
                    to="/seller/apply"
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    Become a seller
                  </Link>
                )}

                {user.role === 'seller' && (
                  <Link
                    to="/seller/dashboard"
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    Dashboard
                  </Link>
                )}

                {user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
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
                className="ml-1 rounded-full p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-emerald-700 md:hidden"
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
              <div className="ml-1 hidden items-center gap-2 sm:flex">
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-medium text-slate-700 transition hover:text-emerald-700"
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
                className="ml-1 rounded-full p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-emerald-700 sm:hidden"
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
        <div className="border-t border-slate-100 bg-white md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="space-y-1">
              <Link
                to="/"
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
              >
                Home
              </Link>

              <Link
                to="/products"
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
              >
                Shop
              </Link>

              <Link
                to="/products"
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
              >
                Categories
              </Link>

              {isAuthenticated && user.role === 'buyer' && (
                <Link
                  to="/seller/apply"
                  onClick={closeMenu}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                >
                  Become a seller
                </Link>
              )}

              {isAuthenticated && user.role === 'seller' && (
                <Link
                  to="/seller/dashboard"
                  onClick={closeMenu}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                >
                  Seller dashboard
                </Link>
              )}

              {isAuthenticated && user.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  onClick={closeMenu}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                >
                  Admin dashboard
                </Link>
              )}

              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
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
                </>
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