import {
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Building,
  FileCheck,
  FlaskConical,
  MonitorSmartphone,
  Ruler,
  UsersRound,
} from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { HomeFooter } from '../../components/home/HomeFooter'
import { HomeHeader } from '../../components/home/HomeHeader'

// Full-bleed hero photograph, matching the source design.
const HERO_IMAGE =
  'https://images.pexels.com/photos/20657537/pexels-photo-20657537.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'

const TICKER_ITEMS = [
  'TRANSFORMING INSTITUTIONS',
  'PREPARING LEARNERS',
  'FRANCHISE SCALE',
  '360° INFRASTRUCTURE',
  'IMPACTFUL CONTENT',
  'ADMISSIONS GROWTH',
] as const

const TURNKEY = [
  {
    icon: BookOpen,
    title: 'Curriculum Licence',
    body: 'The complete EduGlobal academic framework — lesson architecture, assessments, and teacher guides.',
  },
  {
    icon: Building,
    title: 'Infrastructure Design',
    body: 'Architectural guidelines and vendor networks for compliant, future-ready campuses.',
  },
  {
    icon: FileCheck,
    title: 'Compliance & Affiliation',
    body: 'Board affiliation support, statutory documentation, and audit-readiness from day one.',
  },
  {
    icon: UsersRound,
    title: 'Staff Hiring & Training',
    body: 'Recruitment pipelines, structured onboarding, and continuous pedagogy development.',
  },
] as const

const ECONOMICS = [
  { label: 'Typical payback horizon', value: '3–4 years' },
  { label: 'Capacity utilisation target', value: '85%+' },
  { label: 'Revenue share alignment', value: 'Performance-linked' },
  { label: 'Brand & marketing support', value: 'Included' },
] as const

const FACILITIES = [
  {
    icon: FlaskConical,
    title: 'Laboratory Packages',
    body: 'Physics, chemistry, biology, and robotics labs specified, sourced, and commissioned.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Smart Classrooms',
    body: 'Interactive panels, learning-management integration, and digital content libraries.',
  },
  {
    icon: Ruler,
    title: 'Campus Architecture',
    body: 'Space-planning standards that meet board norms and elevate the parent walkthrough.',
  },
  {
    icon: BadgeCheck,
    title: 'Quality Audits',
    body: 'Scheduled facility and safety audits with documented remediation cycles.',
  },
] as const

const STEPS = [
  {
    step: '01',
    title: 'Expression of Interest',
    body: 'Submit the enquiry below with your region, land/asset position, and vision.',
  },
  {
    step: '02',
    title: 'Qualification Call',
    body: 'A structured conversation with our partnerships team within 48 hours.',
  },
  {
    step: '03',
    title: 'Site & Market Study',
    body: 'Catchment analysis, demand mapping, and financial feasibility modelling.',
  },
  {
    step: '04',
    title: 'Partnership Agreement',
    body: 'Transparent term sheet, investment structure, and launch timeline.',
  },
] as const

const ENQUIRY_TYPES = [
  'Franchise Investment Partnership',
  'School Admissions & Growth Audit',
  'Curriculum & 360° Support Inquiry',
] as const

const FIELD_LABEL =
  'mb-2 block text-[10px] font-semibold tracking-[0.25em] text-slate-400 uppercase'

const FIELD_CONTROL =
  'w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition-colors placeholder:text-slate-500 focus:border-gold-500 focus:outline-none'

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

function Ticker() {
  return (
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
  )
}

