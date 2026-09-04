import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getAdminSellers,
  updateSellerStatus
} from '../../services/adminService'
import Icon from '../../components/ui/Icon'

const statusStyles = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  suspended: 'bg-slate-100 text-slate-700 border-slate-200'
}

const statusLabels = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  suspended: 'Suspended'
}

const AdminSellers = () => {
  const navigate = useNavigate()

  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    const loadSellers = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await getAdminSellers()

        setSellers(response.sellers || [])
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Failed to load sellers'
        )
      } finally {
        setLoading(false)
      }
    }

    loadSellers()
  }, [])

  const handleStatusChange = async (id, status) => {
    try {
      setUpdatingId(id)
      setError('')

      const response = await updateSellerStatus(id, status)

      setSellers(current =>
        current.map(seller =>
          seller._id === id
            ? {
                ...seller,
                status: response.seller?.status || status
              }
            : seller
        )
      )
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to update seller status'
      )
    } finally {
      setUpdatingId(null)
    }
  }

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
                Manage Sellers
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Review and manage marketplace seller accounts.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Total Sellers
              </p>

              <p className="mt-1 text-xl font-semibold text-slate-900">
                {sellers.length}
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

        {sellers.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
              <Icon name="user" size={26} />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              No sellers found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              There are currently no seller accounts on the platform.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Seller
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Store
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Contact
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Joined
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {sellers.map(seller => (
                    <tr
                      key={seller._id}
                      className="transition hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-medium text-slate-900">
                            {seller.user?.name || 'Unknown User'}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {seller.user?.email || 'N/A'}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-medium text-slate-800">
                          {seller.storeName}
                        </p>

                        {seller.address?.city && (
                          <p className="mt-1 text-sm text-slate-500">
                            {seller.address.city}
                            {seller.address.country
                              ? `, ${seller.address.country}`
                              : ''}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm text-slate-700">
                          {seller.phone}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm text-slate-600">
                          {formatDate(seller.createdAt)}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${
                            statusStyles[seller.status] ||
                            'border-slate-200 bg-slate-50 text-slate-600'
                          }`}
                        >
                          {statusLabels[seller.status] || seller.status}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <select
                          value={seller.status}
                          disabled={updatingId === seller._id}
                          onChange={event =>
                            handleStatusChange(
                              seller._id,
                              event.target.value
                            )
                          }
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="pending">
                            Pending
                          </option>
                          <option value="approved">
                            Approved
                          </option>
                          <option value="rejected">
                            Rejected
                          </option>
                          <option value="suspended">
                            Suspended
                          </option>
                        </select>
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

export default AdminSellers