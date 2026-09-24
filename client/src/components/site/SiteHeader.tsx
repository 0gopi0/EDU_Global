import { ChevronDown, Mail, Menu, Phone, X } from 'lucide-react'
import { useEffect, useId, useRef, useState, type FocusEvent } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { CONTACT, NAV, PILLARS, type Pillar } from '../../content/site'
import { cn } from '../../lib/cn'
import { useScrolled } from './hooks'
import { Logo } from './Logo'
import { StatTicker } from './StatTicker'
import { TextLink, buttonClass } from './ui'

/** Grace period before a hover-opened menu closes, so the pointer can cross
 * the gap between the nav item and the panel. */
const CLOSE_DELAY_MS = 140

/** Each chapter opens its own tab of the "Four chapters" section on the
 * homepage; PillarExplorer reads `chapter` to pick the tab. */
function menuHref(pillar: Pillar): string {
  return `/?chapter=${pillar.id}#ecosystem`
}

function DesktopNavLink({ href, label }: { href: string; label: string }) {
  return (
    <NavLink
      to={href}
      end
      className={({ isActive }) =>
        cn(
          'relative py-2 text-[0.975rem] font-medium transition-colors',
          isActive ? 'text-ink' : 'text-body hover:text-ink',
        )
      }
    >
      {({ isActive }) => (
        <>
          {label}
          {isActive ? (
            <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-leaf" />
          ) : null}
        </>
      )}
    </NavLink>
  )
}

