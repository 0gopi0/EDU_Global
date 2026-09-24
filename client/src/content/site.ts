import {
  BookOpen,
  Building2,
  DraftingCompass,
  GraduationCap,
  HeartHandshake,
  Hammer,
  Landmark,
  LifeBuoy,
  Network,
  Orbit,
  Rocket,
  School,
  ScanSearch,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'

/* ------------------------------------------------------------------ photos */

type PhotoSource = { provider: 'unsplash' | 'pexels'; id: string; alt: string }

const PHOTOS = {
  architecture: {
    provider: 'unsplash',
    id: '1665860817333-a61810b54278',
    alt: 'Concrete staircase inside a modern academic building',
  },
  library: {
    provider: 'pexels',
    id: '9159042',
    alt: 'A teacher guiding students at their laptops in a school library',
  },
  collaboration: {
    provider: 'unsplash',
    id: '1531545514256-b1400bc00f31',
    alt: 'Students and a mentor gathered around a laptop',
  },
  campus: {
    provider: 'pexels',
    id: '20657537',
    alt: 'A sunlit classroom with rows of desks and floor-to-ceiling windows',
  },
  classroom: {
    provider: 'unsplash',
    id: '1509062522246-3755977927d7',
    alt: 'Children working at their desks in a busy classroom',
  },
  lecture: {
    provider: 'unsplash',
    id: '1571260899304-425eee4c7efc',
    alt: 'Students taking notes during a class',
  },
  // Indian schools, for the four chapters on the homepage.
  indiaActivity: {
    provider: 'pexels',
    id: '31864392',
    alt: 'Three children in red school uniforms working together on a classroom activity in Patiala',
  },
  indiaAssembly: {
    provider: 'pexels',
    id: '28389291',
    alt: 'Rows of schoolboys in uniform seated at a school assembly',
  },
  indiaCampus: {
    provider: 'pexels',
    id: '39112161',
    alt: 'Aerial view of a school building and its morning assembly on the lawns in Jaipur',
  },
  // Indian school, for the About page.
  indiaLab: {
    provider: 'pexels',
    id: '35551044',
    alt: 'A teacher leading a biology lesson with anatomy models in a well-equipped school lab',
  },
  aboutListening: {
    provider: 'pexels',
    id: '3231358',
    alt: 'Senior schoolgirls in uniform listening closely in class',
  },
  aboutReading: {
    provider: 'unsplash',
    id: '1692269725827-699e04a11cdf',
    alt: 'Two schoolboys reading a book together at their desk',
  },
  aboutClassroom: {
    provider: 'pexels',
    id: '18012456',
    alt: 'Young students in blue uniforms at their desks in a classroom',
  },
  aboutEvent: {
    provider: 'pexels',
    id: '28389321',
    alt: 'Schoolchildren gathered at a school cultural event',
  },
  // Indian campuses, for the Franchise page.
  franchiseBuilding: {
    provider: 'pexels',
    id: '20200756',
    alt: 'A modern multi-storey academic building with open galleries',
  },
  franchiseCourtyard: {
    provider: 'pexels',
    id: '11519974',
    alt: 'Students filling the courtyard of a large school building',
  },
  // Indian schools, for the two tracks.
  indiaBrickCampus: {
    provider: 'unsplash',
    id: '1786013522160-00ac876da3ab',
    alt: 'A modern red-brick school campus building with trees and a basketball court',
  },
  indiaFullClass: {
    provider: 'unsplash',
    id: '1709290749293-c6152a187b14',
    alt: 'A teacher walking between rows of students at their desks in a bright, full classroom',
  },
  indiaSupport: {
    provider: 'pexels',
    id: '18870256',
    alt: 'A teacher helping two students with their work in a bright, modern classroom',
  },
  // Question-mark concept, for the Contact FAQ.
  faqChalk: {
    provider: 'pexels',
    id: '356079',
    alt: 'Question mark drawn in chalk on a blackboard',
  },
} satisfies Record<string, PhotoSource>

export type PhotoKey = keyof typeof PHOTOS

/** CDN URL for a photo at a given width. Both CDNs resize on the fly. */
function photoUrl(key: PhotoKey, width: number): string {
  const photo: PhotoSource = PHOTOS[key]
  return photo.provider === 'unsplash'
    ? `https://images.unsplash.com/photo-${photo.id}?auto=format&fit=crop&w=${width}&q=78`
    : `https://images.pexels.com/photos/${photo.id}/pexels-photo-${photo.id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`
}

/** `src`, `srcSet` and `alt` for an <img>, so the browser picks a size. */
export function photoProps(key: PhotoKey, widths: readonly number[] = [800, 1400, 2000]) {
  return {
    src: photoUrl(key, widths[1] ?? widths[0] ?? 1400),
    srcSet: widths.map((width) => `${photoUrl(key, width)} ${width}w`).join(', '),
    alt: PHOTOS[key].alt,
  }
}

/* ----------------------------------------------------------------- company */

export const CONTACT = {
  email: 'support@eduglobalinnovation.in',
  phone: '123456789',
  hours: 'Monday – Saturday, 09:30 – 18:30 IST',
} as const

export const OFFICES = [
  {
    city: 'Hyderabad',
    tag: 'Headquarters',
    address: '4th Floor, Meridian Towers, Banjara Hills, Hyderabad, Telangana 500034',
  },
  {
    city: 'Bengaluru',
    tag: 'South Region',
    address: '2nd Floor, Innovator Block, Koramangala, Bengaluru, Karnataka 560095',
  },
  {
    city: 'Mumbai',
    tag: 'West Region',
    address: 'WeWork Enam Sambhav, Bandra Kurla Complex, Mumbai, Maharashtra 400051',
  },
] as const

/* ------------------------------------------------------------- the model */

export interface Pillar {
  id: string
  chapter: number
  name: string
  /** A shorter name for tight spots, such as the hero's list. */
  shortName?: string
  icon: LucideIcon
  headline: string
  detail: string
  photo: PhotoKey
  link: { href: string; label: string }
}

/** The four chapters every partnership runs on. `id` is also the `chapter`
 * the header menu passes to open one on the homepage. */
export const PILLARS: readonly Pillar[] = [
  {
    id: 'impactful-content',
    chapter: 1,
    name: 'Impactful Content',
    icon: BookOpen,
    headline: 'Practical, industry-aligned curricula that elevate student engagement',
    detail: 'Engineered with educators, benchmarked against the world, delivered classroom-ready.',
    photo: 'indiaActivity',
    link: { href: '/contact?type=support#enquiry', label: 'Ask about curriculum' },
  },
  {
    id: 'admissions-growth',
    chapter: 2,
    name: 'Admissions & Growth',
    shortName: 'Admissions',
    icon: TrendingUp,
    headline: 'Targeted strategies that fix operational gaps and boost enrollment',
    detail: 'Positioning, counselling systems, and a conversion engine that never sleeps.',
    photo: 'indiaAssembly',
    link: { href: '/admissions', label: 'Explore admissions & growth' },
  },
  {
    id: 'franchise-model',
    chapter: 3,
    name: 'Franchise Model',
    icon: Building2,
    headline: 'Strategic investment partnerships to scale proven educational systems',
    detail: 'Turnkey campuses, governance playbooks, and brand equity from day one.',
    photo: 'indiaCampus',
    link: { href: '/franchise', label: 'Explore the franchise model' },
  },
  {
    id: '360-support',
    chapter: 4,
    name: '360° Support',
    icon: LifeBuoy,
    headline: 'End-to-end facilities and seamless communication for the entire school community',
    detail: 'Administrators, teachers, parents, and students on one operating rhythm.',
    photo: 'indiaSupport',
    link: { href: '/contact?type=support#enquiry', label: 'Ask about 360° support' },
  },
]

export interface Stat {
  icon: LucideIcon
  value: number
  decimals?: number
  suffix: string
  label: string
}

export const STATS: readonly Stat[] = [
  { icon: School, value: 45, suffix: '+', label: 'Partner schools' },
  { icon: TrendingUp, value: 3.4, decimals: 1, suffix: '×', label: 'Enrollment lift' },
  { icon: HeartHandshake, value: 98, suffix: '%', label: 'Partner retention' },
  { icon: GraduationCap, value: 12000, suffix: '+', label: 'Learners impacted' },
]

/** A stat as displayed: Indian digit grouping plus its suffix ("12,000+"). */
export function formatStat(value: number, decimals: number, suffix: string): string {
  return (
    value.toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) + suffix
  )
}

