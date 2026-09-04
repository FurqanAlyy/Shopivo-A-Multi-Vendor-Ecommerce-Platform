import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/home/Navbar'
import Footer from '../components/home/Footer'
import ProductCard from '../components/home/ProductCard'
import Icon from '../components/ui/Icon'
import { getProducts } from '../services/productService'
import { getCategories } from '../services/categoryService'

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest')
  const page = Number(searchParams.get('page')) || 1

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories()
        setCategories(response.categories || [])
      } catch {
        setCategories([])
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError('')

        const params = {
          page,
          limit: 12,
          sort
        }

        if (search.trim()) params.search = search.trim()
        if (category) params.category = category
        if (minPrice) params.minPrice = minPrice
        if (maxPrice) params.maxPrice = maxPrice

        const response = await getProducts(params)

        setProducts(response.products || [])
        setPagination(response.pagination || null)
      } catch (error) {
        setError(
          error.response?.data?.message ||
          'Failed to load products'
        )
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchParams])

  const updateParams = (updates = {}) => {
    const params = new URLSearchParams(searchParams)

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    params.set('page', '1')
    setSearchParams(params)
  }

  const handleSearch = (event) => {
    event.preventDefault()
    updateParams({ search })
  }

  const handleCategoryChange = (event) => {
    const value = event.target.value
    setCategory(value)
    updateParams({ category: value })
  }

  const handleSortChange = (event) => {
    const value = event.target.value
    setSort(value)
    updateParams({ sort: value })
  }

  const handlePriceFilter = (event) => {
    event.preventDefault()

    updateParams({
      minPrice,
      maxPrice
    })
  }

  const clearFilters = () => {
    setSearch('')
    setCategory('')
    setMinPrice('')
    setMaxPrice('')
    setSort('newest')
    setSearchParams({})
  }

  const changePage = (newPage) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f8faf9]">
        <section className="border-b border-slate-200 bg-[#eef3ef]">
          <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-emerald-700">
              Shop
            </p>

            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Find something you love
            </h1>

            <p className="mt-4 max-w-2xl text-slate-600">
              Explore products from independent sellers across the Shopivo
              marketplace.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">
                  Filters
                </h2>

                <button
                  onClick={clearFilters}
                  className="text-sm text-emerald-700 hover:text-emerald-800"
                >
                  Clear
                </button>
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category
                </label>

                <select
                  value={category}
                  onChange={handleCategoryChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-600"
                >
                  <option value="">All categories</option>

                  {categories.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <form onSubmit={handlePriceFilter}>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Price range
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(event) => setMinPrice(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600"
                  />

                  <input
                    type="number"
                    min="0"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-3 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800"
                >
                  Apply price
                </button>
              </form>
            </aside>

            <div>
              <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <form
                  onSubmit={handleSearch}
                  className="flex w-full max-w-xl items-center rounded-xl border border-slate-200 bg-white px-4"
                >
                  <Icon
                    name="search"
                    size={19}
                    className="text-slate-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search products..."
                    className="w-full bg-transparent px-3 py-3 text-sm outline-none"
                  />

                  <button
                    type="submit"
                    className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
                  >
                    Search
                  </button>
                </form>

                <select
                  value={sort}
                  onChange={handleSortChange}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-600"
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              {!loading && !error && pagination && (
                <div className="mb-6 text-sm text-slate-500">
                  Showing {products.length} of {pagination.total} products
                </div>
              )}

              {loading && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                    >
                      <div className="aspect-square animate-pulse bg-slate-200" />
                      <div className="space-y-3 p-5">
                        <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
                        <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
                        <div className="h-5 w-24 animate-pulse rounded bg-slate-200" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && error && (
                <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
                  <p className="text-sm text-red-600">{error}</p>

                  <button
                    onClick={() => setSearchParams(searchParams)}
                    className="mt-4 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white"
                  >
                    Try again
                  </button>
                </div>
              )}

              {!loading && !error && products.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center">
                  <h2 className="text-xl font-semibold text-slate-900">
                    No products found
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Try changing your search or filters.
                  </p>

                  <button
                    onClick={clearFilters}
                    className="mt-6 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
                  >
                    Clear filters
                  </button>
                </div>
              )}

              {!loading && !error && products.length > 0 && (
                <>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {products.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                      />
                    ))}
                  </div>

                  {pagination && pagination.pages > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-2">
                      <button
                        disabled={page === 1}
                        onClick={() => changePage(page - 1)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Icon name="arrowLeft" size={18} />
                      </button>

                      {Array.from(
                        { length: pagination.pages },
                        (_, index) => index + 1
                      ).map((pageNumber) => (
                        <button
                          key={pageNumber}
                          onClick={() => changePage(pageNumber)}
                          className={`h-10 min-w-10 rounded-xl px-3 text-sm font-medium ${
                            pageNumber === page
                              ? 'bg-emerald-700 text-white'
                              : 'border border-slate-200 bg-white text-slate-700 hover:border-emerald-600'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      ))}

                      <button
                        disabled={page === pagination.pages}
                        onClick={() => changePage(page + 1)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Icon name="arrowRight" size={18} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default Products