function EnquiryForm() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="rounded-2xl bg-ink-900 p-8 ring-1 ring-white/10 sm:p-10">
      <Eyebrow>Start the Conversation</Eyebrow>

      <h3 className="mt-6 text-2xl font-bold text-white">Franchise enquiry</h3>

      {submitted ? (
        <p
          role="status"
          className="mt-8 rounded-xl bg-ink-800/60 px-5 py-4 text-sm leading-relaxed text-white ring-1 ring-gold-500/40"
        >
          Thank you — your enquiry has been noted. Our partnerships team will be in touch within
          48 hours.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="franchise-enquiry-full-name" className={FIELD_LABEL}>
              Full Name
            </label>
            <input
              id="franchise-enquiry-full-name"
              name="fullName"
              required
              placeholder="Dr. Ananya Rao"
              className={FIELD_CONTROL}
            />
          </div>

          <div>
            <label htmlFor="franchise-enquiry-institution" className={FIELD_LABEL}>
              School / Organization Name
            </label>
            <input
              id="franchise-enquiry-institution"
              name="institution"
              required
              placeholder="Sunrise International School"
              className={FIELD_CONTROL}
            />
          </div>

          <div>
            <label htmlFor="franchise-enquiry-email" className={FIELD_LABEL}>
              Institutional Email
            </label>
            <input
              id="franchise-enquiry-email"
              name="email"
              type="email"
              required
              placeholder="principal@school.edu.in"
              className={FIELD_CONTROL}
            />
          </div>

          <div>
            <label htmlFor="franchise-enquiry-phone" className={FIELD_LABEL}>
              Phone Number
            </label>
            <input
              id="franchise-enquiry-phone"
              name="phone"
              type="tel"
              required
              placeholder="+91 98490 00000"
              className={FIELD_CONTROL}
            />
          </div>

          <div>
            <label htmlFor="franchise-enquiry-type" className={FIELD_LABEL}>
              Inquiry Type
            </label>
            <select
              id="franchise-enquiry-type"
              name="inquiryType"
              className={`${FIELD_CONTROL} appearance-none`}
            >
              {ENQUIRY_TYPES.map((type) => (
                <option key={type} value={type} className="bg-ink-900 text-white">
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="franchise-enquiry-location" className={FIELD_LABEL}>
              City / Region
            </label>
            <input
              id="franchise-enquiry-location"
              name="location"
              placeholder="Hyderabad"
              className={FIELD_CONTROL}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="franchise-enquiry-message" className={FIELD_LABEL}>
              Institutional Context / Requirements
            </label>
            <textarea
              id="franchise-enquiry-message"
              name="message"
              rows={5}
              placeholder="Tell us about your institution, current enrollment, and where you want to be in 24 months…"
              className={`${FIELD_CONTROL} resize-none`}
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="group inline-flex items-center gap-3 rounded-full bg-gold-500 px-8 py-4 text-xs font-semibold tracking-[0.2em] text-ink-950 uppercase transition-colors hover:bg-gold-400"
            >
              Submit Enquiry
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export function Franchise() {
  return (
    <div id="top" className="min-h-screen bg-ink-950 font-sans">
      <HomeHeader />

      {/* ---------------------------------------------------------------- hero */}
      <section className="relative -mt-20 flex min-h-[70vh] items-end overflow-hidden pt-32">
        <img src={HERO_IMAGE} alt="" className="absolute inset-0 h-[115%] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/30" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
          <Eyebrow>The Franchise Model</Eyebrow>

          <h1 className="mt-6 text-4xl leading-[1.08] font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            <span className="block">Scale a system</span>
            <span className="block">that already works.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed font-light text-slate-400 sm:text-lg">
            Strategic investment partnerships that bring a proven educational operating system —
            curriculum, campus, compliance, and community — to your region.
          </p>
        </div>
      </section>

      <Ticker />

      {/* ------------------------------------------------------------- turnkey */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <Eyebrow>The Turnkey School System</Eyebrow>
        <SectionHeading>Everything a campus needs, in one partnership.</SectionHeading>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {TURNKEY.map((item) => (
            <article
              key={item.title}
              className="h-full rounded-xl bg-ink-900 p-8 ring-1 ring-white/10 transition-colors hover:ring-gold-500/50"
            >
              <item.icon className="h-7 w-7 text-gold-500" />
              <h3 className="mt-5 text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------------- economics */}
      <section className="border-y border-white/10 bg-ink-900/40 py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl items-start gap-14 px-5 sm:px-8 lg:grid-cols-2">
          <div>
            <Eyebrow>The Economic Model</Eyebrow>
            <SectionHeading>Transparent projections, aligned incentives.</SectionHeading>

            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
              We invest alongside our partners. Our returns are tied to your campus performance —
              so we only win when the school wins.
            </p>
          </div>

          <dl className="divide-y divide-white/10 rounded-2xl bg-ink-900 ring-1 ring-white/10">
            {ECONOMICS.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-6 px-8 py-6"
              >
                <dt className="text-sm text-slate-400 sm:text-base">{row.label}</dt>
                <dd className="text-xl font-semibold text-gold-500 sm:text-2xl">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------------------------------------------------- facilities */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <Eyebrow>Facility Modernization</Eyebrow>
        <SectionHeading>Campuses parents remember from the first visit.</SectionHeading>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FACILITIES.map((item) => (
            <article
              key={item.title}
              className="h-full rounded-xl bg-ink-900 p-7 ring-1 ring-white/10 transition-colors hover:ring-gold-500/50"
            >
              <item.icon className="h-7 w-7 text-gold-500" />
              <h3 className="mt-5 text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- qualification */}
      <section className="border-t border-white/10 bg-ink-900/40 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Eyebrow>Partner Qualification</Eyebrow>
          <SectionHeading>Four steps from interest to inauguration.</SectionHeading>

          <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-10">
            <div className="border-l border-white/10">
              {STEPS.map((step) => (
                <div key={step.step} className="group relative pb-10 pl-10 last:pb-0">
                  <span className="absolute top-1.5 -left-[5px] h-2.5 w-2.5 rounded-full bg-gold-500 transition-transform duration-300 group-hover:scale-150" />

                  <p className="text-xs font-semibold tracking-[0.3em] text-gold-500 uppercase">
                    Step {step.step}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>

            <EnquiryForm />
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  )
}