export const MOVEMENTS = [
  {
    numeral: 'I',
    title: 'Audit',
    icon: ScanSearch,
    body: 'Deep diagnostic of operations, admissions funnel, and academic delivery.',
  },
  {
    numeral: 'II',
    title: 'Blueprint',
    icon: DraftingCompass,
    body: 'A bespoke 24-month institutional roadmap with measurable milestones.',
  },
  {
    numeral: 'III',
    title: 'Build',
    icon: Hammer,
    body: 'Curriculum deployment, facility upgrades, and staff enablement.',
  },
  {
    numeral: 'IV',
    title: 'Launch',
    icon: Rocket,
    body: 'Admissions campaigns, community open-days, and brand activation.',
  },
  {
    numeral: 'V',
    title: 'Scale',
    icon: Network,
    body: 'Franchise investment structures and multi-campus expansion.',
  },
] as const

export interface Track {
  audience: string
  icon: LucideIcon
  title: string
  /** What this path brings, in three short points. */
  points: readonly string[]
  link: string
  href: string
  photo: PhotoKey
}

export const TRACKS: readonly Track[] = [
  {
    audience: 'For investors & trusts',
    icon: Building2,
    title: 'Scale a proven school system',
    points: ['Turnkey campuses', 'Governance playbooks', 'Brand equity from day one'],
    link: 'Explore the franchise model',
    href: '/franchise',
    photo: 'indiaBrickCampus',
  },
  {
    audience: 'For school leaders',
    icon: GraduationCap,
    title: 'Fill every seat you have',
    points: ['Sharper positioning', 'Counselling systems', 'A conversion engine that never sleeps'],
    link: 'Explore admissions & growth',
    href: '/admissions',
    photo: 'indiaFullClass',
  },
]

