import { cn } from '../../lib/cn'

export interface Milestone {
  year: string
  body: string
  /** Not yet reached: its card and the line leading to it are dashed. */
  planned?: boolean
}

/**
 * Years as cards along one line: across the page on wide screens, down the
 * left edge on phones. Each stop is a ringed marker; a milestone still to
 * come is hollow, dashed and tagged "Planned".
 */
export function Timeline({ milestones }: { milestones: readonly Milestone[] }) {
  return (
    <ol className="grid gap-y-4 lg:grid-cols-5 lg:gap-x-4">
      {milestones.map((milestone, index) => {
        const next = milestones[index + 1]
        return (
          <li key={milestone.year} className="relative pl-10 lg:pl-0">
            {/* The line to the next stop, from this marker's edge to the next
                one's. It is dashed where it leads into a planned year. */}
            {next ? (
              <span
                aria-hidden="true"
                className={cn(
                  'absolute top-7 -bottom-4 left-[11px] border-l-2 lg:top-[11px] lg:bottom-auto lg:left-7 lg:w-[calc(100%-0.75rem)] lg:border-t-2 lg:border-l-0',
                  next.planned ? 'border-dashed border-leaf/45' : 'border-leaf',
                )}
              />
            ) : null}
            <span
              aria-hidden="true"
              className="absolute top-0 left-0 grid size-6 place-items-center rounded-full bg-paper ring-2 ring-leaf ring-inset lg:relative"
            >
              {milestone.planned ? null : <span className="size-2.5 rounded-full bg-leaf" />}
            </span>

            <div
              className={cn(
                'rounded-2xl p-5 lg:mt-5 lg:h-[calc(100%-2.75rem)]',
                milestone.planned
                  ? 'border-2 border-dashed border-leaf/35 bg-paper/60'
                  : 'bg-paper shadow-[0_14px_30px_-24px_rgb(0_16_48/0.4)] ring-1 ring-line',
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-[clamp(1.75rem,1.3rem+1.2vw,2.25rem)] leading-none font-black tracking-[-0.03em] text-leaf">
                  {milestone.year}
                </p>
                {milestone.planned ? (
                  <span className="rounded-full bg-leaf-soft px-2.5 py-1 text-[0.75rem] font-semibold text-leaf">
                    Planned
                  </span>
                ) : null}
              </div>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-body">{milestone.body}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
