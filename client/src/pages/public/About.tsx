import { CircleCheck, CircleX, GraduationCap, House, ShieldCheck, Users } from 'lucide-react'
import { HomeFooter } from '../../components/home/HomeFooter'
import { HomeHeader } from '../../components/home/HomeHeader'

// Full-bleed hero photograph, matching the source design.
const HERO_IMAGE =
  'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA0MTJ8MHwxfHNlYXJjaHwyfHx0ZWFjaGVyJTIwbWVudG9yJTIwc3R1ZGVudCUyMHNjaG9vbHxlbnwwfHx8fDE3ODk3MjM3NjJ8MA&ixlib=rb-4.1.0&q=85'

const TICKER_ITEMS = [
  'TRANSFORMING INSTITUTIONS',
  'PREPARING LEARNERS',
  'FRANCHISE SCALE',
  '360° INFRASTRUCTURE',
  'IMPACTFUL CONTENT',
  'ADMISSIONS GROWTH',
] as const

const TRADITIONAL_MODEL = [
  'Curricula frozen in the last decade, detached from industry',
  'Empty seats while parents search for quality elsewhere',
  'Founders buried in operations instead of education',
  'Teachers, parents, and management speaking different languages',
] as const

const EDUGLOBAL_ECOSYSTEM = [
  'Industry-aligned, living curricula refreshed every academic cycle',
  'An admissions engine that positions, converts, and retains',
  'A franchise-invested operating model that carries the load',
  'One communication rhythm for the entire school community',
] as const

const VOICES = [
  {
    icon: ShieldCheck,
    title: 'Administrators',
    body: 'Governance dashboards, compliance frameworks, and operational playbooks that give leadership its time back.',
  },
  {
    icon: GraduationCap,
    title: 'Teachers',
    body: 'Structured pedagogy training, modern teaching aids, and classrooms designed for inquiry — not just instruction.',
  },
  {
    icon: Users,
    title: 'Students',
    body: 'Future-ready skills, mentorship, and learning environments built around how this generation actually learns.',
  },
  {
    icon: House,
    title: 'Parents',
    body: "Transparent progress communication and a genuine seat at the table in their child's education.",
  },
] as const

const TIMELINE = [
  { year: '2019', body: 'EduGlobal Innovation founded in Hyderabad with a single partner school.' },
  { year: '2021', body: 'First franchise-invested campus opens; admissions engine formalised.' },
  { year: '2023', body: 'Network crosses 20 partner institutions across three states.' },
  { year: '2025', body: '360° Support platform unifies administrators, teachers, and parents.' },
  { year: '2026', body: 'Roadmap: 100 partner campuses and a national teacher-enablement academy.' },
] as const

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-semibold tracking-[0.25em] text-gold-500 uppercase">
      {children}
    </p>
  )
}

function SectionHeading({ children }: { children: string }) {
  return (
    <h2 className="mt-6 max-w-3xl text-3xl leading-tight font-bold text-white sm:text-5xl">
      {children}
    </h2>
  )
}

export function About() {
  return (
    <div id="top" className="min-h-screen bg-ink-950 font-sans">
      <HomeHeader />

      {/* ---------------------------------------------------------------- hero */}
      <section className="relative -mt-20 flex min-h-[70vh] items-end overflow-hidden pt-32">
        <img src={HERO_IMAGE} alt="" className="absolute inset-0 h-[115%] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/30" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
          <Eyebrow>The Blueprint</Eyebrow>

          <h1 className="mt-6 text-4xl leading-[1.08] font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            <span className="block">Education, rebuilt</span>
            <span className="block">from the ground up.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed font-light text-slate-400 sm:text-lg">
            EduGlobal Innovation Private Limited exists for one reason: schools should not have to
            choose between academic excellence and operational survival. We bring both — as one
            ecosystem.
          </p>
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

      {/* --------------------------------------------------- why we exist */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <Eyebrow>Why We Exist</Eyebrow>
        <SectionHeading>The gap we were built to close.</SectionHeading>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <div className="h-full rounded-2xl bg-ink-900 p-8 ring-1 ring-white/10 sm:p-10">
            <p className="text-[11px] font-semibold tracking-[0.25em] text-slate-400 uppercase">
              The Traditional Model
            </p>

            <ul className="mt-8 space-y-5">
              {TRADITIONAL_MODEL.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-4 text-sm leading-relaxed text-slate-400 sm:text-base"
                >
                  <CircleX className="mt-0.5 h-5 w-5 shrink-0 text-red-400/70" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="h-full rounded-2xl bg-ink-800/50 p-8 ring-1 ring-gold-500/30 sm:p-10">
            <p className="text-[11px] font-semibold tracking-[0.25em] text-gold-500 uppercase">
              The EduGlobal Ecosystem
            </p>

            <ul className="mt-8 space-y-5">
              {EDUGLOBAL_ECOSYSTEM.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-4 text-sm leading-relaxed text-white sm:text-base"
                >
                  <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ leadership philosophy */}
      <section className="border-y border-white/10 bg-ink-900/40 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Eyebrow>Leadership Philosophy</Eyebrow>
          <SectionHeading>One community. Four voices. Zero silos.</SectionHeading>

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            A school works when everyone inside it rows in the same direction. Our model connects
            all four constituencies on a single operating rhythm.
          </p>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VOICES.map((voice) => (
              <article
                key={voice.title}
                className="h-full rounded-xl bg-ink-900 p-7 ring-1 ring-white/10 transition-colors hover:ring-gold-500/50"
              >
                <voice.icon className="h-7 w-7 text-gold-500" />
                <h3 className="mt-5 text-xl font-semibold text-white">{voice.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{voice.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ timeline */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <Eyebrow>The Journey</Eyebrow>
        <SectionHeading>Built year by year, school by school.</SectionHeading>

        <div className="mt-14 border-l border-white/10">
          {TIMELINE.map((entry) => (
            <div key={entry.year} className="group relative pb-12 pl-10 last:pb-0">
              <span className="absolute top-1.5 -left-[5px] h-2.5 w-2.5 rounded-full bg-gold-500 transition-transform duration-300 group-hover:scale-150" />

              <p className="text-xs font-semibold tracking-[0.3em] text-gold-500 uppercase">
                {entry.year}
              </p>
              <p className="mt-2 max-w-2xl text-xl text-white sm:text-2xl">{entry.body}</p>
            </div>
          ))}
        </div>
      </section>

      <HomeFooter />
    </div>
  )
}
