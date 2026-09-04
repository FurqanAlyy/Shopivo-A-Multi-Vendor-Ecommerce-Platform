import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../../components/ui/Icon'
import {
  applyAsSeller,
  getMySellerApplication
} from '../../services/sellerService'

const SellerApplication = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [seller, setSeller] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    storeName: '',
    description: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Pakistan'
  })

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await getMySellerApplication()
        setSeller(response.seller)
      } catch (error) {
        if (error.response?.status !== 404) {
          setError(
            error.response?.data?.message ||
            'Unable to load seller application'
          )
        }
      } finally {
        setLoading(false)
      }
    }

    fetchApplication()
  }, [])

  const handleChange = event => {
    const { name, value } = event.target

    setFormData(previous => ({
      ...previous,
      [name]: value
    }))
  }

  const handleSubmit = async event => {
    event.preventDefault()

    try {
      setSubmitting(true)
      setError('')
      setSuccess('')

      const response = await applyAsSeller({
        storeName: formData.storeName,
        description: formData.description,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country
        }
      })

      setSeller(response.seller)
      setSuccess(response.message)
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Failed to submit seller application'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8faf9]">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <div className="h-8 w-56 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-8 h-96 animate-pulse rounded-3xl bg-white ring-1 ring-slate-200" />
        </div>
      </div>
    )
  }

  if (seller) {
    const statusStyles = {
      pending: 'bg-amber-50 text-amber-700',
      approved: 'bg-emerald-50 text-emerald-700',
      rejected: 'bg-red-50 text-red-700',
      suspended: 'bg-slate-100 text-slate-700'
    }

    return (
      <div className="min-h-screen bg-[#f8faf9] px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-700"
          >
            <Icon name="arrowLeft" size={18} />
            Back to Home
          </Link>

          <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-emerald-700">
                  Seller Application
                </p>

                <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                  {seller.storeName}
                </h1>
              </div>

              <span
                className={`w-fit rounded-full px-4 py-2 text-sm font-medium capitalize ${
                  statusStyles[seller.status] || statusStyles.pending
                }`}
              >
                {seller.status}
              </span>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-400">Phone</p>
                <p className="mt-1 font-medium text-slate-800">
                  {seller.phone}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">City</p>
                <p className="mt-1 font-medium text-slate-800">
                  {seller.address?.city}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-sm text-slate-400">Address</p>
                <p className="mt-1 font-medium text-slate-800">
                  {seller.address?.street}, {seller.address?.city}
                  {seller.address?.state
                    ? `, ${seller.address.state}`
                    : ''}
                  , {seller.address?.postalCode},{' '}
                  {seller.address?.country}
                </p>
              </div>

              {seller.description && (
                <div className="sm:col-span-2">
                  <p className="text-sm text-slate-400">Description</p>
                  <p className="mt-1 leading-6 text-slate-700">
                    {seller.description}
                  </p>
                </div>
              )}
            </div>

            {seller.status === 'pending' && (
              <div className="mt-8 rounded-2xl bg-amber-50 p-5 text-sm leading-6 text-amber-800">
                Your application is currently under review. You will be able
                to sell products once an admin approves your application.
              </div>
            )}

            {seller.status === 'rejected' && seller.rejectionReason && (
              <div className="mt-8 rounded-2xl bg-red-50 p-5 text-sm leading-6 text-red-800">
                <p className="font-semibold">Application rejected</p>
                <p className="mt-1">{seller.rejectionReason}</p>
              </div>
            )}

            {seller.status === 'approved' && (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/seller/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 font-medium text-white transition hover:bg-emerald-800"
                >
                  Seller Dashboard
                  <Icon name="arrowRight" size={18} />
                </Link>

                <Link
                  to="/seller/products"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  My Products
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-700"
        >
          <Icon name="arrowLeft" size={18} />
          Back to Home
        </Link>

        <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-10">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-emerald-700">
              Become a Seller
            </p>

            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Start selling on Shopivo
            </h1>

            <p className="mt-3 max-w-2xl leading-6 text-slate-500">
              Create your seller profile and submit your application for
              admin approval.
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-10 space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Store Information
              </h2>

              <div className="mt-5 space-y-5">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Store Name
                  </label>

                  <input
                    type="text"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleChange}
                    required
                    minLength={2}
                    maxLength={100}
                    placeholder="Enter your store name"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    maxLength={1000}
                    rows={4}
                    placeholder="Tell customers about your store"
                    className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Contact Information
              </h2>

              <div className="mt-5">
                <label className="text-sm font-medium text-slate-700">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+92 300 1234567"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Store Address
              </h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700">
                    Street Address
                  </label>

                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    required
                    placeholder="Street address"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="Lahore"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Punjab"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Postal Code
                  </label>

                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                    placeholder="54000"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Country
                  </label>

                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    placeholder="Pakistan"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3.5 font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Submitting Application...' : 'Submit Application'}
              {!submitting && <Icon name="arrowRight" size={18} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SellerApplication