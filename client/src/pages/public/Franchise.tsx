import {
  BadgeCheck,
  BookOpen,
  Building,
  Check,
  FileCheck,
  FlaskConical,
  MonitorSmartphone,
  Ruler,
  UsersRound,
  type LucideIcon,
} from 'lucide-react'
import { useRef, type ReactNode } from 'react'
import { EnquiryForm } from '../../components/site/EnquiryForm'
import { useInView, usePageTitle } from '../../components/site/hooks'
import { PhotoBanner } from '../../components/site/PhotoBanner'
import { Section, SectionHeading } from '../../components/site/ui'

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
    title: 'Expression of Interest',
    body: 'Submit the enquiry below with your region, land/asset position, and vision.',
  },
  {
    title: 'Qualification Call',
    body: 'A structured conversation with our partnerships team within 48 hours.',
  },
  {
    title: 'Site & Market Study',
    body: 'Catchment analysis, demand mapping, and financial feasibility modelling.',
  },
  {
    title: 'Partnership Agreement',
    body: 'Transparent term sheet, investment structure, and launch timeline.',
  },
] as const

/* -------------------------------------------------------------- term sheet */

function TermRow({
  label,
  value,
  children,
}: {
  label: string
  value: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="grid gap-x-6 gap-y-1 px-6 py-6 sm:grid-cols-[1fr_auto] sm:items-baseline sm:px-8">
      <dt className="text-white/75">{label}</dt>
      <dd className="text-[1.5rem] leading-tight font-bold text-white">
        {value}
      </dd>
      {children ? (
        <dd aria-hidden="true" className="pt-4 sm:col-span-2">
          {children}
        </dd>
      ) : null}
    </div>
  )
}

/**
 * The economics as a term sheet. The two numeric terms carry a small scale:
 * the payback window on a five-year line, and the utilisation target as a
 * filled share of capacity.
 */
