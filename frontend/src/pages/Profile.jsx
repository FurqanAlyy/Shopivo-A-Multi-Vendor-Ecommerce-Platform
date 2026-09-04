import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import { useAuth } from '../context/AuthContext'
import { getProfile } from '../services/userService'

const Profile = () => {
  const { user: authUser } = useAuth()
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await getProfile()
        setProfileData(data.user)
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to load profile details'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const user = profileData || authUser

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8faf9]">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-8 h-64 animate-pulse rounded-3xl bg-white" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8faf9] px-6">
        <div className="rounded-2xl border border-red-200 bg-white px-8 py-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <Icon name="warning" size={22} />
          </div>
          <p className="mt-4 text-sm text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-5 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8 lg:py-14">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-emerald-700">
            Account Overview
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            My Profile
          </h1>
          <p className="mt-2 text-slate-500">
            Manage your user details and view account shortcuts.
          </p>
        </div>

        {/* Profile Card */}
        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-2xl font-bold uppercase text-emerald-800">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="truncate text-xl font-semibold text-slate-900">
                  {user?.name}
                </h2>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium capitalize text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  {user?.role || 'Buyer'}
                </span>
              </div>
              <p className="mt-1 truncate text-sm text-slate-500">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="my-8 border-t border-slate-100" />

          {/* Quick Actions / Navigation Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              to="/orders"
              className="group flex items-center justify-between rounded-2xl border border-slate-200/80 p-5 transition hover:border-emerald-300 hover:bg-emerald-50/30"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-700">
                  <Icon name="cart" size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">My Orders</h3>
                  <p className="text-xs text-slate-500">
                    Track & view past purchases
                  </p>
                </div>
              </div>
              <Icon
                name="arrowRight"
                size={18}
                className="text-slate-400 group-hover:text-emerald-700"
              />
            </Link>

            {user?.role === 'seller' && (
              <Link
                to="/seller/dashboard"
                className="group flex items-center justify-between rounded-2xl border border-slate-200/80 p-5 transition hover:border-emerald-300 hover:bg-emerald-50/30"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-700">
                    <Icon name="box" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">
                      Seller Dashboard
                    </h3>
                    <p className="text-xs text-slate-500">
                      Manage products & customer orders
                    </p>
                  </div>
                </div>
                <Icon
                  name="arrowRight"
                  size={18}
                  className="text-slate-400 group-hover:text-emerald-700"
                />
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className="group flex items-center justify-between rounded-2xl border border-slate-200/80 p-5 transition hover:border-emerald-300 hover:bg-emerald-50/30"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-700">
                    <Icon name="warning" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">
                      Admin Portal
                    </h3>
                    <p className="text-xs text-slate-500">
                      Manage platform settings & users
                    </p>
                  </div>
                </div>
                <Icon
                  name="arrowRight"
                  size={18}
                  className="text-slate-400 group-hover:text-emerald-700"
                />
              </Link>
            )}

            {user?.role === 'buyer' && (
              <Link
                to="/seller/apply"
                className="group flex items-center justify-between rounded-2xl border border-slate-200/80 p-5 transition hover:border-emerald-300 hover:bg-emerald-50/30"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-700">
                    <Icon name="box" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">
                      Become a Seller
                    </h3>
                    <p className="text-xs text-slate-500">
                      Apply to sell products on the marketplace
                    </p>
                  </div>
                </div>
                <Icon
                  name="arrowRight"
                  size={18}
                  className="text-slate-400 group-hover:text-emerald-700"
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile