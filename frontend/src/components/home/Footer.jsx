const columns = [
  {
    title: 'Company',
    links: ['About us', 'Careers', 'Press']
  },
  {
    title: 'Support',
    links: ['Contact support', 'Shipping info', 'Returns', 'FAQ']
  },
  {
    title: 'Legal',
    links: ['Vendor terms', 'Privacy policy', 'Terms of service']
  }
]

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-emerald-800">
            Shopivo
          </h2>

          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
            A curated marketplace connecting shoppers with independent
            creators and trusted brands.
          </p>
        </div>

        {columns.map(column => (
          <div key={column.title}>
            <h3 className="text-sm font-semibold text-slate-900">
              {column.title}
            </h3>

            <ul className="mt-4 space-y-3">
              {column.links.map(link => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-slate-500 transition hover:text-emerald-700"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-5 py-5 text-xs text-slate-400 lg:px-8">
          © 2026 Shopivo. All rights reserved.
        </div>
      </div>
    </footer>
  )
}