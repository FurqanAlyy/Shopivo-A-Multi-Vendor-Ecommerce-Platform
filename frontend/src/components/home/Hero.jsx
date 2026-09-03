export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-5 pt-5 lg:px-8 lg:pt-8">
      <div className="relative min-h-[560px] overflow-hidden rounded-3xl bg-[#dfe9e2]">
        <img
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=85"
          alt="Modern minimal interior"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent" />

        <div className="relative flex min-h-[560px] items-center px-7 py-16 sm:px-12 lg:px-16">
          <div className="max-w-xl">
            <span className="mb-5 inline-flex rounded-full bg-emerald-800/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Curated marketplace
            </span>

            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Quality finds.
              <br />
              <span className="text-emerald-800">Beautifully curated.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
              Discover thoughtfully selected products from independent
              creators and trusted brands, all in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button className="rounded-xl bg-emerald-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-700 active:scale-[0.98]">
                Shop now
              </button>

              <button className="rounded-xl border border-slate-300 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-700 backdrop-blur transition hover:border-emerald-600 hover:text-emerald-800 active:scale-[0.98]">
                Explore vendors
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}