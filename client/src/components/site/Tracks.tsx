import { ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { TRACKS, photoProps } from '../../content/site'

/**
 * Two ways in: one for investors and trusts, one for school leaders. Each is
 * a whole-card link on mist with a photo band, three points and a clear
 * action.
 */
export function Tracks() {
  return (
    <section className="bg-paper py-12">
      <div className="container-site">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div>
            <p className="type-label text-leaf">Two ways in</p>
            <h2 className="type-heading mt-3 max-w-[22ch] text-balance">
              Where would you like to start?
            </h2>
          </div>
          <p className="max-w-[26rem] text-body max-sm:hidden lg:pb-1">
            Whether you are building a network of schools or strengthening the one you lead, there
            is a path designed for you.
          </p>
        </header>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {TRACKS.map((track) => (
            <Link
              key={track.href}
              to={track.href}
              className="group flex flex-col overflow-hidden rounded-3xl bg-mist text-ink ring-1 ring-line transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ring-inset hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgb(0_16_48/0.35)]"
            >
              {/* Photo band, with the audience riding on it. */}
              <div className="relative aspect-[2/1] overflow-hidden">
                <img
                  {...photoProps(track.photo, [800, 1400])}
                  alt=""
                  sizes="(min-width: 64rem) 36rem, 100vw"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-t from-board-deep/60 to-transparent"
                />
                <span className="absolute bottom-4 left-5 inline-flex items-center gap-2 rounded-full bg-paper/95 py-1.5 pr-3.5 pl-1.5 text-[0.875rem] font-semibold text-board shadow-sm backdrop-blur-sm sm:left-7">
                  <span className="grid size-7 place-items-center rounded-full bg-pencil-bright text-ink">
                    <track.icon aria-hidden="true" className="size-4" />
                  </span>
                  {track.audience}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <h3 className="text-[clamp(1.625rem,1.2rem+1.3vw,2.25rem)] leading-[1.08] font-black tracking-[-0.025em] text-ink">
                  {track.title}
                </h3>

                <ul className="mt-5 grid gap-2.5">
                  {track.points.map((point) => (
                    <li key={point} className="flex items-center gap-2.5 text-[0.9375rem]">
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-leaf-soft text-leaf">
                        <Check aria-hidden="true" className="size-3" strokeWidth={3} />
                      </span>
                      <span className="text-body">{point}</span>
                    </li>
                  ))}
                </ul>

                <span className="mt-8 flex items-center justify-between gap-4 border-t border-line pt-5 font-semibold">
                  {track.link}
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-board text-white transition-colors duration-300 group-hover:bg-pencil-bright group-hover:text-ink">
                    <ArrowRight
                      aria-hidden="true"
                      className="size-5 transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