export function SiteHeader() {
  const scrolled = useScrolled()
  const { key } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeTimer = useRef(0)
  const menuToggle = useRef<HTMLButtonElement>(null)
  const mobileToggle = useRef<HTMLButtonElement>(null)
  const menuId = useId()

  // Any navigation closes both menus.
  useEffect(() => {
    setMenuOpen(false)
    setMobileOpen(false)
  }, [key])

  // Escape closes whichever menu is open and hands focus back to the button
  // that opened it, rather than leaving it inside a panel that just hid.
  useEffect(() => {
    if (!menuOpen && !mobileOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (menuOpen) menuToggle.current?.focus()
      if (mobileOpen) mobileToggle.current?.focus()
      setMenuOpen(false)
      setMobileOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen, mobileOpen])

  // The mobile sheet covers the page, so the page underneath must not scroll.
  // Widening past the breakpoint hides the sheet, so it closes too.
  useEffect(() => {
    if (!mobileOpen) return
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'

    const desktop = window.matchMedia('(min-width: 64rem)')
    const onChange = () => desktop.matches && setMobileOpen(false)
    desktop.addEventListener('change', onChange)
    return () => {
      root.style.overflow = previous
      desktop.removeEventListener('change', onChange)
    }
  }, [mobileOpen])

  useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  function openMenu() {
    window.clearTimeout(closeTimer.current)
    setMenuOpen(true)
  }

  function scheduleClose() {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setMenuOpen(false), CLOSE_DELAY_MS)
  }

  function closeOnFocusOut(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setMenuOpen(false)
  }

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 border-b bg-[#fafdff]/95 backdrop-blur-md transition-[border-color,box-shadow] duration-300',
          scrolled || menuOpen
            ? 'border-line shadow-[0_10px_30px_-18px_rgb(0_16_48/0.35)]'
            : 'border-transparent',
        )}
      >
        <div className="container-site flex h-[4.5rem] items-center justify-between gap-6">
          <Link to="/" aria-label="EduGlobal Innovation home" className="rounded-lg">
            <Logo />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
            {NAV.map((item) =>
              item.href === '/' ? (
                <div
                  key={item.href}
                  className="flex items-center gap-1"
                  onMouseEnter={openMenu}
                  onMouseLeave={scheduleClose}
                  onBlur={closeOnFocusOut}
                >
                  <DesktopNavLink href={item.href} label={item.label} />
                  <button
                    ref={menuToggle}
                    type="button"
                    aria-expanded={menuOpen}
                    aria-controls={menuId}
                    aria-label="Show the four chapters"
                    onClick={() => setMenuOpen((open) => !open)}
                    className="rounded-full p-1 text-body transition-colors hover:text-ink"
                  >
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform duration-300',
                        menuOpen && 'rotate-180',
                      )}
                    />
                  </button>

                  <div
                    id={menuId}
                    inert={!menuOpen}
                    className={cn(
                      'absolute inset-x-0 top-full border-b border-line bg-paper shadow-[0_28px_50px_-30px_rgb(0_16_48/0.4)]',
                      'transition-[opacity,transform,visibility] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                      menuOpen
                        ? 'visible translate-y-0 opacity-100'
                        : 'invisible -translate-y-2 opacity-0',
                    )}
                  >
                    <div className="container-site grid gap-10 py-10 lg:grid-cols-12">
                      <div className="lg:col-span-4">
                        <p className="type-label text-leaf">The ecosystem</p>
                        <p className="type-subheading mt-3 max-w-[18ch] text-ink">
                          Four chapters. One operating system for education.
                        </p>
                        <TextLink to="/#ecosystem" className="mt-6 inline-block">
                          Explore the model
                        </TextLink>
                      </div>
                      <ul className="grid gap-1 sm:grid-cols-2 lg:col-span-8">
                        {PILLARS.map((pillar) => (
                          <li key={pillar.id}>
                            <Link
                              to={menuHref(pillar)}
                              className="flex h-full gap-4 rounded-xl p-4 transition-colors hover:bg-mist"
                            >
                              <pillar.icon className="mt-0.5 h-6 w-6 shrink-0 text-leaf" />
                              <span>
                                <span className="block font-semibold text-ink">{pillar.name}</span>
                                <span className="mt-1 block text-[0.9375rem] leading-snug text-body">
                                  {pillar.headline}
                                </span>
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <DesktopNavLink key={item.href} href={item.href} label={item.label} />
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            {/* Wrapped so `hidden` does not fight the ticker's own display. */}
            <span className="hidden sm:block">
              <StatTicker />
            </span>
            <button
              ref={mobileToggle}
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="-mr-2 rounded-full p-2 text-ink lg:hidden"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* A sibling of the header, not a child: the header's backdrop blur
          makes it the containing block for fixed descendants, which would
          shrink this sheet to the header's own height. */}
      <div
        id="mobile-nav"
        className={cn(
          'fixed inset-x-0 top-[4.5rem] bottom-0 z-40 overflow-y-auto border-t border-line bg-paper lg:hidden',
          mobileOpen ? 'block motion-safe:animate-fade-in' : 'hidden',
        )}
      >
        <nav aria-label="Main" className="container-site pt-4 pb-10">
          <ul className="divide-y divide-line border-b border-line">
            {NAV.map((item) => (
              <li key={item.href} className="py-4">
                <NavLink
                  to={item.href}
                  end
                  className={({ isActive }) =>
                    cn(
                      'block text-[1.75rem] font-bold',
                      isActive ? 'text-leaf' : 'text-ink',
                    )
                  }
                >
                  {item.label}
                </NavLink>
                {item.href === '/' ? (
                  <ul className="mt-3 grid gap-1 border-l-2 border-line pl-4">
                    {PILLARS.map((pillar) => (
                      <li key={pillar.id}>
                        <Link to={menuHref(pillar)} className="block py-1.5 text-body">
                          {pillar.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>

          <Link to="/contact" className={buttonClass('accent', 'mt-8 w-full')}>
            Partner with us
          </Link>

          <div className="mt-8 grid gap-3 text-[0.9375rem]">
            <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 text-body">
              <Mail className="h-4 w-4 text-leaf" />
              {CONTACT.email}
            </a>
            <a href={`tel:${CONTACT.phone}`} className="flex items-center gap-3 text-body">
              <Phone className="h-4 w-4 text-leaf" />
              {CONTACT.phone}
            </a>
          </div>
        </nav>
      </div>
    </>
  )
}
