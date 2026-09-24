import { useEffect, useState } from 'react'
import { STATS, formatStat } from '../../content/site'
import { cn } from '../../lib/cn'

/** How long each stat stays up before the next one rolls in. */
const HOLD_MS = 3200

/**
 * The header's showcase: one headline stat at a time on a blackboard pill,
 * rolling to the next like a turning cube. Hovering holds the current stat.
 *
 * Every stat is also laid out invisibly in the same grid cell, so the pill is
 * always as wide as the longest one and never resizes mid-roll. Screen
 * readers get the full list once instead of an announcement every few
 * seconds.
 */
export function StatTicker({ className }: { className?: string }) {
  // `previous` is the face rolling out; null until the first roll.
  const [{ index, previous }, setFaces] = useState<{ index: number; previous: number | null }>({
    index: 0,
    previous: null,
  })
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const timer = window.setInterval(() => {
      setFaces(({ index }) => ({ index: (index + 1) % STATS.length, previous: index }))
    }, HOLD_MS)
    return () => window.clearInterval(timer)
  }, [paused])

  return (
    <div
      className={cn(
        'relative flex h-11 items-center gap-3 overflow-hidden rounded-full bg-board pr-3.5 pl-4 text-white shadow-[inset_0_-2px_0_rgb(0_0_0/0.25)] [--face-depth:1.375rem] [perspective:600px]',
        className,
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <ul className="sr-only">
        {STATS.map((stat) => (
          <li key={stat.label}>
            {formatStat(stat.value, stat.decimals ?? 0, stat.suffix)} {stat.label}
          </li>
        ))}
      </ul>

      <span aria-hidden="true" className="grid [transform-style:preserve-3d]">
        {STATS.map((stat, i) => {
          const state = i === index ? 'in' : i === previous ? 'out' : undefined
          return (
            <span
              key={stat.label}
              // No animation until the first roll, so the pill loads still.
              data-state={previous === null ? undefined : state}
              className={cn(
                'stat-face col-start-1 row-start-1 flex items-baseline gap-2 whitespace-nowrap',
                !state && 'invisible',
              )}
            >
              <span className="text-[1.0625rem] font-black tracking-[-0.02em] text-white tabular-nums">
                {formatStat(stat.value, stat.decimals ?? 0, stat.suffix)}
              </span>
              <span className="text-[0.875rem] font-medium text-white/80">{stat.label}</span>
            </span>
          )
        })}
      </span>

      {/* Which stat is up, as a row of pips. */}
      <span aria-hidden="true" className="flex items-center gap-1">
        {STATS.map((stat, i) => (
          <span
            key={stat.label}
            className={cn(
              'h-1.5 rounded-full transition-[width,background-color] duration-500',
              i === index ? 'w-3 bg-white' : 'w-1.5 bg-white/30',
            )}
          />
        ))}
      </span>
    </div>
  )
}
