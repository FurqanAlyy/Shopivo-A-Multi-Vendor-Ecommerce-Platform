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
        setCategories(response.categories)
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
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-2xl bg-slate-200"
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
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
            Explore
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Shop by category
          </h2>

          <p className="mt-3 max-w-xl text-slate-500">
            Discover products across our carefully selected categories.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {categories.slice(0, 3).map((category) => (
            <Link
              key={category._id}
              to={`/products?category=${category._id}`}
              className="group relative h-72 overflow-hidden rounded-2xl bg-slate-100"
            >
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-emerald-50">
                  <span className="text-lg font-semibold text-emerald-800">
                    {category.name}
                  </span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-6">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {category.name}
                  </h3>

                  {category.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-white/80">
                      {category.description}
                    </p>
                  )}
                </div>

                <div className="rounded-full bg-white/90 p-2 text-slate-900 transition group-hover:bg-emerald-700 group-hover:text-white">
                  <Icon name="arrowRight" size={18} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categories