import { NavItem, Wordmark } from './HomeHeader'

const NAVIGATE = [
  { label: 'Ecosystem', href: '#ecosystem' },
  { label: 'About', href: '#about' },
  { label: 'Franchise Model', href: '/franchise' },
  { label: 'Admissions & Growth', href: '#admissions' },
  { label: 'Contact', href: '#contact' },
] as const

const HEADQUARTERS = ['xyz, Hyderabad', 'Telangana 500034'] as const

export function HomeFooter() {
  return (
    <footer id="contact" className="scroll-mt-24 border-t border-white/10 bg-ink-950">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Wordmark />
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-slate-400">
              Build. Educate. Innovate. An all-inclusive, A-to-Z educational ecosystem for
              institutions ready to scale.
            </p>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold tracking-[0.2em] text-gold-500">
              NAVIGATE
            </h3>
            <ul className="mt-5 space-y-3">
              {NAVIGATE.map((item) => (
                <li key={item.label}>
                  <NavItem
                    label={item.label}
                    href={item.href}
                    className="text-sm text-slate-400 transition-colors hover:text-gold-400"
                  />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold tracking-[0.2em] text-gold-500">
              HEADQUARTERS
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-slate-400">
              {HEADQUARTERS.map((line) => (
                <li key={line}>{line}</li>
              ))}
              <li>
                <a
                  href="mailto:support@eduglobalinnovation.in"
                  className="transition-colors hover:text-gold-400"
                >
                  support@eduglobalinnovation.in
                </a>
              </li>
              <li>
                <a href="tel:123456789" className="transition-colors hover:text-gold-400">
                  123456789
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6">
          <p className="text-xs text-slate-500">
            © 2026 EduGlobal Innovation Private Limited — Redefining Education
          </p>
        </div>
      </div>
    </footer>
  )
}
