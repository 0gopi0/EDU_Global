import type { ReactNode } from 'react'
import { photoProps, type PhotoKey } from '../../content/site'
import { HeroLine } from './ui'

/**
 * Opens the inner pages: the headline across the top, the lede offset to the
 * right beneath it, then the photograph across the full column. The load
 * sequence — lines rising, the photo opening upward and settling — is the
 * one piece of unprompted motion on each page.
 */
export function PageHero({
  label,
  lines,
  lede,
  photo,
  actions,
}: {
  label: string
  lines: readonly string[]
  lede: string
  photo?: PhotoKey
  actions?: ReactNode
}) {
  return (
    <section className="bg-paper">
      <div className="container-site pt-14 pb-12 sm:pt-20 sm:pb-16 lg:pt-24">
        <p className="type-label text-leaf motion-safe:animate-fade-in">{label}</p>
        {/* Each line is its own block, so when one has to wrap on a phone,
            balancing evens out that line alone rather than the headline. */}
        <h1 className="type-title mt-5 max-w-[18ch] text-balance">
          {lines.map((line, index) => (
            <HeroLine key={line} delay={0.08 + 0.1 * index}>
              {line}
            </HeroLine>
          ))}
        </h1>
        <div className="mt-8 grid lg:mt-10 lg:grid-cols-12">
          <div
            className="motion-safe:animate-fade-in lg:col-span-6 lg:col-start-7"
            style={{ animationDelay: '0.45s' }}
          >
            <p className="type-lede max-w-[36rem]">{lede}</p>
            {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
          </div>
        </div>
      </div>

      {photo ? (
        <div className="container-site">
          <div
            className="aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-mist sm:aspect-[21/9] motion-safe:animate-reveal"
            style={{ animationDelay: '0.2s' }}
          >
            <img
              {...photoProps(photo, [800, 1600, 2400])}
              sizes="(min-width: 76rem) 72rem, 100vw"
              fetchPriority="high"
              className="h-full w-full object-cover motion-safe:animate-settle"
            />
          </div>
        </div>
      ) : null}
    </section>
  )
}
