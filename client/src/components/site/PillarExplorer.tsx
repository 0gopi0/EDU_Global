import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { PILLARS, photoProps } from '../../content/site'
import { cn } from '../../lib/cn'
import { nextTabIndex } from './hooks'
import { TextLink } from './ui'

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * The four chapters as one card: a row of tabs across the top, then the open
 * chapter's photo beside its copy. Arrow buttons under the copy step through
 * the chapters in order and wrap at either end, so a reader can page through
 * without aiming for the tabs. The tab row scrolls sideways on phones.
 */
export function PillarExplorer() {
  const [active, setActive] = useState(0)
  const tabs = useRef<Array<HTMLButtonElement | null>>([])
  const id = useId()
  const count = PILLARS.length
  const [params] = useSearchParams()
  const { key } = useLocation()
  const requested = params.get('chapter')

  // The header's Ecosystem menu links here with `?chapter=<id>`: open that
  // chapter. Keyed on the navigation too, so picking the same chapter again
  // after browsing others still reopens it.
  useEffect(() => {
    const index = PILLARS.findIndex((pillar) => pillar.id === requested)
    if (index >= 0) setActive(index)
  }, [requested, key])

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = nextTabIndex(event.key, index, count)
    if (next === null) return
    event.preventDefault()
    setActive(next)
    tabs.current[next]?.focus()
  }

  /** Steps to a neighbouring chapter and keeps its tab in view on phones,
   *  where the tab row is wider than the screen. */
  function step(delta: number) {
    const next = (active + delta + count) % count
    setActive(next)
    tabs.current[next]?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
  }

  const prev = PILLARS[(active - 1 + count) % count]!
  const next = PILLARS[(active + 1) % count]!

  return (
    <div className="overflow-hidden rounded-3xl bg-paper shadow-[0_1px_2px_rgb(0_16_48/0.06),0_24px_48px_-32px_rgb(0_16_48/0.35)] ring-1 ring-line/70">
      <div
        role="tablist"
        aria-label="The four chapters"
        className="flex overflow-x-auto border-b border-line [scrollbar-width:none] lg:grid lg:grid-cols-4 [&::-webkit-scrollbar]:hidden"
      >
        {PILLARS.map((pillar, index) => {
          const selected = index === active
          return (
            <button
              key={pillar.id}
              ref={(node) => {
                tabs.current[index] = node
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${index}`}
              aria-selected={selected}
              aria-controls={`${id}-panel-${index}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                'group relative flex shrink-0 items-center gap-3 px-5 py-4 text-left transition-colors duration-300 sm:px-6 lg:py-5',
                'not-last:border-r not-last:border-line',
                selected ? 'bg-paper' : 'bg-mist/60 hover:bg-mist',
              )}
            >
              {/* The open chapter's marker along the card's top edge. */}
              <span
                aria-hidden="true"
                className={cn(
                  'absolute inset-x-0 top-0 h-[3px] origin-left bg-leaf transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                  selected ? 'scale-x-100' : 'scale-x-0',
                )}
              />
              <span
                className={cn(
                  'grid size-10 shrink-0 place-items-center rounded-xl transition-colors duration-300',
                  selected ? 'bg-leaf text-white' : 'bg-paper text-muted group-hover:text-leaf',
                )}
              >
                <pillar.icon aria-hidden="true" className="size-5" />
              </span>
              <span>
                <span className="block text-[0.75rem] font-semibold tracking-wide text-muted tabular-nums">
                  {pad(pillar.chapter)}
                </span>
                <span
                  className={cn(
                    'block text-[1rem] leading-tight font-bold whitespace-nowrap',
                    selected ? 'text-ink' : 'text-body',
                  )}
                >
                  {pillar.name}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-12 lg:gap-10 lg:p-8">
        {/* Every photo stays mounted so switching chapters cross-fades
            instead of waiting on a download. */}
        <div
          aria-hidden="true"
          className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-mist-deep lg:col-span-5 lg:aspect-[4/3]"
        >
          {PILLARS.map((pillar, index) => (
            <img
              key={pillar.id}
              {...photoProps(pillar.photo, [800, 1200])}
              alt=""
              sizes="(min-width: 64rem) 30rem, 100vw"
              loading="lazy"
              className={cn(
                'absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
                index === active ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0',
              )}
            />
          ))}
        </div>

        <div className="flex flex-col lg:col-span-7">
          {PILLARS.map((pillar, index) => (
            <div
              key={pillar.id}
              role="tabpanel"
              id={`${id}-panel-${index}`}
              aria-labelledby={`${id}-tab-${index}`}
              hidden={index !== active}
              className="motion-safe:animate-fade-in"
            >
              <p className="type-label text-leaf">
                Chapter {pad(pillar.chapter)}{' '}
                <span className="text-muted">/ {pad(count)}</span>
              </p>
              <h3 className="type-subheading mt-3 text-balance">{pillar.headline}</h3>
              <p className="mt-4 max-w-[34rem]">{pillar.detail}</p>
              <TextLink to={pillar.link.href} className="mt-5 inline-block">
                {pillar.link.label}
              </TextLink>
            </div>
          ))}

          <div className="mt-8 flex items-center justify-between gap-4 border-t border-line pt-5 lg:mt-auto">
            <div aria-hidden="true" className="flex items-center gap-1.5">
              {PILLARS.map((pillar, index) => (
                <span
                  key={pillar.id}
                  className={cn(
                    'h-1.5 rounded-full transition-[width,background-color] duration-500',
                    index === active ? 'w-6 bg-leaf' : 'w-1.5 bg-line',
                  )}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label={`Previous chapter: ${prev.name}`}
                className="group grid size-11 place-items-center rounded-full text-ink ring-1 ring-line transition-colors duration-200 ring-inset hover:bg-board hover:text-white hover:ring-board"
              >
                <ArrowLeft
                  aria-hidden="true"
                  className="size-5 transition-transform duration-300 group-hover:-translate-x-0.5"
                />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label={`Next chapter: ${next.name}`}
                className="group grid size-11 place-items-center rounded-full bg-board text-white transition-colors duration-200 hover:bg-leaf"
              >
                <ArrowRight
                  aria-hidden="true"
                  className="size-5 transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
