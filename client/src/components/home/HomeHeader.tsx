import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export const HOME_NAV = [
  { label: 'Ecosystem', href: '#ecosystem' },
  { label: 'About', href: '#about' },
  { label: 'Franchise', href: '#franchise' },
  { label: 'Admissions', href: '#admissions' },
  { label: 'Contact', href: '#contact' },
] as const

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gold-500 text-sm font-bold text-ink-950">
        E
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[13px] font-bold tracking-[0.2em] text-white">EDUGLOBAL</span>
        {!compact ? (
          <span className="mt-1 text-[9px] tracking-[0.22em] text-slate-400">
            INNOVATION PVT. LTD.
          </span>
        ) : null}
      </span>
    </>
  )
}

export function HomeHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink-950/85 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-3">
          <Wordmark />
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {HOME_NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-slate-300 transition-colors hover:text-gold-400"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-gold-400 sm:inline-flex"
          >
            Partner With Us
          </a>

          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="rounded-md p-2 text-slate-300 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-ink-950 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-5 py-3 sm:px-8">
            {HOME_NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/5 py-3 text-sm text-slate-300 last:border-0 hover:text-gold-400"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex justify-center rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-ink-950"
            >
              Partner With Us
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
