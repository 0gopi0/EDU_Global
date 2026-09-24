import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalculatorSection } from '../../components/site/CampusCalculator'
import { usePageTitle } from '../../components/site/hooks'
import { MovementsSection } from '../../components/site/Movements'
import { PillarExplorer } from '../../components/site/PillarExplorer'
import { StatsBand } from '../../components/site/StatsBand'
import { Tracks } from '../../components/site/Tracks'
import { Highlights } from '../../components/site/Highlights'
import { Testimonials } from '../../components/site/Testimonials'
import { HeroLine, Section, buttonClass } from '../../components/site/ui'
import { PILLARS } from '../../content/site'

/** Phones (below Tailwind's `sm`) get the portrait cut of the hero film. */
const PHONE_QUERY = '(max-width: 639px)'

const HERO_FILMS = {
  phone: { poster: '/video/hero-mobile-poster.jpg', webm: '/video/hero-mobile.webm', mp4: '/video/hero-mobile.mp4' },
  wide: { poster: '/video/hero-poster.jpg', webm: '/video/hero.webm', mp4: '/video/hero.mp4' },
} as const

/** True while the viewport is phone-sized, tracking resizes and rotation. */
function usePhoneViewport(): boolean {
  const [phone, setPhone] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(PHONE_QUERY).matches,
  )

  useEffect(() => {
    const query = window.matchMedia(PHONE_QUERY)
    const onChange = () => setPhone(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return phone
}

/** Looping background film behind the hero copy: a portrait cut on phones,
 * the landscape one from `sm` up. Only the matching file is downloaded, and
 * crossing the breakpoint swaps it. A paper-coloured wash keeps the headline
 * legible; visitors who prefer reduced motion get the still poster frame. */
function HeroVideo() {
  const reduceMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const variant = usePhoneViewport() ? 'phone' : 'wide'
  const film = HERO_FILMS[variant]

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 motion-safe:animate-fade-in">
      {/* Keyed on the variant: a <video> only reads its <source>s once, so a
          new element is needed to switch films. */}
      <video
        key={variant}
        className="h-full w-full object-cover"
        poster={film.poster}
        autoPlay={!reduceMotion}
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={film.webm} type="video/webm" />
        <source src={film.mp4} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-paper/95 via-paper/75 to-paper/30 lg:bg-gradient-to-r lg:from-paper/95 lg:via-paper/70 lg:to-transparent" />
    </div>
  )
}

export function Home() {
  usePageTitle()

  return (
    <>
      {/* ---------------------------------------------------------------- hero */}
      <section className="relative isolate overflow-hidden bg-paper">
        <HeroVideo />
        <div className="container-site flex min-h-[min(42rem,calc(100svh-5rem))] items-center pt-16 pb-24 sm:pt-20 sm:pb-28 lg:min-h-[min(38rem,calc(100svh-6rem))] lg:pt-16 lg:pb-32">
          <div className="max-w-[34rem]">
            <p
              className="inline-flex items-center gap-2 rounded-full bg-paper/80 py-1.5 pr-3.5 pl-2.5 text-[0.8125rem] font-semibold text-board ring-1 ring-line backdrop-blur-sm motion-safe:animate-fade-in"
            >
              <span className="size-2 rounded-full bg-leaf" />
              Build. Educate. Innovate.
            </p>
            <h1 className="mt-5 font-display text-[clamp(2.5rem,1.4rem+3.4vw,4rem)] leading-[1.02] font-black tracking-[-0.03em] text-ink">
              <HeroLine delay={0.08}>Your partner,</HeroLine>
              <HeroLine delay={0.18}>
                <span className="font-brand font-extrabold tracking-[-0.005em] text-leaf">
                  EduGlobal.
                </span>
              </HeroLine>
            </h1>
            {/* A column so the pillar list can follow the buttons on phones and
                sit above them from `sm` up. */}
            <div
              className="flex flex-col motion-safe:animate-fade-in"
              style={{ animationDelay: '0.45s' }}
            >
              <ul className="mt-6 grid max-w-[26rem] grid-cols-2 gap-x-6 gap-y-3 max-sm:order-last">
                {PILLARS.map(({ id, name, shortName, icon: Icon }) => (
                  <li key={id} className="flex items-center gap-2 text-[0.875rem] font-medium text-body">
                    <Icon aria-hidden="true" className="size-4 text-leaf" strokeWidth={2.2} />
                    {shortName ?? name}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                {/* The primary action: a see-through pill with a navy border
                    and a light blue knob. The knob pulses softly at rest; on hover
                    or focus navy floods out from behind it across the pill,
                    the label turns white and the arrow tips up and away. */}
                <Link
                  to="/contact"
                  className="group relative isolate inline-flex h-14 items-center gap-4 overflow-hidden rounded-full bg-paper/40 pr-2 pl-7 max-sm:bg-transparent max-sm:backdrop-blur-none text-[1.0625rem] font-semibold whitespace-nowrap text-board ring-2 ring-board backdrop-blur-sm transition-[color,transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ring-inset hover:-translate-y-0.5 hover:text-white hover:shadow-[0_20px_36px_-16px_rgb(0_16_48/0.6)] focus-visible:text-white active:translate-y-0 active:scale-[0.98]"
                >
                  {/* The flood: a navy disc behind the knob that scales up to
                      cover the pill. */}
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 right-2 -z-10 size-10 -translate-y-1/2 rounded-full bg-board transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[12] group-focus-visible:scale-[12]"
                  />
                  Partner with us
                  <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-linear-to-br from-[#8fd3f8] to-[#55bbf3] text-ink">
                    {/* A slow halo drawing the eye at rest. */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full ring-2 ring-[#55bbf3]/70 group-hover:hidden motion-safe:animate-ping motion-safe:[animation-duration:2.4s]"
                    />
                    <ArrowRight
                      aria-hidden="true"
                      className="size-5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-45"
                    />
                  </span>
                </Link>
                <Link
                  to="/#ecosystem"
                  className={buttonClass(
                    'ctaOutline',
                    'group spark-border relative max-sm:hidden [--spark-color:var(--color-leaf)] [--spark-delay:-1.8s] hover:[--spark-color:var(--color-pencil-bright)]',
                    'lg',
                  )}
                >
                  Explore the model
                  <ArrowRight
                    aria-hidden="true"
                    className="size-[1.15rem] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StatsBand overlap />

      {/* ----------------------------------------------------------- manifesto */}
      {/* Little or no top padding: the stats card above already leaves half
          its height as space below it. On phones the section also tucks 2rem
          up into that space, so it is layered above the stats band's ground
          (z-10, later in the page) to keep its label visible. */}
      <Section id="ecosystem" tone="mist" className="relative z-10 pt-0 max-sm:-mt-8 sm:pt-6">
        {/* Title and lede share one row, so the card starts close under them. */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div>
            <p className="type-label text-leaf">The Manifesto</p>
            <h2 className="type-heading mt-3 max-w-[24ch] text-balance">
              Four chapters. One operating system for education.
            </h2>
          </div>
          <p className="max-w-[26rem] text-body max-sm:hidden lg:pb-1">
            Every EduGlobal partnership runs on the same four pillars — each one engineered,
            measured, and accountable.
          </p>
        </header>
        <div className="mt-10">
          <PillarExplorer />
        </div>
      </Section>

      {/* -------------------------------------------------------- architecture */}
      <MovementsSection />

      {/* ---------------------------------------------------------- calculator */}
      <CalculatorSection />

      <Highlights />

      <Testimonials />

      <Tracks />
    </>
  )
}
