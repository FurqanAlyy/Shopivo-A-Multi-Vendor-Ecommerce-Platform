import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdminDashboardStats } from '../../services/adminService'
import Icon from '../../components/ui/Icon'

const AdminDashboard = () => {
  const navigate = useNavigate()

  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await getAdminDashboardStats()

        setStats(response.stats)
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Failed to load dashboard'
        )
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const formatRevenue = value => {
    return `Rs. ${Number(value || 0).toLocaleString()}`
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8faf9]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-700" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-emerald-700">
            Administration
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Overview of your Shopivo marketplace.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {stats && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Icon name="user" size={22} />
                </div>

                <p className="mt-5 text-sm text-slate-500">
                  Total Users
                </p>

                <p className="mt-1 text-3xl font-semibold text-slate-900">
                  {stats.totalUsers}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Icon name="user" size={22} />
                </div>

                <p className="mt-5 text-sm text-slate-500">
                  Total Sellers
                </p>

                <p className="mt-1 text-3xl font-semibold text-slate-900">
                  {stats.totalSellers}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Icon name="box" size={22} />
                </div>

                <p className="mt-5 text-sm text-slate-500">
                  Total Products
                </p>

                <p className="mt-1 text-3xl font-semibold text-slate-900">
                  {stats.totalProducts}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Icon name="box" size={22} />
                </div>

                <p className="mt-5 text-sm text-slate-500">
                  Total Orders
                </p>

                <p className="mt-1 text-3xl font-semibold text-slate-900">
                  {stats.totalOrders}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <span className="text-lg font-semibold">
                    Rs.
                  </span>
                </div>

                <p className="mt-5 text-sm text-slate-500">
                  Total Revenue
                </p>

                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  {formatRevenue(stats.totalRevenue)}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-slate-900">
                  Marketplace Management
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage the main areas of your marketplace.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => navigate('/admin/users')}
                    className="rounded-xl border border-slate-200 px-4 py-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50"
                  >
                    <p className="font-medium text-slate-900">
                      Manage Users
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      View registered users
                    </p>
                  </button>

                  <button
                    onClick={() => navigate('/admin/sellers')}
                    className="rounded-xl border border-slate-200 px-4 py-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50"
                  >
                    <p className="font-medium text-slate-900">
                      Manage Sellers
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Review seller accounts
                    </p>
                  </button>

                  <button
                    onClick={() => navigate('/admin/products')}
                    className="rounded-xl border border-slate-200 px-4 py-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50"
                  >
                    <p className="font-medium text-slate-900">
                      Manage Products
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      View marketplace products
                    </p>
                  </button>

                  <button
                    onClick={() => navigate('/admin/orders')}
                    className="rounded-xl border border-slate-200 px-4 py-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50"
                  >
                    <p className="font-medium text-slate-900">
                      Manage Orders
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Monitor all orders
                    </p>
                  </button>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-slate-900">
                  Platform Overview
                </h2>

                <div className="mt-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <span className="text-sm text-slate-500">
                      Registered users
                    </span>
                    <span className="font-semibold text-slate-900">
                      {stats.totalUsers}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <span className="text-sm text-slate-500">
                      Sellers
                    </span>
                    <span className="font-semibold text-slate-900">
                      {stats.totalSellers}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <span className="text-sm text-slate-500">
                      Products
                    </span>
                    <span className="font-semibold text-slate-900">
                      {stats.totalProducts}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      Orders
                    </span>
                    <span className="font-semibold text-slate-900">
                      {stats.totalOrders}
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard