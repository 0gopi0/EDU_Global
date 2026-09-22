import { useMemo, useState } from 'react'
import { ImageIcon } from 'lucide-react'

/**
 * Figures reverse-engineered from the design's own defaults (800 seats / 420
 * enrolled → 563 projected, 53% → 70% fill, ₹68.6 L):
 *   420 × 1.34  = 562.8 → 563
 *   563 / 800   = 70.4% → 70%
 *   143 × 48,000 = ₹68,64,000 → ₹68.6 L
 */
const FIRST_CYCLE_UPLIFT = 1.34
const ANNUAL_FEE_PER_STUDENT = 48_000

const SEAT_MIN = 100
const SEAT_MAX = 3_000
const SEAT_DEFAULT = 800

const ENROLL_MIN = 10
const ENROLL_MAX = 800
const ENROLL_DEFAULT = 420

/** Indian short scale: lakhs below a crore, then crores. */
function formatIndianCurrency(amount: number): string {
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(2)} Cr`
  if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(1)} L`
  return `₹${amount.toLocaleString('en-IN')}`
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-ink-900 p-6 ring-1 ring-white/10">
      <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-3 text-4xl font-bold text-gold-400 sm:text-5xl">{value}</p>
    </div>
  )
}

function Slider({
  id,
  label,
  value,
  min,
  max,
  onChange,
}: {
  id: string
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-medium text-slate-300">
          {label}
        </label>
        <span className="text-2xl font-bold text-white">{value.toLocaleString('en-IN')}</span>
      </div>

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={10}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink-600 accent-gold-500"
      />

      <div className="mt-2 flex justify-between text-xs text-slate-500">
        <span>{min.toLocaleString('en-IN')}</span>
        <span>{max.toLocaleString('en-IN')}</span>
      </div>
    </div>
  )
}

function TrackCard({
  id,
  eyebrow,
  title,
  linkLabel,
  gradient,
}: {
  id: string
  eyebrow: string
  title: string
  linkLabel: string
  gradient: string
}) {
  return (
    <article
      id={id}
      className="scroll-mt-24 overflow-hidden rounded-2xl bg-ink-900 ring-1 ring-white/10"
    >
      {/* Stand-in for the design's photography — no licensed images were sourced. */}
      <div className={`flex h-44 items-center justify-center ${gradient}`}>
        <ImageIcon className="h-7 w-7 text-white/40" />
      </div>

      <div className="space-y-4 p-6">
        <p className="text-[10px] font-semibold tracking-[0.2em] text-gold-500">{eyebrow}</p>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 text-sm font-medium text-gold-400 transition-colors hover:text-gold-300"
        >
          {linkLabel}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  )
}

export function RevenueCalculator() {
  const [seats, setSeats] = useState(SEAT_DEFAULT)
  const [enrolled, setEnrolled] = useState(ENROLL_DEFAULT)

  // Enrollment can never exceed available seats.
  const enrollmentCap = Math.min(ENROLL_MAX, seats)

  const metrics = useMemo(() => {
    const effectiveEnrolled = Math.min(enrolled, enrollmentCap)
    const projected = Math.min(seats, Math.round(effectiveEnrolled * FIRST_CYCLE_UPLIFT))
    const addedStudents = Math.max(0, projected - effectiveEnrolled)

    return {
      projected,
      addedStudents,
      fillToday: Math.round((effectiveEnrolled / seats) * 100),
      projectedFill: Math.round((projected / seats) * 100),
      addedRevenue: addedStudents * ANNUAL_FEE_PER_STUDENT,
    }
  }, [seats, enrolled, enrollmentCap])

  function handleSeats(next: number) {
    setSeats(next)
    // Keep the two sliders consistent when capacity drops below enrollment.
    setEnrolled((current) => Math.min(current, Math.min(ENROLL_MAX, next)))
  }

  return (
    <section id="diagnostic" className="scroll-mt-24 border-t border-white/10 bg-ink-950">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <p className="text-[11px] font-semibold tracking-[0.25em] text-gold-500">
          INSTITUTIONAL DIAGNOSTIC
        </p>
        <h2 className="mt-6 max-w-2xl text-3xl leading-tight font-bold text-white sm:text-5xl">
          Run the numbers
          <br />
          on your own campus.
        </h2>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
          Move the sliders. See what a single EduGlobal admissions cycle could mean for your seats
          and your bottom line.
        </p>

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="space-y-10">
            <Slider
              id="seat-capacity"
              label="Total Seat Capacity"
              value={seats}
              min={SEAT_MIN}
              max={SEAT_MAX}
              onChange={handleSeats}
            />
            <Slider
              id="current-enrollment"
              label="Current Enrollment"
              value={Math.min(enrolled, enrollmentCap)}
              min={ENROLL_MIN}
              max={enrollmentCap}
              onChange={setEnrolled}
            />
            <p className="text-xs leading-relaxed text-slate-500">
              Projection based on the median first-cycle uplift across the EduGlobal partner
              network. Illustrative, not a guarantee.
            </p>
          </div>

          <div className="space-y-5">
            <Figure
              label="PROJECTED YEAR-ONE ENROLLMENT"
              value={`${metrics.projected.toLocaleString('en-IN')}`}
            />
            <p className="-mt-1 text-sm text-slate-400">
              <span className="text-white">{metrics.projected}</span> students &nbsp;·&nbsp; Seat fill
              today — {metrics.fillToday}% &nbsp;→&nbsp; Projected — {metrics.projectedFill}%
            </p>
            <Figure
              label="INDICATIVE ADDITIONAL ANNUAL REVENUE"
              value={formatIndianCurrency(metrics.addedRevenue)}
            />
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <TrackCard
            id="franchise"
            eyebrow="FOR INVESTORS & TRUSTS"
            title="Scale a proven school system"
            linkLabel="Explore the Franchise Model"
            gradient="bg-gradient-to-br from-ink-700 to-ink-900"
          />
          <TrackCard
            id="admissions"
            eyebrow="FOR SCHOOL LEADERS"
            title="Fill every seat you have"
            linkLabel="Explore Admissions & Growth"
            gradient="bg-gradient-to-br from-gold-600/30 to-ink-900"
          />
        </div>
      </div>
    </section>
  )
}
