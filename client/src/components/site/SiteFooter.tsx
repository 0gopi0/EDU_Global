import { ArrowRight, Clock, Mail, Phone } from 'lucide-react'
import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { CONTACT, OFFICES } from '../../content/site'
import { cn } from '../../lib/cn'
import { nextTabIndex, useInView } from './hooks'
import { Logo } from './Logo'
import { buttonClass } from './ui'

const FOOTER_NAV = [
  { label: 'Home', href: '/' },
  { label: 'Franchise Model', href: '/franchise' },
  { label: 'Admissions & Growth', href: '/admissions' },
  { label: 'Blog', href: '/blog' },
] as const

function OfficeTabs() {
  const [active, setActive] = useState(0)
  const tabs = useRef<Array<HTMLButtonElement | null>>([])
  const id = useId()
  const office = OFFICES[active] ?? OFFICES[0]

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = nextTabIndex(event.key, index, OFFICES.length)
    if (next === null) return
    event.preventDefault()
    setActive(next)
    tabs.current[next]?.focus()
  }

  return (
    <div className="mt-4">
      <div role="tablist" aria-label="Offices" className="flex gap-5 border-b border-white/15">
        {OFFICES.map((entry, index) => {
          const selected = index === active
          return (
            <button
              key={entry.city}
              ref={(node) => {
                tabs.current[index] = node
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${index}`}
              aria-selected={selected}
              aria-controls={`${id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                '-mb-px border-b-2 pb-2.5 text-[0.9375rem] font-medium transition-colors',
                selected
                  ? 'border-pencil-bright text-white'
                  : 'border-transparent text-white/55 hover:text-white/85',
              )}
            >
              {entry.city}
            </button>
          )
        })}
      </div>
      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${active}`}
        className="pt-5 text-[0.9375rem] leading-relaxed"
      >
        <p className="font-medium text-white">{office.tag}</p>
        <p className="mt-1 max-w-[30ch]">{office.address}</p>
      </div>
    </div>
  )
}

/**
 * The page-closing invitation: a blackboard card across the content width.
 * The headline's closing words draw their own underline once on scroll-in;
 * under it, one chip per kind of enquiry opens the contact form with that
 * type already chosen. On the right, a panel holds the main action and the
 * direct ways to reach us.
 */
function ClosingCta() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { threshold: 0.35 })

  return (
    <div ref={ref} className="bg-paper">
      <div className="container-site py-12">
        <div
          className={cn(
            'relative isolate grid gap-8 overflow-hidden rounded-3xl bg-linear-to-br from-paper via-[#f4fbff] to-sky px-6 py-9 shadow-[0_1px_2px_rgb(0_16_48/0.05),0_30px_60px_-34px_rgb(0_16_48/0.4)] ring-1 ring-line ring-inset sm:px-10 sm:py-11 lg:grid-cols-12 lg:items-center lg:gap-12 lg:px-12',
            inView && 'motion-safe:animate-fade-in',
          )}
        >
          {/* A lit corner and a faint blue grid, so the card is not a flat
              fill. Gold is kept to the one underline. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_80%_at_0%_0%,rgb(255_255_255/0.9),transparent_70%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgb(0_96_192/0.06)_1px,transparent_1px),linear-gradient(90deg,rgb(0_96_192/0.06)_1px,transparent_1px)] [mask-image:linear-gradient(to_left,black,transparent_75%)] bg-[size:28px_28px]"
          />

          <div className="lg:col-span-8">
            <p className="type-label text-leaf">Start the conversation</p>
            <h2 className="mt-3 max-w-[22ch] text-[clamp(1.75rem,1.2rem+1.9vw,2.75rem)] leading-[1.08] font-black tracking-[-0.025em] text-balance text-ink">
              Let’s build your institution’s{' '}
              <span className="relative inline-block text-leaf">
                next&nbsp;chapter.
                {/* Hand-drawn underline that draws itself the first time the
                    line scrolls into view. */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 300 14"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1 left-0 h-[0.18em] w-full text-pencil"
                >
                  <path
                    d="M4 10 C 60 4, 130 12, 180 7 S 270 5, 296 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    pathLength={100}
                    className={cn(inView && 'motion-safe:animate-underline-draw')}
                  />
                </svg>
              </span>
            </h2>
          </div>

          <div className="lg:col-span-4 lg:flex lg:justify-end">
            {/* On phones the button steps down: smaller, and outlined rather
                than filled, so it doesn't outweigh the headline above it. */}
            <Link
              to="/contact"
              className={buttonClass(
                'primary',
                'group max-sm:h-11 max-sm:bg-transparent max-sm:px-5 max-sm:text-[0.95rem] max-sm:text-board max-sm:ring-2 max-sm:ring-board max-sm:ring-inset max-sm:hover:bg-board max-sm:hover:text-white',
                'lg',
              )}
            >
              Partner with us
              <ArrowRight
                aria-hidden="true"
                className="size-[1.15rem] transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SiteFooter({ showCta = true }: { showCta?: boolean }) {
  return (
    <footer className="bg-board-deep text-white/70">
      {showCta ? <ClosingCta /> : null}

      <div className="container-site grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <Logo inverse />
          <p className="mt-6 max-w-[32ch] text-[0.9375rem] leading-relaxed">
            Build. Educate. Innovate. An all-inclusive, A-to-Z educational ecosystem for
            institutions ready to scale.
          </p>
        </div>

        <nav aria-label="Footer" className="lg:col-span-2">
          <p className="type-label text-white">Navigate</p>
          <ul className="mt-4 grid gap-2.5 text-[0.9375rem]">
            {FOOTER_NAV.map((item) => (
              <li key={item.href}>
                <Link to={item.href} className="transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <p className="type-label text-white">Offices</p>
          <OfficeTabs />
        </div>

        <div className="lg:col-span-3">
          <p className="type-label text-white">Reach us</p>
          <ul className="mt-4 grid gap-3 text-[0.9375rem]">
            <li>
              <a
                href={`mailto:${CONTACT.email}`}
                className="flex items-center gap-3 break-all transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 shrink-0 text-pencil-bright" />
                {CONTACT.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${CONTACT.phone}`}
                className="flex items-center gap-3 transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4 shrink-0 text-pencil-bright" />
                {CONTACT.phone}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-1 h-4 w-4 shrink-0 text-pencil-bright" />
              {CONTACT.hours}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="container-site py-6 text-[0.8125rem] text-white/45">
          © {new Date().getFullYear()} EduGlobal Innovation Private Limited — Redefining Education
        </p>
      </div>
    </footer>
  )
}
