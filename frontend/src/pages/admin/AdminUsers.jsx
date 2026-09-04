import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdminUsers } from '../../services/adminService'
import Icon from '../../components/ui/Icon'

const roleStyles = {
  buyer: 'bg-slate-50 text-slate-700 border-slate-200',
  seller: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  admin: 'bg-violet-50 text-violet-700 border-violet-200'
}

const roleLabels = {
  buyer: 'Buyer',
  seller: 'Seller',
  admin: 'Admin'
}

const AdminUsers = () => {
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await getAdminUsers()

        setUsers(response.users || [])
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Failed to load users'
        )
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  const formatDate = date => {
    if (!date) return 'N/A'

    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
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
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-700"
          >
            <Icon name="arrowLeft" size={17} />
            Back to Dashboard
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700">
                Administration
              </p>

              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
                Manage Users
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                View registered users and their account details.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Total Users
              </p>

              <p className="mt-1 text-xl font-semibold text-slate-900">
                {users.length}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError('')}
              className="shrink-0 font-medium hover:text-red-900"
            >
              Dismiss
            </button>
          </div>
        )}

        {users.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
              <Icon name="user" size={26} />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              No users found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              There are currently no registered users.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      User
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Role
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Joined
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {users.map(user => (
                    <tr
                      key={user._id}
                      className="transition hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-semibold text-emerald-700">
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>

                          <div>
                            <p className="font-medium text-slate-900">
                              {user.name || 'Unknown User'}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              ID: {user._id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm text-slate-700">
                          {user.email}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${
                            roleStyles[user.role] ||
                            'border-slate-200 bg-slate-50 text-slate-600'
                          }`}
                        >
                          {roleLabels[user.role] || user.role}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        {user.active ? (
                          <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-sm font-medium text-red-600">
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                            Inactive
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm text-slate-600">
                          {formatDate(user.createdAt)}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminUsers