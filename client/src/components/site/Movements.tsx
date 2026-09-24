import { useEffect, useRef, useState } from 'react'
import { MOVEMENTS } from '../../content/site'
import { cn } from '../../lib/cn'
import { prefersReducedMotion } from './hooks'
import { Section } from './ui'

const LAST = MOVEMENTS.length - 1

/** How long the line takes to run from the first stop to the last. */
const FILL_MS = 5000

/** How much of the route must be on screen before the line starts. */
const START_RATIO = 0.35

/**
 * The five movements as one route on the light blue band. Each time the
 * route comes into view, the line runs from stop to stop and each one lights up in
 * bright blue, its icon turning white, as the line reaches it, with its card
 * brightening to match:
 * across the page on wide screens, down it on phones.
 */
function Movements() {
  const listRef = useRef<HTMLOListElement>(null)
  const segments = useRef<Array<HTMLSpanElement | null>>([])
  const [reached, setReached] = useState(-1)

  // Every time the route comes into view, the line runs from the first stop
  // to the last over FILL_MS, lighting each stop as it arrives. Once the
  // route has left the screen entirely it resets, so the next visit plays it
  // again. Reduced-motion visitors get the finished route straight away.
  useEffect(() => {
    const list = listRef.current
    if (!list) return

    let frame = 0
    let played = false

    function paint(progress: number) {
      const travelled = progress * LAST
      segments.current.forEach((segment, index) => {
        segment?.style.setProperty('--fill', String(Math.min(Math.max(travelled - index, 0), 1)))
      })
      setReached(Math.floor(travelled + 1e-6))
    }

    function play() {
      played = true
      if (prefersReducedMotion()) {
        paint(1)
        return
      }
      const began = performance.now()
      frame = requestAnimationFrame(function tick(now) {
        const progress = Math.min((now - began) / FILL_MS, 1)
        paint(progress)
        if (progress < 1) frame = requestAnimationFrame(tick)
      })
    }

    function reset() {
      cancelAnimationFrame(frame)
      played = false
      paint(0)
      setReached(-1)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        if (!entry.isIntersecting) reset()
        else if (!played && entry.intersectionRatio >= START_RATIO) play()
      },
      { threshold: [0, START_RATIO] },
    )
    observer.observe(list)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <ol ref={listRef} className="grid lg:grid-cols-5 lg:gap-4">
      {MOVEMENTS.map((movement, index) => {
        const done = index <= reached
        return (
          <li key={movement.numeral} className="relative pb-5 pl-16 last:pb-0 lg:pb-0 lg:pl-0">
            {/* The track to the next stop: from this node's edge to the
                next node's, through the centre of both. On wide screens the
                nodes sit centred over their cards, so the track starts half
                a column in. */}
            {index < LAST ? (
              <span
                aria-hidden="true"
                className="absolute top-12 bottom-0 left-6 w-0.5 -translate-x-1/2 bg-line lg:top-6 lg:bottom-auto lg:left-[calc(50%+1.5rem)] lg:h-0.5 lg:w-[calc(100%-2rem)] lg:translate-x-0 lg:-translate-y-1/2"
              >
                <span
                  ref={(node) => {
                    segments.current[index] = node
                  }}
                  className="block h-full w-full origin-top bg-azure [transform:scaleY(var(--fill,0))] lg:origin-left lg:[transform:scaleX(var(--fill,0))]"
                />
              </span>
            ) : null}

            <span
              className={cn(
                'absolute top-0 left-0 grid size-12 place-items-center rounded-full transition-[background-color,color,box-shadow] duration-500 lg:relative lg:mx-auto',
                done
                  ? 'bg-azure text-white shadow-[0_0_0_6px_rgb(0_136_240/0.16)]'
                  : 'bg-paper text-muted ring-1 ring-line ring-inset',
              )}
            >
              <movement.icon aria-hidden="true" className="size-5" strokeWidth={2.2} />
            </span>

            <div
              className={cn(
                'rounded-2xl p-5 ring-1 transition-[background-color,box-shadow] duration-500 ring-inset lg:mt-6 lg:h-[calc(100%-4.5rem)] lg:text-center',
                done
                  ? 'bg-paper ring-azure/40 shadow-[0_18px_36px_-24px_rgb(0_16_48/0.35)]'
                  : 'bg-paper/60 ring-line',
              )}
            >
              <p
                className={cn(
                  'font-accent text-[0.8125rem] font-bold transition-colors duration-500',
                  done ? 'text-leaf' : 'text-muted',
                )}
              >
                Movement {movement.numeral}
              </p>
              <h3 className="mt-1.5 text-[1.3125rem] leading-tight font-bold text-ink">
                {movement.title}
              </h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-body">
                {movement.body}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

/** The "five movements" band on the homepage. */
export function MovementsSection() {
  return (
    <Section id="partnership" tone="sky" className="relative isolate overflow-hidden">
      {/* A soft pool of light behind the heading, so the band is not a flat
          fill. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_15%_0%,rgb(255_255_255/0.8),transparent_70%)]"
      />
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <div>
          <p className="type-label text-leaf">Partnership architecture</p>
          <h2 className="type-heading mt-3 max-w-[22ch] text-balance">
            From first audit to full scale — in five movements.
          </h2>
        </div>
        <p className="max-w-[24rem] text-body max-sm:hidden lg:pb-1">
          One route for every partnership. Each movement builds on the one before it, so nothing
          launches before it is ready.
        </p>
      </header>
      <div className="mt-12 sm:mt-14">
        <Movements />
      </div>
    </Section>
  )
}
