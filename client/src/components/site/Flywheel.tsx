import type { LucideIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { cn } from '../../lib/cn'
import { useScrollProgress } from './hooks'

export interface Force {
  icon: LucideIcon
  title: string
  body: string
}

const SIZE = 400
const CENTER = SIZE / 2
const RADIUS = 148
/** Gap between neighbouring arcs, in degrees, so each force reads as its own segment. */
const GAP = 16

function point(degrees: number, radius = RADIUS): [number, number] {
  const radians = ((degrees - 90) * Math.PI) / 180
  return [CENTER + radius * Math.cos(radians), CENTER + radius * Math.sin(radians)]
}

/** A clockwise arc from `start` to `end` degrees (0 is twelve o'clock). */
function arc(start: number, end: number): string {
  const [x1, y1] = point(start)
  const [x2, y2] = point(end)
  return `M ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 0 1 ${x2} ${y2}`
}

/** An arrowhead at `degrees`, pointing clockwise along the ring. */
function arrowhead(degrees: number): string {
  const tip = point(degrees + 5)
  const outer = point(degrees - 3, RADIUS + 15)
  const inner = point(degrees - 3, RADIUS - 15)
  return `M ${outer.join(' ')} L ${tip.join(' ')} L ${inner.join(' ')} Z`
}

/**
 * The four forces as a literal flywheel: four arcs chasing each other round
 * one ring. Scrolling through the section turns the highlight from force to
 * force; pointing at a force, on the wheel or in the list, holds it there.
 */
export function Flywheel({ forces }: { forces: readonly Force[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(0)
  const [pointed, setPointed] = useState<number | null>(null)
  const active = pointed ?? scrolled
  const step = 360 / forces.length

  useScrollProgress(
    ref,
    (progress) => setScrolled(Math.min(forces.length - 1, Math.floor(progress * forces.length))),
    { line: 0.62 },
  )

  return (
    <div ref={ref} className="grid items-center gap-x-8 gap-y-14 lg:grid-cols-12">
      <div
        aria-hidden="true"
        onPointerLeave={() => setPointed(null)}
        className="relative mx-auto w-full max-w-[26rem] max-lg:order-last max-sm:hidden lg:col-span-5 lg:max-w-none"
      >
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-auto w-full overflow-visible">
          {forces.map((force, index) => {
            const start = index * step + GAP / 2
            const end = (index + 1) * step - GAP / 2
            const lit = index === active
            return (
              <g
                key={force.title}
                onPointerEnter={() => setPointed(index)}
                className={cn('transition-colors duration-500', lit ? 'text-leaf' : 'text-line')}
              >
                <path
                  d={arc(start, end - 4)}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={22}
                  strokeLinecap="round"
                />
                <path d={arrowhead(end - 4)} fill="currentColor" />
              </g>
            )
          })}
        </svg>

        {forces.map((force, index) => {
          const [x, y] = point(index * step + step / 2, RADIUS)
          const lit = index === active
          return (
            <span
              key={force.title}
              onPointerEnter={() => setPointed(index)}
              style={{ left: `${(x / SIZE) * 100}%`, top: `${(y / SIZE) * 100}%` }}
              className={cn(
                'absolute flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ring-4 ring-mist transition-colors duration-500',
                lit ? 'bg-leaf text-white' : 'bg-paper text-leaf',
              )}
            >
              <force.icon className="h-6 w-6" />
            </span>
          )
        })}

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-[1.375rem] font-bold text-ink">Admissions</p>
          <p className="mt-1 text-[0.875rem] text-muted">a system, not a season</p>
        </div>
      </div>

      <ol className="grid gap-3 lg:col-span-6 lg:col-start-7">
        {forces.map((force, index) => {
          const lit = index === active
          return (
            <li
              key={force.title}
              onPointerEnter={() => setPointed(index)}
              onPointerLeave={() => setPointed(null)}
              className={cn(
                'rounded-2xl px-6 py-5 transition-[background-color,box-shadow] duration-500',
                lit
                  ? 'bg-paper shadow-[0_1px_2px_rgb(0_16_48/0.08),0_14px_30px_-20px_rgb(0_16_48/0.35)]'
                  : 'bg-transparent',
                // Phones have no wheel to follow, so every force is a card.
                'max-sm:bg-paper max-sm:p-5 max-sm:shadow-[0_12px_28px_-22px_rgb(0_16_48/0.4)] max-sm:ring-1 max-sm:ring-line max-sm:ring-inset',
              )}
            >
              <h3 className="flex items-center gap-3 type-subheading max-sm:text-[1.125rem]">
                {/* On phones the icon sits in a tile, like the other cards. */}
                <span className="shrink-0 max-sm:grid max-sm:size-10 max-sm:place-items-center max-sm:rounded-xl max-sm:bg-leaf-soft">
                  <force.icon
                    aria-hidden="true"
                    className={cn(
                      'h-6 w-6 transition-colors max-sm:size-5 max-sm:text-leaf',
                      lit ? 'text-leaf' : 'text-muted',
                    )}
                  />
                </span>
                {force.title}
              </h3>
              <p className="mt-2 pl-9 max-sm:mt-3 max-sm:pl-0 max-sm:text-[0.9375rem]">{force.body}</p>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
