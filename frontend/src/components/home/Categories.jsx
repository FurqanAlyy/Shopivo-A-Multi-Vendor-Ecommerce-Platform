import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategories } from '../../services/categoryService'
import Icon from '../ui/Icon'

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories()
        setCategories(response.categories || [])
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
            <div className="mt-3 h-9 w-64 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map(item => (
              <div
                key={item}
                className="aspect-[0.9] animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!categories.length) {
    return null
  }

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Explore
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Shop by category
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Explore our growing collection and discover something made
              for you.
            </p>
          </div>

          <Link
            to="/products"
            className="hidden items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800 sm:flex"
          >
            View all
            <Icon name="arrowRight" size={17} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
          {categories.slice(0, 6).map(category => (
            <Link
              key={category._id}
              to={`/products?category=${category._id}`}
              className="group relative aspect-[0.9] overflow-hidden rounded-2xl bg-slate-100"
            >
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-emerald-50 p-4 text-center">
                  <span className="font-semibold text-emerald-800">
                    {category.name}
                  </span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-end justify-between gap-2">
                  <h3 className="text-sm font-semibold text-white sm:text-base">
                    {category.name}
                  </h3>

                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/90 text-slate-900 transition group-hover:bg-emerald-700 group-hover:text-white">
                    <Icon name="arrowRight" size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link
          to="/products"
          className="mt-7 flex items-center justify-center gap-2 text-sm font-semibold text-emerald-700 sm:hidden"
        >
          View all categories
          <Icon name="arrowRight" size={17} />
        </Link>
      </div>
    </section>
  )
}

export default Categories