import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { EnquiryForm } from '../../components/site/EnquiryForm'
import { FaqAccordion, type Faq } from '../../components/site/FaqAccordion'
import { usePageTitle } from '../../components/site/hooks'
import { Section } from '../../components/site/ui'
import { CONTACT, OFFICES, isInquiryType, photoProps } from '../../content/site'
import { formatIndian, projectCampus } from '../../lib/diagnostic'

const FAQS: readonly Faq[] = [
  {
    question: 'What does a franchise partnership with EduGlobal actually include?',
    answer:
      'A complete operating system: licensed curriculum, campus design guidelines, compliance and affiliation support, staff hiring and training, admissions systems, and ongoing 360° operational support — all under a performance-linked investment structure.',
  },
  {
    question: 'We already run a school. Can you work with existing institutions?',
    answer:
      'Absolutely. Most partners are existing schools. We begin with an operational audit, then deploy a bespoke 24-month roadmap covering academics, admissions, facilities, and community engagement.',
  },
  {
    question: 'How quickly can an admissions turnaround show results?',
    answer:
      'Partner schools typically see measurable funnel improvement within the first admission cycle — median first-year enrollment uplift across the network is around 34%, with full seat-fill trajectories by year two.',
  },
  {
    question: 'What regions do you currently operate in?',
    answer:
      'We are headquartered in Hyderabad with regional offices in Bengaluru and Mumbai, and we actively partner with institutions across India. Reach out with your location and we will confirm coverage.',
  },
  {
    question: 'What investment range does a new franchise campus require?',
    answer:
      'It depends on city tier, capacity, and facility scope. After your enquiry, our team prepares a site-specific feasibility model with a transparent investment and payback projection before any commitment.',
  },
]

/**
 * A visitor arriving from the campus calculator carries its inputs in the
 * query string; they seed the message so the team sees the same numbers.
 */
function diagnosticNote(params: URLSearchParams): string {
  const seats = Number(params.get('seats'))
  const enrolled = Number(params.get('enrolled'))
  const fee = Number(params.get('fee'))
  if (!(seats > 0 && enrolled > 0 && fee > 0)) return ''

  const { projected, fillToday, fillProjected } = projectCampus(seats, enrolled, fee)
  return (
    `From the campus diagnostic: ${formatIndian(seats)} seats, ${formatIndian(enrolled)} enrolled ` +
    `(${fillToday}% full), average annual fee ₹${formatIndian(fee)}. ` +
    `Projected year-one enrollment: ${formatIndian(projected)} (${fillProjected}% full).`
  )
}

export function Contact() {
  usePageTitle('Contact')
  const [params] = useSearchParams()
  const type = params.get('type')

  return (
    <>
      <section id="enquiry" className="scroll-mt-20 bg-paper pt-14 pb-20 sm:pt-20 sm:pb-28">
        <div className="container-site grid gap-x-8 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-7 xl:col-span-8">
            {/* Tinted rather than white, so the white fields inside read as
                fields instead of dissolving into the panel. */}
            <div className="relative isolate overflow-hidden rounded-[1.5rem] bg-linear-to-b from-[#f7fbff] to-sky p-6 shadow-[0_1px_2px_rgb(0_16_48/0.05),0_30px_60px_-36px_rgb(0_16_48/0.35)] ring-1 ring-line ring-inset sm:p-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_12%_0%,rgb(255_255_255/0.95),transparent_70%)]"
              />

              <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
                <div>
                  <p className="type-label text-leaf">Enquiry form</p>
                  {/* The page's top-level heading: with no banner above it,
                      this is the first thing the page says. */}
                  <h1 className="mt-3 max-w-[22ch] text-[clamp(1.75rem,1.3rem+1.4vw,2.5rem)] leading-[1.05] font-bold tracking-[-0.02em] text-balance">
                    Tell us where you are — and where you want to be.
                  </h1>
                </div>
                <p className="inline-flex shrink-0 items-center gap-2 rounded-full bg-paper px-3.5 py-1.5 text-[0.8125rem] font-semibold text-leaf shadow-[0_10px_22px_-14px_rgb(0_16_48/0.45)] ring-1 ring-line ring-inset">
                  <Clock aria-hidden="true" className="size-3.5" />
                  Answered in 48 hours
                </p>
              </div>

              <div className="mt-8">
                <EnquiryForm
                  // Remount when the query changes, so new defaults take effect.
                  key={params.toString()}
                  defaultType={isInquiryType(type) ? type : 'franchise'}
                  initialMessage={diagnosticNote(params)}
                />
              </div>
            </div>
          </div>

          <aside className="lg:col-span-5 xl:col-span-4">
            {/* Same surface as the form panel beside it, so the two read as
                one pair of cards rather than a light box and a dark one. */}
            <div className="relative isolate overflow-hidden rounded-[1.5rem] bg-linear-to-b from-[#f7fbff] to-sky p-7 shadow-[0_1px_2px_rgb(0_16_48/0.05),0_30px_60px_-36px_rgb(0_16_48/0.35)] ring-1 ring-line ring-inset sm:p-8 lg:sticky lg:top-28">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_12%_0%,rgb(255_255_255/0.95),transparent_70%)]"
              />

              <p className="type-label text-leaf">Reach us directly</p>
              <ul className="mt-5 grid gap-4">
                <li>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="flex items-center gap-3 break-all text-ink transition-colors hover:text-leaf"
                  >
                    <Mail aria-hidden="true" className="h-5 w-5 shrink-0 text-leaf" />
                    {CONTACT.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${CONTACT.phone}`}
                    className="flex items-center gap-3 text-ink transition-colors hover:text-leaf"
                  >
                    <Phone aria-hidden="true" className="h-5 w-5 shrink-0 text-leaf" />
                    {CONTACT.phone}
                  </a>
                </li>
                <li className="flex items-start gap-3 text-body">
                  <Clock aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-leaf" />
                  {CONTACT.hours}
                </li>
              </ul>

              <div className="mt-8 border-t border-line pt-8">
                <p className="type-label text-leaf">Regional offices</p>
                <ul className="mt-5 grid gap-6">
                  {OFFICES.map((office) => (
                    <li key={office.city}>
                      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-semibold text-ink">
                        <MapPin aria-hidden="true" className="h-4 w-4 text-leaf" />
                        {office.city}
                        <span className="rounded-full bg-paper px-2.5 py-0.5 text-[0.75rem] font-medium text-leaf ring-1 ring-line ring-inset">
                          {office.tag}
                        </span>
                      </p>
                      <p className="mt-1.5 pl-6 text-[0.9375rem] leading-relaxed">
                        {office.address}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Section id="faq" tone="mist">
        <div className="grid items-start gap-8 lg:grid-cols-12">
          {/* Stock image, desktop only — hidden on mobile. */}
          <figure className="hidden overflow-hidden rounded-[1.5rem] ring-1 ring-line ring-inset lg:sticky lg:top-28 lg:col-span-5 lg:block">
            <img
              {...photoProps('faqChalk', [800, 1200])}
              sizes="(min-width: 64rem) 28rem, 100vw"
              loading="lazy"
              className="aspect-[4/5] h-full w-full object-cover"
            />
          </figure>
          <div className="lg:col-span-7">
            <p className="type-label text-leaf">Good to know</p>
            <h2 className="type-subheading mt-3 text-balance">
              What schools ask us before reaching out.
            </h2>
            <div className="mt-6">
              <FaqAccordion items={FAQS} compact />
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
