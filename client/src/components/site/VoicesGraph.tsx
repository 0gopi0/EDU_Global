import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../lib/cn'

export interface Voice {
  icon: LucideIcon
  title: string
  body: string
}

/** Corner positions in the diagram, as percentages, in the same reading order
 * as the two-column list beside it: top row, then bottom row. */
const CORNERS = [
  [16, 16],
  [84, 16],
  [16, 84],
  [84, 84],
] as const

/** Every pair of the four voices: the four sides and both diagonals. */
const LINKS = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 2],
  [1, 3],
  [2, 3],
] as const

/**
 * "Zero silos" drawn literally: each of the four voices connected to every
 * other, around one shared rhythm. Pointing at a voice, in the diagram or
 * the list, lights up its three connections. The descriptions are always
 * visible in the cards, so the diagram is illustration only, and it is left
 * off on phones to keep the section short.
 */
export function VoicesGraph({ voices }: { voices: readonly Voice[] }) {
  const [active, setActive] = useState<number | null>(null)

  return (
    <div className="grid items-center gap-x-8 gap-y-10 lg:grid-cols-12">
      <div
        aria-hidden="true"
        onPointerLeave={() => setActive(null)}
        className="relative mx-auto aspect-square w-full max-w-[22rem] max-sm:hidden lg:col-span-5 lg:max-w-[26rem]"
      >
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          {LINKS.map(([from, to]) => {
            const lit = active === from || active === to
            const [x1, y1] = CORNERS[from]
            const [x2, y2] = CORNERS[to]
            return (
              <line
                key={`${from}-${to}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                vectorEffect="non-scaling-stroke"
                className={cn(
                  'transition-[stroke,stroke-width] duration-300',
                  lit ? 'stroke-leaf [stroke-width:2.5]' : 'stroke-line [stroke-width:1.5]',
                )}
              />
            )
          })}
        </svg>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-board px-4 py-2.5 text-center text-[0.8125rem] leading-tight font-semibold text-white">
          One operating
          <br />
          rhythm
        </div>

        {voices.map((voice, index) => {
          const [left, top] = CORNERS[index] ?? CORNERS[0]
          const lit = active === index
          return (
            <div
              key={voice.title}
              onPointerEnter={() => setActive(index)}
              style={{ left: `${left}%`, top: `${top}%` }}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            >
              <span
                className={cn(
                  'flex h-[clamp(3.5rem,11vw,4.5rem)] w-[clamp(3.5rem,11vw,4.5rem)] items-center justify-center rounded-full ring-1 transition-colors duration-300 ring-inset',
                  lit ? 'bg-leaf text-white ring-leaf' : 'bg-paper text-leaf ring-line',
                )}
              >
                <voice.icon className="h-7 w-7" />
              </span>
              <span className="absolute top-full mt-2 text-[0.875rem] font-semibold whitespace-nowrap text-ink">
                {voice.title}
              </span>
            </div>
          )
        })}
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:col-span-7 lg:col-start-6">
        {voices.map((voice, index) => {
          const lit = active === index
          return (
            <li
              key={voice.title}
              onPointerEnter={() => setActive(index)}
              onPointerLeave={() => setActive(null)}
              className={cn(
                'rounded-2xl bg-paper p-5 ring-1 transition-[box-shadow,transform] duration-300 ring-inset sm:p-6',
                lit
                  ? '-translate-y-0.5 shadow-[0_20px_40px_-26px_rgb(0_16_48/0.45)] ring-leaf'
                  : 'ring-line',
              )}
            >
              <span
                className={cn(
                  'grid size-10 place-items-center rounded-xl transition-colors duration-300',
                  lit ? 'bg-leaf text-white' : 'bg-leaf-soft text-leaf',
                )}
              >
                <voice.icon aria-hidden="true" className="size-5" />
              </span>
              <h3 className="mt-4 text-[1.1875rem] leading-tight font-bold text-ink">
                {voice.title}
              </h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed">{voice.body}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
