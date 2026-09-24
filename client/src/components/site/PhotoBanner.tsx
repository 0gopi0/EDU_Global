import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { photoProps, type PhotoKey } from '../../content/site'
import { HeroLine, buttonClass } from './ui'

export interface BannerFact {
  value: string
  label: string
}

/**
 * The opening banner for the inner pages: full width, with the copy on the
 * left over a faint black-and-white photograph, and a two-by-two wall of
 * photographs on the right, cut on a diagonal where it meets the copy. The
 * wall is black and white; each photograph takes its colour back while the
 * pointer rests on it. On phones the wall is left off and the copy keeps the
 * faint photograph behind it.
 */
export function PhotoBanner({
  eyebrow,
  lines,
  lede,
  facts,
  action,
  photos,
  backdrop,
}: {
  eyebrow: string
  /** The headline, one entry per line. */
  lines: readonly string[]
  lede: ReactNode
  /** Up to three short figures under the lede. */
  facts?: readonly BannerFact[]
  action: { to: string; label: string }
  /** The four photographs of the wall, in reading order. */
  photos: readonly [PhotoKey, PhotoKey, PhotoKey, PhotoKey]
  /** The faint photograph behind the copy. */
  backdrop: PhotoKey
}) {
  return (
    <section className="relative isolate overflow-hidden bg-paper">
      {/* The faint photograph behind the copy, washed towards paper. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <img
          {...photoProps(backdrop, [800, 1400])}
          alt=""
          sizes="100vw"
          className="h-full w-full object-cover opacity-25 grayscale"
        />
        <div className="absolute inset-0 bg-linear-to-r from-paper via-paper/85 to-paper/40" />
      </div>

      {/* The photo wall, cut on a diagonal along its left edge. */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 hidden w-[54%] [clip-path:polygon(0_0,100%_0,100%_100%,24%_100%)] lg:block motion-safe:animate-fade-in"
      >
        <div className="grid h-full grid-cols-2 grid-rows-2 gap-1 bg-paper">
          {photos.map((key) => (
            <img
              key={key}
              {...photoProps(key, [600, 900])}
              alt=""
              sizes="28vw"
              fetchPriority="high"
              className="h-full w-full object-cover grayscale transition-[filter] duration-700 hover:grayscale-0"
            />
          ))}
        </div>
        {/* A thin brand-blue rule along the diagonal. */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-leaf/25 to-transparent to-[18%]" />
      </div>

      {/* Click-through outside the copy, so the photo wall behind it still
          answers the pointer. */}
      <div className="container-site pointer-events-none relative py-12 sm:py-16">
        <div className="pointer-events-auto max-w-[34rem] lg:max-w-[32rem]">
          <p className="text-[clamp(1.25rem,1.05rem+0.6vw,1.625rem)] font-semibold tracking-[-0.01em] text-ink motion-safe:animate-fade-in">
            {eyebrow}
          </p>
          <h1 className="mt-2 font-display text-[clamp(2.25rem,1.4rem+2.4vw,3.25rem)] leading-[1.06] font-black tracking-[-0.03em] text-leaf">
            {lines.map((line, index) => (
              <HeroLine key={line} delay={0.08 + 0.1 * index}>
                {line}
              </HeroLine>
            ))}
          </h1>
          <div className="motion-safe:animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-body">{lede}</p>
            {facts?.length ? (
              <dl className="mt-7 grid max-w-[28rem] grid-cols-3 divide-x divide-line border-y border-line py-4">
                {facts.map((fact) => (
                  // justify-end is the top in a reversed column: the figures
                  // line up even when a label wraps.
                  <div
                    key={fact.label}
                    className="flex flex-col-reverse justify-end gap-1 px-3 first:pl-0"
                  >
                    <dt className="text-[0.8125rem] leading-snug text-muted">{fact.label}</dt>
                    <dd className="text-[clamp(1.25rem,1.05rem+0.7vw,1.75rem)] leading-none font-black tracking-[-0.02em] text-ink">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {/* Outlined rather than filled on phones, like the closing banner's. */}
            <Link
              to={action.to}
              className={buttonClass(
                'primary',
                'group mt-8 max-sm:h-11 max-sm:bg-transparent max-sm:px-5 max-sm:text-[0.95rem] max-sm:text-board max-sm:ring-2 max-sm:ring-board max-sm:ring-inset max-sm:hover:bg-board max-sm:hover:text-white',
                'lg',
              )}
            >
              {action.label}
              <ArrowRight
                aria-hidden="true"
                className="size-[1.15rem] transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
