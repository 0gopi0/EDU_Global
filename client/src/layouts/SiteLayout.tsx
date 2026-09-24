import { Outlet, useMatches } from 'react-router-dom'
import { SiteFooter } from '../components/site/SiteFooter'
import { SiteHeader } from '../components/site/SiteHeader'

/** Route `handle` for pages that end in their own enquiry form, where the
 * footer's "Partner with us" block would repeat it. */
export interface SiteRouteHandle {
  footerCta?: boolean
}

/** Header, page and footer for every public page, blog included. */
export function SiteLayout() {
  const matches = useMatches()
  const showCta = !matches.some(
    (match) => (match.handle as SiteRouteHandle | undefined)?.footerCta === false,
  )

  return (
    <div className="site flex min-h-full flex-col antialiased">
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-ink px-5 py-3 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <SiteFooter showCta={showCta} />
    </div>
  )
}