/** What EduGlobal does, in six short phrases, for the scrolling band. */
export const HIGHLIGHTS: readonly { label: string; icon: LucideIcon }[] = [
  { label: 'Transforming Institutions', icon: Landmark },
  { label: 'Preparing Learners', icon: GraduationCap },
  { label: 'Franchise Scale', icon: Building2 },
  { label: '360° Infrastructure', icon: Orbit },
  { label: 'Impactful Content', icon: BookOpen },
  { label: 'Admissions Growth', icon: TrendingUp },
]

/* ------------------------------------------------------------ testimonials */

export interface Testimonial {
  quote: string
  /** Who is speaking, by role. */
  role: string
  /** Their institution and city. */
  org: string
  /** The pillar the partnership ran on; its icon and name tag the quote. */
  pillar: Pillar['id']
}

/**
 * PLACEHOLDER COPY. These quotes are samples written to show the layout; no
 * partner said them. Replace every entry with a real, approved testimonial
 * (and the speaker's permission to be named) before the site goes live.
 */
export const TESTIMONIALS: readonly Testimonial[] = [
  {
    quote:
      'The audit showed us where our admissions funnel was leaking. Within one cycle, our counselling team had a process they actually follow, and our seats reflected it.',
    role: 'Principal',
    org: 'Partner school, Hyderabad',
    pillar: 'admissions-growth',
  },
  {
    quote:
      'We wanted to open a second campus without reinventing everything. The franchise playbook gave us governance, hiring and brand standards from the first day.',
    role: 'Managing Trustee',
    org: 'Education trust, Bengaluru',
    pillar: 'franchise-model',
  },
  {
    quote:
      'Our teachers finally have a curriculum that is classroom-ready. Lesson plans, assessments and resources arrive together, so time goes into teaching.',
    role: 'Academic Director',
    org: 'Partner school, Mumbai',
    pillar: 'impactful-content',
  },
  {
    quote:
      'Parents, teachers and the office used to work from different information. Now everyone is on the same rhythm, and parents tell us they feel heard.',
    role: 'School Administrator',
    org: 'Partner school, Hyderabad',
    pillar: '360-support',
  },
]

/* --------------------------------------------------------------- enquiries */

export const INQUIRY_TYPES = [
  { id: 'franchise', label: 'Franchise Investment Partnership' },
  { id: 'admissions', label: 'School Admissions & Growth Audit' },
  { id: 'support', label: 'Curriculum & 360° Support Inquiry' },
] as const

export type InquiryTypeId = (typeof INQUIRY_TYPES)[number]['id']

export function isInquiryType(value: string | null): value is InquiryTypeId {
  return INQUIRY_TYPES.some((type) => type.id === value)
}

/* -------------------------------------------------------------- navigation */

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Franchise', href: '/franchise' },
  { label: 'Admissions', href: '/admissions' },
  { label: 'Contact', href: '/contact' },
] as const
