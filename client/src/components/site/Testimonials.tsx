import { ArrowLeft, ArrowRight, Quote } from 'lucide-react'
import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { PILLARS, TESTIMONIALS } from '../../content/site'
import { cn } from '../../lib/cn'
import { nextTabIndex, prefersReducedMotion } from './hooks'
import { Section } from './ui'

/** How long each quote stays up before the next one takes over. */
const HOLD_MS = 7000

/** Horizontal drag, in pixels, that counts as a swipe. */
const SWIPE_PX = 48

const pad = (n: number) => String(n).padStart(2, '0')

function pillarOf(id: string) {
  return PILLARS.find((pillar) => pillar.id === id) ?? PILLARS[0]!
}

/**
 * Partner voices: one featured quote beside a list of everyone speaking.
 * Arrows (and the keyboard arrows, and a swipe on touch screens) step
 * through the quotes; the list jumps straight to one. A timer bar along the
 * card's foot advances the quote when it fills, and pauses while the pointer
 * or focus is inside. Reduced-motion visitors get no timer and move through
 * the quotes by hand.
 */
function Carousel() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [autoplay] = useState(() => !prefersReducedMotion())
  const tabs = useRef<Array<HTMLButtonElement | null>>([])
  const swipeFrom = useRef<number | null>(null)
  const id = useId()
  const count = TESTIMONIALS.length

  const go = (index: number) => setActive((index + count) % count)
  // Relative steps read the latest index, so quick repeated clicks each count.
  const step = (delta: number) => setActive((current) => (current + delta + count) % count)
  const testimonial = TESTIMONIALS[active]!
  const pillar = pillarOf(testimonial.pillar)

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = nextTabIndex(event.key, index, count)
    if (next === null) return
    event.preventDefault()
    go(next)
    tabs.current[next]?.focus()
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse') swipeFrom.current = event.clientX
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (swipeFrom.current === null) return
    const distance = event.clientX - swipeFrom.current
    swipeFrom.current = null
    if (Math.abs(distance) >= SWIPE_PX) step(distance < 0 ? 1 : -1)
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Partner testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false)
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="font-accent text-[0.9375rem] font-bold text-ink tabular-nums">
          {pad(active + 1)} <span className="text-muted">/ {pad(count)}</span>
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous testimonial"
            className="group grid size-11 place-items-center rounded-full bg-paper text-ink ring-1 ring-line transition-colors duration-200 ring-inset hover:bg-board hover:text-white hover:ring-board"
          >
            <ArrowLeft
              aria-hidden="true"
              className="size-5 transition-transform duration-300 group-hover:-translate-x-0.5"
            />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next testimonial"
            className="group grid size-11 place-items-center rounded-full bg-board text-white transition-colors duration-200 hover:bg-leaf"
          >
            <ArrowRight
              aria-hidden="true"
              className="size-5 transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-12">
        {/* The featured quote. */}
        <div
          role="tabpanel"
          id={`${id}-panel`}
          aria-labelledby={`${id}-tab-${active}`}
          aria-live={autoplay && !paused ? 'off' : 'polite'}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (swipeFrom.current = null)}
          className="relative flex touch-pan-y flex-col overflow-hidden rounded-3xl bg-paper p-6 shadow-[0_1px_2px_rgb(0_16_48/0.06),0_24px_48px_-32px_rgb(0_16_48/0.35)] ring-1 ring-line/70 select-none sm:p-9 lg:col-span-8"
        >
          <Quote
            aria-hidden="true"
            className="absolute -top-3 right-5 size-36 -scale-x-100 text-leaf-soft sm:right-8"
            strokeWidth={1.25}
          />

          <figure key={active} className="relative flex flex-1 flex-col motion-safe:animate-fade-in">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-leaf-soft py-1 pr-3 pl-1.5 text-[0.8125rem] font-semibold text-board">
              <span className="grid size-6 place-items-center rounded-full bg-leaf text-white">
                <pillar.icon aria-hidden="true" className="size-3.5" />
              </span>
              {pillar.name}
            </span>
            <blockquote className="mt-6 text-[clamp(1.1875rem,0.95rem+0.8vw,1.625rem)] leading-snug font-semibold tracking-[-0.01em] text-balance text-ink">
              “{testimonial.quote}”
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-3 border-t border-line pt-6 lg:mt-auto">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-board text-pencil-bright">
                <pillar.icon aria-hidden="true" className="size-5" />
              </span>
              <span>
                <span className="block font-bold text-ink">{testimonial.role}</span>
                <span className="block text-[0.9375rem] text-muted">{testimonial.org}</span>
              </span>
            </figcaption>
          </figure>

          {/* The timer. It restarts with each quote, freezes while paused,
              and moves the carousel on when it fills. */}
          {autoplay ? (
            <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-mist">
              <span
                key={active}
                onAnimationEnd={() => step(1)}
                className="block h-full origin-left bg-leaf"
                style={{
                  animation: `progress-fill ${HOLD_MS}ms linear both`,
                  animationPlayState: paused ? 'paused' : 'running',
                }}
              />
            </span>
          ) : null}
        </div>

        {/* Everyone speaking. Picks a quote directly. */}
        <div
          role="tablist"
          aria-label="Choose a testimonial"
          aria-orientation="vertical"
          className="hidden flex-col gap-2 lg:col-span-4 lg:flex"
        >
          {TESTIMONIALS.map((item, index) => {
            const selected = index === active
            const itemPillar = pillarOf(item.pillar)
            return (
              <button
                key={index}
                ref={(node) => {
                  tabs.current[index] = node
                }}
                type="button"
                role="tab"
                id={`${id}-tab-${index}`}
                aria-selected={selected}
                aria-controls={`${id}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => go(index)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
                className={cn(
                  'group flex flex-1 items-center gap-3.5 rounded-2xl px-4 py-3.5 text-left ring-1 transition-[background-color,box-shadow,color] duration-300 ring-inset',
                  selected
                    ? 'bg-board text-white ring-board shadow-[0_18px_30px_-20px_rgb(0_16_48/0.6)]'
                    : 'bg-paper/70 text-ink ring-line/70 hover:bg-paper',
                )}
              >
                <span
                  className={cn(
                    'grid size-10 shrink-0 place-items-center rounded-full transition-colors duration-300',
                    selected ? 'bg-pencil-bright text-ink' : 'bg-leaf-soft text-leaf',
                  )}
                >
                  <itemPillar.icon aria-hidden="true" className="size-[1.125rem]" />
                </span>
                <span className="min-w-0">
                  <span className="block font-bold">{item.role}</span>
                  <span
                    className={cn(
                      'block truncate text-[0.875rem]',
                      selected ? 'text-white/70' : 'text-muted',
                    )}
                  >
                    {item.org}
                  </span>
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className={cn(
                    'ml-auto size-4 shrink-0 transition-[opacity,transform] duration-300',
                    selected
                      ? 'text-pencil-bright opacity-100'
                      : 'opacity-0 group-hover:translate-x-0.5 group-hover:opacity-60',
                  )}
                />
              </button>
            )
          })}
        </div>
      </div>

      {/* On phones the list is hidden, so dots stand in for it. */}
      <div className="mt-5 flex justify-center gap-1.5 lg:hidden">
        {TESTIMONIALS.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => go(index)}
            aria-label={`Show testimonial ${index + 1}`}
            aria-current={index === active}
            className="grid h-6 place-items-center px-0.5"
          >
            <span
              className={cn(
                'block h-1.5 rounded-full transition-[width,background-color] duration-500',
                index === active ? 'w-6 bg-leaf' : 'w-1.5 bg-line',
              )}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

/** The partner voices band on the Home page. */
export function Testimonials() {
  return (
    <Section id="voices" tone="mist">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <div>
          <p className="type-label text-leaf">Partner voices</p>
          <h2 className="type-heading mt-3 max-w-[22ch] text-balance">
            In their words: what changes when schools partner with us.
          </h2>
        </div>
        <p className="max-w-[26rem] text-body max-sm:hidden lg:pb-1">
          Principals, trustees and teachers on the difference a single operating rhythm makes.
        </p>
      </header>
      <div className="mt-10">
        <Carousel />
      </div>
    </Section>
  )
}
