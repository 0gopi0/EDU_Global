import { ArrowRight, ImageIcon } from 'lucide-react'
import { HomeFooter } from '../../components/home/HomeFooter'
import { HomeHeader } from '../../components/home/HomeHeader'
import { RevenueCalculator } from '../../components/home/RevenueCalculator'

const TICKER_ITEMS = [
  'TRANSFORMING INSTITUTIONS',
  'PREPARING LEARNERS',
  'FRANCHISE SCALE',
  '360° INFRASTRUCTURE',
  'IMPACTFUL CONTENT',
  'ADMISSIONS GROWTH',
] as const

const CHAPTERS = [
  {
    number: '01',
    icon: '📐',
    label: 'CHAPTER 01 — IMPACTFUL CONTENT',
    title: 'Practical, industry-aligned curricula that elevate student engagement',
    body: 'Engineered with educators, benchmarked against the world, delivered classroom-ready.',
  },
  {
    number: '02',
    icon: '📈',
    label: 'CHAPTER 02 — ADMISSIONS & GROWTH',
    title: 'Targeted strategies that fix operational gaps and boost enrollment',
    body: 'Positioning, counselling systems, and a conversion engine that never sleeps.',
  },
  {
    number: '03',
    icon: '🏛️',
    label: 'CHAPTER 03 — FRANCHISE MODEL',
    title: 'Strategic investment partnerships to scale proven educational systems',
    body: 'Turnkey campuses, governance playbooks, and brand equity from day one.',
  },
  {
    number: '04',
    icon: '⚙️',
    label: 'CHAPTER 04 — 360° SUPPORT',
    title: 'End-to-end facilities and seamless communication for the entire school community',
    body: 'Administrators, teachers, parents, and students on one operating rhythm.',
  },
] as const

const STATS = [
  { value: '45+', label: 'PARTNER SCHOOLS' },
  { value: '3.4×', label: 'ENROLLMENT LIFT' },
  { value: '98%', label: 'PARTNER RETENTION' },
  { value: '12,000+', label: 'LEARNERS IMPACTED' },
] as const

const MOVEMENTS = [
  {
    numeral: 'I',
    title: 'Audit',
    body: 'Deep diagnostic of operations, admissions funnel, and academic delivery.',
  },
  {
    numeral: 'II',
    title: 'Blueprint',
    body: 'A bespoke 24-month institutional roadmap with measurable milestones.',
  },
  {
    numeral: 'III',
    title: 'Build',
    body: 'Curriculum deployment, facility upgrades, and staff enablement.',
  },
  {
    numeral: 'IV',
    title: 'Launch',
    body: 'Admissions campaigns, community open-days, and brand activation.',
  },
  {
    numeral: 'V',
    title: 'Scale',
    body: 'Franchise investment structures and multi-campus expansion.',
  },
] as const

function Eyebrow({ children }: { children: string }) {
  return <p className="text-[11px] font-semibold tracking-[0.25em] text-gold-500">{children}</p>
}

