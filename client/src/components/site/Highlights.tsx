import { HIGHLIGHTS } from '../../content/site'

/**
 * The scrolling band of what EduGlobal does: one row of icon chips. The track
 * holds the six highlights twice over, so sliding it by half its width lands
 * exactly where it started and the loop never shows a seam; the second copy
 * is hidden from screen readers. Hovering pauses the row, and it fades out
 * towards the band's edges so phrases drift in rather than being cut.
 * Reduced-motion visitors see the row standing still.
 */
export function Highlights() {
  return (
    <section
      aria-label="What we do"
      className="group relative overflow-hidden border-y border-line bg-sky py-5 sm:py-6"
    >
      <div className="relative [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max motion-safe:animate-marquee group-hover:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
              {HIGHLIGHTS.map(({ label, icon: Icon }) => (
                <li key={label} className="flex items-center">
                  <span className="flex items-center gap-2.5 px-5">
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-pencil-bright text-ink shadow-[0_6px_16px_-8px_rgb(224_160_48/0.6)]">
                      <Icon aria-hidden="true" className="size-4" strokeWidth={2.2} />
                    </span>
                    <span className="text-[clamp(1rem,0.85rem+0.45vw,1.1875rem)] font-bold whitespace-nowrap text-ink">
                      {label}
                    </span>
                  </span>
                  {/* The diamond between phrases. */}
                  <span
                    aria-hidden="true"
                    className="size-1.5 rotate-45 rounded-[1px] bg-leaf/40"
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
