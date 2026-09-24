import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Funnel,
  Megaphone,
  MessagesSquare,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Flywheel, type Force } from '../../components/site/Flywheel'
import { usePageTitle } from '../../components/site/hooks'
import { PairedComparison } from '../../components/site/PairedComparison'
import { PhotoBanner } from '../../components/site/PhotoBanner'
import { Section, SectionHeading, TextLink, buttonClass } from '../../components/site/ui'
import { STATS, formatStat } from '../../content/site'

const AUDIT_HREF = '/contact?type=admissions#enquiry'

const FORCES: readonly Force[] = [
  {
    icon: Megaphone,
    title: 'Digital Positioning',
    body: 'A sharp institutional narrative, local search dominance, and campaigns that reach the right parents at decision time.',
  },
  {
    icon: MessagesSquare,
    title: 'Parent Counselling',
    body: 'Trained counsellors, scripted walkthroughs, and a campus visit experience engineered to convert.',
  },
  {
    icon: Funnel,
    title: 'Conversion CRM',
    body: 'Every enquiry tracked, followed up, and nurtured — no lead lost to a spreadsheet or a busy front desk.',
  },
  {
    icon: CalendarDays,
    title: 'Community Open-Days',
    body: 'Showcase events that turn neighbourhoods into advocates and classrooms into proof.',
  },
]

/** Each symptom before the audit, paired with what replaces it. */
const DIAGNOSIS = [
  ['Admissions driven by word-of-mouth alone', 'A predictable, measurable enrolment pipeline'],
  ['Front desk juggling calls with no tracking', 'Every enquiry logged, scored, and followed up'],
  ['Fee discounts as the only closing lever', 'Value-led counselling that protects fee integrity'],
  [
    'Empty seats discovered after the session starts',
    'Demand forecast before the academic year begins',
  ],
] as const

const PROTOCOLS = [
  {
    title: 'Weekly Parent Pulse',
    body: 'Structured communication cadence — progress notes, event invites, and open channels that build trust before admission season.',
  },
  {
    title: 'Alumni & Referral Engine',
    body: 'Formal referral programs that turn satisfied families into your most credible marketing channel.',
  },
  {
    title: 'Neighbourhood Partnerships',
    body: 'Tie-ups with local communities, corporates, and pre-schools that feed the admissions funnel year-round.',
  },
] as const

/** The figures under the banner's lede. */
const HERO_FACTS = STATS.filter((stat) =>
  ['Enrollment lift', 'Partner retention', 'Partner schools'].includes(stat.label),
).map((stat) => ({
  value: formatStat(stat.value, stat.decimals ?? 0, stat.suffix),
  label: stat.label,
}))

export function Admissions() {
  usePageTitle('Admissions & Growth')

  return (
    <>
      <PhotoBanner
        eyebrow="Admissions & growth"
        lines={['Fix the gaps.', 'Fill the seats.']}
        lede={
          <>
            <strong className="font-semibold text-ink">Targeted strategies</strong> that bridge
            operational gaps and turn admissions from an annual scramble into a year-round,
            measurable growth engine.
          </>
        }
        facts={HERO_FACTS}
        action={{ to: AUDIT_HREF, label: 'Book a growth audit' }}
        photos={['indiaFullClass', 'indiaAssembly', 'indiaSupport', 'indiaActivity']}
        backdrop="aboutClassroom"
      />

      <Section id="flywheel" tone="mist">
        <SectionHeading
          label="The enrollment flywheel"
          title="Four forces, spinning all year."
          lede="Admissions is not a season. It is a system — and each of these four pillars keeps it turning."
        />
        <div className="mt-10">
          <Flywheel forces={FORCES} />
        </div>
      </Section>

      <Section id="diagnosis">
        <SectionHeading
          label="Operational gap diagnosis"
          title="Before the audit. After the ecosystem."
          lede="The symptoms we see most often, and what replaces each one once the system is in place."
        />
        <div className="mt-10">
          <PairedComparison
            before="Before EduGlobal"
            after="After EduGlobal"
            rows={DIAGNOSIS}
            beforeIcon={ArrowDown}
            afterIcon={ArrowUpRight}
          />
        </div>
      </Section>

      <Section id="protocols" tone="sky">
        <SectionHeading
          label="Community protocols"
          title="Engagement that compounds."
          lede="Three habits that keep families close all year, so the next admission season starts warm."
        />
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {PROTOCOLS.map((protocol, index) => (
            <li
              key={protocol.title}
              className="group rounded-2xl bg-paper p-6 ring-1 ring-line transition-[transform,box-shadow] duration-300 ring-inset hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-26px_rgb(0_16_48/0.45)] sm:p-7"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-leaf-soft font-accent text-[1rem] font-bold text-leaf transition-colors duration-300 group-hover:bg-leaf group-hover:text-white">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-5 text-[1.1875rem] leading-tight font-bold text-ink">
                {protocol.title}
              </h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed">{protocol.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-line pt-8">
          <Link
            to={AUDIT_HREF}
            className={buttonClass(
              'primary',
              'group max-sm:h-11 max-sm:bg-transparent max-sm:px-5 max-sm:text-[0.95rem] max-sm:text-board max-sm:ring-2 max-sm:ring-board max-sm:ring-inset max-sm:hover:bg-board max-sm:hover:text-white',
              'lg',
            )}
          >
            Book a growth audit
            <ArrowRight
              aria-hidden="true"
              className="size-[1.15rem] transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
          <p className="text-muted">
            Or <TextLink to="/#diagnostic">run the numbers on your own campus</TextLink> first.
          </p>
        </div>
      </Section>
    </>
  )
}