export function Home() {
  return (
    <div id="top" className="min-h-screen bg-ink-950 font-sans">
      <HomeHeader />

      {/* ---------------------------------------------------------------- hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-gold-500/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16">
          <div>
            <Eyebrow>EDUGLOBAL INNOVATION — REDEFINING EDUCATION</Eyebrow>

            <h1 className="mt-7 text-5xl leading-[0.98] font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Build.
              <br />
              <span className="text-gold-500">Educate.</span>
              <br />
              Innovate.
            </h1>

            <p className="mt-7 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
              An all-inclusive, A-to-Z educational ecosystem. We partner with schools to bridge
              operational gaps, optimize admissions, and scale success through a
              franchise-invested model.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-gold-400"
              >
                Partner With Us
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#ecosystem"
                className="inline-flex items-center rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-gold-500 hover:text-gold-400"
              >
                Explore the Model
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl ring-1 ring-white/10">
              {/* Stand-in for the design's photography — no licensed images were sourced. */}
              <div className="flex h-72 items-center justify-center bg-gradient-to-br from-ink-700 via-ink-800 to-ink-900 sm:h-96">
                <ImageIcon className="h-9 w-9 text-white/30" />
              </div>
              <div className="bg-ink-900/80 px-5 py-3.5">
                <p className="text-[10px] font-semibold tracking-[0.22em] text-slate-400">
                  MODERN ACADEMIC ARCHITECTURE
                </p>
              </div>
            </div>

            <div className="absolute -top-5 -right-3 rounded-xl bg-gold-500 px-5 py-3.5 text-center shadow-lg sm:-right-5">
              <p className="text-xl font-bold text-ink-950">45+</p>
              <p className="text-[9px] font-semibold tracking-[0.15em] text-ink-950/80">
                PARTNER SCHOOLS
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- ticker */}
      <div className="overflow-hidden border-y border-white/10 bg-ink-900/60 py-5">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {TICKER_ITEMS.map((item) => (
                <span key={item} className="flex items-center">
                  <span className="px-6 text-gold-500" aria-hidden="true">
                    ◆
                  </span>
                  <span className="text-xs font-semibold tracking-[0.2em] whitespace-nowrap text-slate-400">
                    {item}
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------- manifesto */}
      <section id="ecosystem" className="scroll-mt-24 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <Eyebrow>THE MANIFESTO</Eyebrow>

          <h2 className="mt-6 max-w-3xl text-3xl leading-tight font-bold text-white sm:text-5xl">
            Four chapters.
            <br />
            <em className="text-gold-500 italic">One operating system</em>
            <br />
            for education.
          </h2>

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Every EduGlobal partnership runs on the same four pillars — each one engineered,
            measured, and accountable.
          </p>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {CHAPTERS.map((chapter) => (
              <article
                key={chapter.number}
                className="rounded-2xl bg-ink-900 p-7 ring-1 ring-white/10 transition-colors hover:ring-gold-500/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm font-semibold text-slate-500">{chapter.number}</span>
                  <span className="text-2xl" aria-hidden="true">
                    {chapter.icon}
                  </span>
                </div>

                <p className="mt-6 text-[10px] font-semibold tracking-[0.2em] text-gold-500">
                  {chapter.label}
                </p>
                <h3 className="mt-3 text-lg leading-snug font-semibold text-white sm:text-xl">
                  {chapter.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-400">{chapter.body}</p>
              </article>
            ))}
          </div>

          <dl className="mt-14 grid grid-cols-2 gap-8 border-t border-white/10 pt-10 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="text-[10px] font-semibold tracking-[0.2em] text-slate-500">
                  {stat.label}
                </dt>
                <dd className="mt-2 text-3xl font-bold text-gold-400 sm:text-4xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* -------------------------------------------------------- architecture */}
      <section id="about" className="scroll-mt-24 border-t border-white/10 bg-ink-900/40">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <Eyebrow>PARTNERSHIP ARCHITECTURE</Eyebrow>

          <h2 className="mt-6 max-w-3xl text-3xl leading-tight font-bold text-white sm:text-5xl">
            From first audit to full scale
            <br />
            <em className="text-gold-500 italic">— in five movements.</em>
          </h2>

          <ol className="mt-14 space-y-3">
            {MOVEMENTS.map((movement) => (
              <li
                key={movement.numeral}
                className="grid gap-4 rounded-xl bg-ink-950/60 p-6 ring-1 ring-white/10 sm:grid-cols-[4rem_10rem_1fr] sm:items-baseline sm:gap-6"
              >
                <span className="text-sm font-semibold text-gold-500">{movement.numeral}</span>
                <h3 className="text-lg font-semibold text-white">{movement.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{movement.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <RevenueCalculator />
      <HomeFooter />
    </div>
  )
}
