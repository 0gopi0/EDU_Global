import { GraduationCap, House, ShieldCheck, Users } from 'lucide-react'
import { usePageTitle } from '../../components/site/hooks'
import { PairedComparison } from '../../components/site/PairedComparison'
import { PhotoBanner } from '../../components/site/PhotoBanner'
import { Timeline, type Milestone } from '../../components/site/Timeline'
import { Section, SectionHeading } from '../../components/site/ui'
import { VoicesGraph, type Voice } from '../../components/site/VoicesGraph'
import { STATS, formatStat } from '../../content/site'

/** Each traditional-model problem, paired with the ecosystem's answer to it. */
const GAP = [
  [
    'Curricula frozen in the last decade, detached from industry',
    'Industry-aligned, living curricula refreshed every academic cycle',
  ],
  [
    'Empty seats while parents search for quality elsewhere',
    'An admissions engine that positions, converts, and retains',
  ],
  [
    'Founders buried in operations instead of education',
    'A franchise-invested operating model that carries the load',
  ],
  [
    'Teachers, parents, and management speaking different languages',
    'One communication rhythm for the entire school community',
  ],
] as const

const VOICES: readonly Voice[] = [
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
]

const MILESTONES: readonly Milestone[] = [
  { year: '2019', body: 'EduGlobal Innovation founded in Hyderabad with a single partner school.' },
  { year: '2021', body: 'First franchise-invested campus opens; admissions engine formalised.' },
  { year: '2023', body: 'Network crosses 20 partner institutions across three states.' },
  { year: '2025', body: '360° Support platform unifies administrators, teachers, and parents.' },
  {
    year: '2026',
    body: 'Roadmap: 100 partner campuses and a national teacher-enablement academy.',
    planned: true,
  },
]

/** The three figures shown under the banner's lede. */
const HERO_FACTS = STATS.filter((stat) =>
  ['Partner schools', 'Partner retention', 'Learners impacted'].includes(stat.label),
).map((stat) => ({
  value: formatStat(stat.value, stat.decimals ?? 0, stat.suffix),
  label: stat.label,
}))

export function About() {
  usePageTitle('About')

  return (
    <>
      <PhotoBanner
        eyebrow="The EduGlobal story"
        lines={['Education, rebuilt', 'from the ground up.']}
        lede={
          <>
            <strong className="font-semibold text-ink">
              EduGlobal Innovation Private Limited exists for one reason:
            </strong>{' '}
            schools should not have to choose between academic excellence and operational survival.
            We bring both — as one ecosystem.
          </>
        }
        facts={HERO_FACTS}
        action={{ to: '/contact', label: 'Partner with us' }}
        photos={['indiaLab', 'aboutListening', 'aboutReading', 'aboutClassroom']}
        backdrop="aboutEvent"
      />

      <Section id="why" tone="mist">
        <SectionHeading
          label="Why we exist"
          title="The gap we were built to close."
          lede="Every problem in the traditional school model has an answer in ours. Hover a row to see the old way crossed out."
        />
        <div className="mt-10">
          <PairedComparison
            before="The traditional model"
            after="The EduGlobal ecosystem"
            rows={GAP}
          />
        </div>
      </Section>

      <Section id="philosophy" tone="sky">
        <SectionHeading
          label="Leadership philosophy"
          title="One community. Four voices. Zero silos."
          lede="A school works when everyone inside it rows in the same direction. Our model connects all four constituencies on a single operating rhythm."
        />
        <div className="mt-10">
          <VoicesGraph voices={VOICES} />
        </div>
      </Section>

      <Section id="journey" tone="mist">
        <SectionHeading
          label="The journey"
          title="Built year by year, school by school."
          lede="From a single partner school in Hyderabad to a network across states, and the road ahead."
        />
        <div className="mt-10">
          <Timeline milestones={MILESTONES} />
        </div>
      </Section>
    </>
  )
}