function TermSheet() {
  const ref = useRef<HTMLDListElement>(null)
  const shown = useInView(ref, { threshold: 0.4 })
  const grow = 'transition-[width] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]'

  return (
    <dl
      ref={ref}
      className="divide-y divide-white/12 rounded-3xl bg-board shadow-[0_30px_60px_-30px_rgb(0_16_48/0.6)]"
    >
      <TermRow label="Typical payback horizon" value="3–4 years">
        <div className="relative h-2 rounded-full bg-white/10">
          <div
            className={`absolute inset-y-0 left-[60%] rounded-full bg-[#55bbf3] ${grow}`}
            style={{ width: shown ? '20%' : '0%' }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[0.75rem] text-white/50">
          {['Year 0', '1', '2', '3', '4', '5'].map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>
      </TermRow>
      <TermRow label="Capacity utilisation target" value="85%+">
        <div className="relative h-2 rounded-full bg-white/10">
          <div
            className={`h-full rounded-full bg-[#55bbf3] ${grow}`}
            style={{ width: shown ? '85%' : '0%' }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[0.75rem] text-white/50">
          <span>0%</span>
          <span>100% of seats</span>
        </div>
      </TermRow>
      <TermRow label="Revenue share alignment" value="Performance-linked" />
      <TermRow
        label="Brand & marketing support"
        value={
          <span className="flex items-center gap-2">
            <Check aria-hidden="true" className="h-5 w-5 text-[#55bbf3]" />
            Included
          </span>
        }
      />
    </dl>
  )
}

/* ------------------------------------------------------------------- cards */

/** One piece of the offer: an icon tile, a title and a line of detail, on a
 * white card that lifts on hover. */
function FeatureCard({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return (
    <li className="group rounded-2xl bg-paper p-6 ring-1 ring-line transition-[transform,box-shadow] duration-300 ring-inset hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-26px_rgb(0_16_48/0.45)] sm:p-7">
      <span className="grid size-11 place-items-center rounded-xl bg-leaf-soft text-leaf transition-colors duration-300 group-hover:bg-leaf group-hover:text-white">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <h3 className="mt-5 text-[1.1875rem] leading-tight font-bold text-ink">{title}</h3>
      <p className="mt-2 text-[0.9375rem] leading-relaxed">{body}</p>
    </li>
  )
}

/* -------------------------------------------------------------------- page */

export function Franchise() {
  usePageTitle('Franchise Model')

  return (
    <>
      <PhotoBanner
        eyebrow="The franchise model"
        lines={['Scale a system', 'that already works.']}
        lede={
          <>
            <strong className="font-semibold text-ink">Strategic investment partnerships</strong>{' '}
            that bring a proven educational operating system — curriculum, campus, compliance, and
            community — to your region.
          </>
        }
        facts={[
          { value: '3–4 yrs', label: 'Typical payback' },
          { value: '85%+', label: 'Utilisation target' },
          { value: '48 hrs', label: 'To your first call' },
        ]}
        action={{ to: '#enquiry', label: 'Make a franchise enquiry' }}
        photos={['franchiseBuilding', 'franchiseCourtyard', 'indiaBrickCampus', 'indiaLab']}
        backdrop="indiaCampus"
      />

      <Section id="turnkey" tone="mist">
        <SectionHeading
          label="The turnkey school system"
          title="Everything a campus needs, in one partnership."
          lede="Four pieces, one partner: what it takes to open and run a campus to the EduGlobal standard."
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TURNKEY.map((item) => (
            <FeatureCard key={item.title} {...item} />
          ))}
        </ul>
      </Section>

      <Section id="economics" tone="sky">
        <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p className="type-label text-leaf">The economic model</p>
            <h2 className="type-heading mt-3 max-w-[18ch] text-balance">
              Transparent projections, aligned incentives.
            </h2>
            <p className="mt-5 max-w-[34rem] text-body max-sm:hidden">
              We invest alongside our partners. Our returns are tied to your campus performance — so
              we only win when the school wins.
            </p>
          </div>
          <div className="lg:col-span-7">
            <TermSheet />
          </div>
        </div>
      </Section>

      <Section id="facilities">
        <SectionHeading
          label="Facility modernization"
          title="Campuses parents remember from the first visit."
          lede="Labs, classrooms and spaces specified to board norms, then audited so they stay that way."
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FACILITIES.map((item) => (
            <FeatureCard key={item.title} {...item} />
          ))}
        </ul>
      </Section>

      <Section id="enquiry" tone="mist">
        <SectionHeading
          label="Partner qualification"
          title="Four steps from interest to inauguration."
          lede="Tell us about your region and your plans. Here is what happens after you send the form."
        />
        <div className="mt-10 grid gap-x-8 gap-y-10 lg:grid-cols-12">
          <ol className="lg:col-span-4">
            {STEPS.map((step, index) => (
              <li key={step.title} className="relative flex gap-4 pb-8 last:pb-0">
                {index < STEPS.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-11 bottom-1 left-5 w-0.5 -translate-x-1/2 bg-line"
                  />
                ) : null}
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-board text-[0.9375rem] font-bold text-white">
                  {index + 1}
                </span>
                <div className="pt-1.5">
                  <h3 className="text-[1.1875rem] leading-tight font-bold text-ink">{step.title}</h3>
                  <p className="mt-1.5 max-w-[34ch] text-[0.9375rem]">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="rounded-3xl bg-paper p-6 shadow-[0_24px_48px_-32px_rgb(0_16_48/0.35)] ring-1 ring-line sm:p-9 lg:col-span-8">
            <p className="type-label text-leaf">Start the conversation</p>
            <h3 className="mt-3 mb-7 text-[clamp(1.75rem,1.3rem+1.4vw,2.5rem)] leading-[1.05] font-bold tracking-[-0.02em]">
              Franchise enquiry
            </h3>
            <EnquiryForm defaultType="franchise" />
          </div>
        </div>
      </Section>
    </>
  )
}
