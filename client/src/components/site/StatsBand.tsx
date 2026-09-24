import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { STATS, formatStat as format } from '../../content/site'
import { cn } from '../../lib/cn'
import { prefersReducedMotion, useInView } from './hooks'

/**
 * Counts up to `value` once `start` turns true. The final figure is laid out
 * invisibly underneath, so the number never changes the width of its column
 * while it runs; screen readers only ever hear the final figure.
 */
function CountUp({
  value,
  decimals = 0,
  suffix,
  start,
}: {
  value: number
  decimals?: number
  suffix: string
  start: boolean
}) {
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (!start) return
    if (prefersReducedMotion()) {
      setShown(value)
      return
    }

    const duration = 1600
    const began = performance.now()
    let frame = requestAnimationFrame(function tick(now) {
      const progress = Math.min((now - began) / duration, 1)
      setShown(value * (1 - (1 - progress) ** 3))
      if (progress < 1) frame = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(frame)
  }, [start, value])

  return (
    <span className="inline-grid">
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {format(value, decimals, suffix)}
      </span>
      <span aria-hidden="true" className="col-start-1 row-start-1">
        {format(shown, decimals, suffix)}
      </span>
      <span className="sr-only">{format(value, decimals, suffix)}</span>
    </span>
  )
}

/** Light streaks rising through the card, in two parallax layers: a dim,
 *  slow layer behind and a brighter, faster layer in front. Fixed values
 *  (rather than Math.random) keep the field deterministic across renders. */
const LINES: readonly {
  left: number
  width: number
  height: number
  opacity: number
  duration: number
  delay: number
}[] = [
  // Back layer: faint and slow.
  { left: 8, width: 1, height: 30, opacity: 0.12, duration: 22, delay: -3 },
  { left: 22, width: 1, height: 30, opacity: 0.15, duration: 26, delay: -9 },
  { left: 37, width: 1, height: 30, opacity: 0.1, duration: 19, delay: -14 },
  { left: 51, width: 1, height: 30, opacity: 0.16, duration: 24, delay: -6 },
  { left: 66, width: 1, height: 30, opacity: 0.12, duration: 20, delay: -17 },
  { left: 80, width: 1, height: 30, opacity: 0.14, duration: 27, delay: -11 },
  { left: 93, width: 1, height: 30, opacity: 0.1, duration: 18, delay: -20 },
  // Front layer: brighter and quicker.
  { left: 15, width: 2, height: 42, opacity: 0.24, duration: 12, delay: -2 },
  { left: 30, width: 2, height: 42, opacity: 0.18, duration: 14, delay: -7 },
  { left: 45, width: 2, height: 42, opacity: 0.28, duration: 10, delay: -4 },
  { left: 58, width: 2, height: 42, opacity: 0.2, duration: 13, delay: -10 },
  { left: 72, width: 2, height: 42, opacity: 0.3, duration: 11, delay: -6 },
  { left: 88, width: 2, height: 42, opacity: 0.2, duration: 15, delay: -12 },
]

/** Each streak starts just below the card's bottom edge and climbs the full
 *  height, fading out before the loop restarts. --line-travel is derived per
 *  line so every streak clears the top edge however tall it is. */
