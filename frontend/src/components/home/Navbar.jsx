import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Icon from '../ui/Icon'

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        <Link
          to="/"
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
            to="/categories"
            className="text-sm font-medium text-slate-700 transition hover:text-emerald-700"
          >
            Categories
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-emerald-700 sm:block"
          >
            <Icon name="search" size={20} />
          </button>

          <Link
            to="/cart"
            className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-emerald-700"
          >
            <Icon name="cart" size={20} />
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="hidden text-sm font-medium text-slate-700 transition hover:text-emerald-700 sm:block"
              >
                Hi, {user.name}
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="hidden px-3 py-2 text-sm font-medium text-slate-700 transition hover:text-emerald-700 sm:block"
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
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar