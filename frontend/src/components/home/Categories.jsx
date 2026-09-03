const categories = [
  {
    name: 'Electronics',
    label: 'Popular',
    image:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=85',
    className: 'md:col-span-2 md:row-span-2'
  },
  {
    name: 'Fashion',
    image:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=85',
    className: ''
  },
  {
    name: 'Home & Living',
    image:
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=85',
    className: ''
  }
]

export default function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <div className="mb-7 flex items-end justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-700">
            Browse
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Explore categories
          </h2>
        </div>

        <button className="hidden items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 sm:flex">
          View all
          <span>→</span>
        </button>
      </div>

      <div className="grid gap-4 md:h-[560px] md:grid-cols-3 md:grid-rows-2">
        {categories.map(category => (
          <a
            href="#"
            key={category.name}
            className={`group relative min-h-[240px] overflow-hidden rounded-2xl ${category.className}`}
          >
            <img
              src={category.image}
              alt={category.name}
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            <div className="absolute bottom-6 left-6">
              {category.label && (
                <span className="mb-2 inline-block rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 backdrop-blur">
                  {category.label}
                </span>
              )}

              <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {category.name}
              </h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}