function Lines() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {LINES.map((line, index) => (
        <span
          key={index}
          className="absolute rounded-full bg-gradient-to-b from-transparent via-leaf/70 to-transparent motion-safe:animate-line-rise"
          style={
            {
              left: `${line.left}%`,
              top: '105%',
              width: `${line.width}px`,
              height: `${line.height}%`,
              animationDuration: `${line.duration}s`,
              animationDelay: `${line.delay}s`,
              '--line-travel': `${-((105 + line.height + 5) / line.height)}%`,
              '--line-opacity': line.opacity,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

/** Three wave bands along the card's lower half, stacked back to front. The
 *  back band is tallest, faintest and slowest; each band nearer the viewer is
 *  lower, brighter and quicker, and alternating directions make the layers
 *  slide past each other. Both ends of every path sit at the same height with
 *  the same slope, so two tiles side by side join without a seam. */
const WAVES: readonly {
  path: string
  height: string
  fill: string
  duration: number
  reverse?: boolean
}[] = [
  {
    path: 'M0 50 C 240 10 480 90 720 50 C 960 10 1200 90 1440 50 V120 H0 Z',
    height: '78%',
    fill: 'rgb(85 187 243 / 0.16)',
    duration: 38,
  },
  {
    path: 'M0 60 C 180 95 540 25 720 60 C 900 95 1260 25 1440 60 V120 H0 Z',
    height: '60%',
    fill: 'rgb(0 96 192 / 0.07)',
    duration: 28,
    reverse: true,
  },
  {
    path: 'M0 70 C 300 40 420 100 720 70 C 1020 40 1140 100 1440 70 V120 H0 Z',
    height: '42%',
    fill: 'rgb(85 187 243 / 0.2)',
    duration: 20,
  },
]

function Waves() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {WAVES.map((wave, index) => (
        <div
          key={index}
          className="absolute bottom-0 left-0 flex w-[200%] motion-safe:animate-wave-drift"
          style={{
            height: wave.height,
            animationDuration: `${wave.duration}s`,
            animationDirection: wave.reverse ? 'reverse' : 'normal',
          }}
        >
          {[0, 1].map((tile) => (
            <svg
              key={tile}
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
              className="h-full w-1/2 shrink-0"
            >
              <path d={wave.path} fill={wave.fill} />
            </svg>
          ))}
        </div>
      ))}
    </div>
  )
}

/**
 * The light stats card. When `overlap` is set the card translates up by
 * exactly half its own height, so exactly half of it rides over the hero
 * while the other half sits on the mist band that blends into the next
 * section — at every viewport, whatever the card's rendered height is.
 */
export function StatsBand({ overlap = false }: { overlap?: boolean }) {
  const listRef = useRef<HTMLDListElement>(null)
  const inView = useInView(listRef, { threshold: 0.5 })

  return (
    <section className="relative z-10">
      {/* The mist ground behind the card. It fills the band, so everything
          below the hero's bottom edge reads as one surface. */}
      <div aria-hidden="true" className="absolute inset-0 bg-mist" />
      <div className="container-site relative">
        <div
          className={cn(
            'relative isolate overflow-hidden rounded-2xl bg-linear-to-b from-paper via-[#f4fbff] to-sky shadow-[0_1px_2px_rgb(0_16_48/0.05),0_28px_56px_-30px_rgb(0_16_48/0.4)] ring-1 ring-line ring-inset sm:rounded-3xl',
            overlap && '-translate-y-1/2',
          )}
        >
          <Waves />
          {/* A soft white sheen from above that drifts slowly side to side. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-25%,rgb(255_255_255/0.9),transparent_62%)] motion-safe:animate-gloss-drift"
          />
          <Lines />
          <div className="relative px-3 py-3.5 sm:px-6 sm:py-7">
            <dl
              ref={listRef}
              className="grid grid-cols-2 gap-y-3 sm:grid-cols-4 sm:gap-y-6 sm:divide-x sm:divide-line"
            >
              {STATS.map((stat) => (
                <div key={stat.label} className="flex items-center justify-center gap-3.5 px-2 text-center sm:px-4 sm:text-left">
                  {/* Icons are left off on phones to keep the card short. */}
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-paper text-leaf max-sm:hidden shadow-[0_6px_14px_-8px_rgb(0_96_192/0.45)] ring-1 ring-line ring-inset">
                    <stat.icon aria-hidden="true" className="size-5" />
                  </span>
                  <div className="flex flex-col-reverse gap-0.5 sm:gap-1">
                    <dt className="font-accent text-[0.75rem] font-bold text-muted sm:text-[0.8125rem]">
                      {stat.label}
                    </dt>
                    <dd className="text-[clamp(1.375rem,1rem+1.6vw,2.25rem)] leading-none font-black tracking-[-0.03em] text-ink">
                      <CountUp
                        value={stat.value}
                        decimals={stat.decimals}
                        suffix={stat.suffix}
                        start={inView}
                      />
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
