import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { formatIndian, formatRupees, projectCampus } from '../../lib/diagnostic'
import { useInView } from './hooks'
import { Section, buttonClass } from './ui'

const SEATS = { min: 100, max: 3_000, step: 10, initial: 800 }
const ENROLLED = { min: 10, step: 10, initial: 420 }
const FEE = { min: 10_000, max: 300_000, step: 1_000, initial: 48_000 }

/** The seat plan always has 100 desks, so each desk is 1% of capacity. */
const DESKS = 100
const ROWS = 10

function snap(value: number, min: number, max: number, step: number): number {
  return Math.min(max, Math.max(min, Math.round(value / step) * step))
}

/* ------------------------------------------------------------------ inputs */

/**
 * The exact value beside a slider, editable in place: it shows the formatted
 * figure, turns into plain digits while focused, and commits on Enter or blur.
 */
function ExactValue({
  id,
  label,
  value,
  min,
  max,
  step,
  prefix,
  onChange,
}: {
  id: string
  label: string
  value: number
  min: number
  max: number
  step: number
  prefix?: string
  onChange: (value: number) => void
}) {
  const [draft, setDraft] = useState<string | null>(null)
  const text = draft ?? formatIndian(value)
  // Sized to its content: digits are tabular (1ch each), group commas are
  // narrow. Right-aligned, so a loose width would open a gap after the ₹.
  const digits = text.replace(/\D/g, '').length
  const width = `calc(${Math.max(digits, 1)}ch + ${(text.length - digits) * 0.32}ch + 2px)`

  function commit() {
    if (draft !== null && draft !== '') onChange(snap(Number(draft), min, max, step))
    setDraft(null)
  }

  return (
    <span className="flex items-baseline rounded-lg px-2 py-1 ring-1 ring-transparent transition-shadow focus-within:bg-paper focus-within:ring-leaf hover:ring-line">
      {prefix ? <span className="mr-0.5 text-[1.125rem] font-bold text-ink sm:text-[1.375rem]">{prefix}</span> : null}
      <input
        id={id}
        aria-label={`${label}, exact value`}
        inputMode="numeric"
        autoComplete="off"
        value={text}
        onFocus={(event) => {
          const input = event.currentTarget
          setDraft(String(value))
          requestAnimationFrame(() => input.select())
        }}
        onChange={(event) => setDraft(event.target.value.replace(/\D/g, ''))}
        onBlur={commit}
        onKeyDown={(event) => {
          const input = event.currentTarget
          if (event.key === 'Enter') input.blur()
          if (event.key === 'Escape') {
            // Discard the edit first, so the blur that follows commits nothing.
            setDraft(null)
            requestAnimationFrame(() => input.blur())
          }
        }}
        style={{ width }}
        className="bg-transparent text-right text-[1.125rem] font-bold sm:text-[1.375rem] text-ink tabular-nums focus:outline-none"
      />
    </span>
  )
}

function Control({
  id,
  label,
  value,
  min,
  max,
  step,
  prefix = '',
  onChange,
}: {
  id: string
  label: string
  value: number
  min: number
  max: number
  step: number
  prefix?: string
  onChange: (value: number) => void
}) {
  const percent = max > min ? ((value - min) / (max - min)) * 100 : 100
  const format = (amount: number) => `${prefix}${formatIndian(amount)}`

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="font-semibold text-ink">
          {label}
        </label>
        <ExactValue
          id={`${id}-exact`}
          label={label}
          value={value}
          min={min}
          max={max}
          step={step}
          prefix={prefix}
          onChange={onChange}
        />
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={format(value)}
        onChange={(event) => onChange(Number(event.target.value))}
        className="range mt-2"
        style={{ '--range-pct': `${percent}%` } as CSSProperties}
      />
      <div className="flex justify-between text-[0.8125rem] text-muted max-sm:hidden">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------- seat plan */

type Seat = 'enrolled' | 'added' | 'empty'

const SEAT_FILL: Record<Seat, string> = {
  enrolled: 'bg-leaf',
  added: 'bg-pencil',
  empty: 'bg-mist-deep',
}

function LegendRow({
  seat,
  label,
  short,
  value,
  highlight,
  onHighlight,
}: {
  seat: Seat
  label: string
  /** A one-word label for phones, where three columns are narrow. */
  short: string
  value: string
  highlight: Seat | null
  onHighlight: (seat: Seat | null) => void
}) {
  return (
    <li
      onPointerEnter={() => onHighlight(seat)}
      onPointerLeave={() => onHighlight(null)}
      className={cn(
        'transition-opacity duration-200',
        highlight && highlight !== seat && 'opacity-40',
      )}
    >
      <span className="flex items-center gap-2 text-[0.875rem] leading-tight">
        <span
          aria-hidden="true"
          className={cn(
            'h-2.5 w-4 shrink-0 rounded-[3px]',
            SEAT_FILL[seat],
            seat === 'empty' && 'ring-1 ring-line ring-inset',
          )}
        />
        <span className="sm:hidden">{short}</span>
        <span className="max-sm:hidden">{label}</span>
      </span>
      <span className="mt-1 block pl-6 text-[1.125rem] font-bold text-ink">
        {value}
      </span>
    </li>
  )
}

/**
 * A classroom seen from above: the board along the top and ten rows of desks
 * split by an aisle. Each desk is 1% of capacity, filled from the front:
 * green for students already enrolled, yellow for the seats a first
 * EduGlobal cycle could add, pale for seats still empty.
 */
function SeatPlan({
  seats,
  fillToday,
  fillProjected,
  highlight,
  onHighlight,
  children,
}: {
  seats: number
  fillToday: number
  fillProjected: number
  highlight: Seat | null
  onHighlight: (seat: Seat | null) => void
  children: ReactNode
}) {
  const planRef = useRef<HTMLDivElement>(null)
  const revealed = useInView(planRef, { threshold: 0.35 })
  // The first fill runs desk by desk; after that, changes land at once so
  // dragging a slider never waits on a stagger.
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    if (!revealed) return
    const timer = window.setTimeout(() => setSettled(true), 1400)
    return () => window.clearTimeout(timer)
  }, [revealed])

  const seatAt = (index: number): Seat => {
    if (!revealed) return 'empty'
    if (index < fillToday) return 'enrolled'
    if (index < fillProjected) return 'added'
    return 'empty'
  }

  const perDesk = seats / DESKS
  const deskNote = Number.isInteger(perDesk)
    ? `1 desk = ${perDesk} seats`
    : `1 desk ≈ ${Math.round(perDesk)} seats`

  const half = (row: number, side: 0 | 1) => (
    <div className="grid flex-1 grid-cols-5 gap-[clamp(3px,0.7vw,7px)]">
      {Array.from({ length: 5 }, (_, column) => {
        const index = row * 10 + side * 5 + column
        const seat = seatAt(index)
        return (
          <span
            key={index}
            onPointerEnter={() => onHighlight(seat)}
            style={{ transitionDelay: settled ? '0ms' : `${index * 9}ms` }}
            className={cn(
              'aspect-[5/2] rounded-[3px] transition-[background-color,opacity] duration-300',
              SEAT_FILL[seat],
              highlight && highlight !== seat && 'opacity-30',
            )}
          />
        )
      })}
    </div>
  )

  return (
    <div className="rounded-[1.25rem] bg-mist p-4 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="font-semibold text-ink">Your campus, seat by seat</p>
        <p className="text-[0.8125rem] whitespace-nowrap text-muted max-sm:hidden">{deskNote}</p>
      </div>

      <div
        ref={planRef}
        role="img"
        aria-label={`Seat plan: ${fillToday}% of seats filled today, ${fillProjected}% after one EduGlobal admissions cycle.`}
        onPointerLeave={() => onHighlight(null)}
        className="mt-4 max-sm:hidden"
      >
        <div aria-hidden="true" className="mx-auto h-1.5 w-3/5 rounded-full bg-board" />
        <div className="mt-4 grid gap-[clamp(5px,0.8vw,8px)]">
          {Array.from({ length: ROWS }, (_, row) => (
            <div key={row} className="flex gap-[clamp(12px,3vw,28px)]">
              {half(row, 0)}
              {half(row, 1)}
            </div>
          ))}
        </div>
      </div>

      {/* Phones get the same picture as one stacked bar: the desk grid
          would take most of a screen. */}
      <div
        role="img"
        aria-label={`${fillToday}% of seats filled today, ${fillProjected}% after one EduGlobal admissions cycle.`}
        className="mt-3 flex h-3 overflow-hidden rounded-full bg-mist-deep sm:hidden"
      >
        <span className={cn('transition-[width] duration-500', SEAT_FILL.enrolled)} style={{ width: `${fillToday}%` }} />
        <span
          className={cn('transition-[width] duration-500', SEAT_FILL.added)}
          style={{ width: `${fillProjected - fillToday}%` }}
        />
      </div>

      {children}
    </div>
  )
}

/* ------------------------------------------------------------- calculator */

export function CampusCalculator() {
  const [seats, setSeats] = useState(SEATS.initial)
  const [enrolled, setEnrolled] = useState(ENROLLED.initial)
  const [fee, setFee] = useState(FEE.initial)
  const [highlight, setHighlight] = useState<Seat | null>(null)

  const { current, projected, added, fillToday, fillProjected, revenue } = projectCampus(
    seats,
    enrolled,
    fee,
  )

  function changeSeats(next: number) {
    setSeats(next)
    setEnrolled((value) => Math.min(value, next))
  }

  const discuss = new URLSearchParams({
    type: 'admissions',
    seats: String(seats),
    enrolled: String(current),
    fee: String(fee),
  })

  return (
    <div className="overflow-hidden rounded-[1.5rem] bg-paper shadow-[0_1px_2px_rgb(0_16_48/0.06),0_30px_60px_-40px_rgb(0_16_48/0.35)] ring-1 ring-line lg:grid lg:grid-cols-[minmax(0,1fr)_19rem]">
      {/* Inputs beside the seat plan they drive. */}
      <div className="grid gap-5 p-4 sm:gap-8 sm:p-7 md:grid-cols-2 lg:gap-8 lg:p-8">
        <div className="flex flex-col gap-3.5 sm:gap-5">
          <Control
            id="calc-seats"
            label="Total seat capacity"
            value={seats}
            min={SEATS.min}
            max={SEATS.max}
            step={SEATS.step}
            onChange={changeSeats}
          />
          <Control
            id="calc-enrolled"
            label="Current enrollment"
            value={current}
            min={ENROLLED.min}
            max={seats}
            step={ENROLLED.step}
            onChange={setEnrolled}
          />
          <Control
            id="calc-fee"
            label="Average annual fee per student"
            value={fee}
            min={FEE.min}
            max={FEE.max}
            step={FEE.step}
            prefix="₹"
            onChange={setFee}
          />
          <p className="mt-auto text-[0.8125rem] leading-relaxed text-muted">
            Projection based on the median first-cycle uplift across the EduGlobal partner network.
            Illustrative, not a guarantee.
          </p>
        </div>

        <SeatPlan
          seats={seats}
          fillToday={fillToday}
          fillProjected={fillProjected}
          highlight={highlight}
          onHighlight={setHighlight}
        >
          <ul className="mt-3 grid grid-cols-3 gap-3 sm:mt-5">
            <LegendRow
              seat="enrolled"
              label="Enrolled today"
              short="Enrolled"
              value={formatIndian(current)}
              highlight={highlight}
              onHighlight={setHighlight}
            />
            <LegendRow
              seat="added"
              label="Added in year one"
              short="Added"
              value={`+${formatIndian(added)}`}
              highlight={highlight}
              onHighlight={setHighlight}
            />
            <LegendRow
              seat="empty"
              label="Still empty"
              short="Empty"
              value={formatIndian(seats - projected)}
              highlight={highlight}
              onHighlight={setHighlight}
            />
          </ul>
        </SeatPlan>
      </div>

      {/* The totals, as a blackboard panel down the right-hand side. */}
      <div className="grid grid-cols-2 gap-4 bg-board p-4 sm:flex sm:flex-col sm:gap-7 sm:p-7 lg:p-8">
        <div>
          <p className="text-[0.75rem] text-white/70 sm:text-[0.875rem]">Projected year-one enrollment</p>
          <p className="mt-2 text-[1.625rem] leading-none sm:text-[clamp(2.25rem,1.6rem+1.6vw,2.875rem)] font-extrabold tracking-[-0.035em] text-white">
            {formatIndian(projected)}
          </p>
          <p className="mt-2.5 text-[0.875rem] text-white/70 max-sm:hidden">
            Seat fill {fillToday}% today <span aria-hidden="true">→</span>
            <span className="sr-only">, </span> {fillProjected}% projected
          </p>
        </div>
        <div className="border-l border-white/12 pl-4 sm:border-t sm:border-l-0 sm:pt-7 sm:pl-0">
          <p className="text-[0.75rem] text-white/70 sm:text-[0.875rem]">Indicative additional annual revenue</p>
          <p className="mt-2 text-[1.625rem] leading-none sm:text-[clamp(2.25rem,1.6rem+1.6vw,2.875rem)] font-extrabold tracking-[-0.035em] text-pencil-bright">
            {formatRupees(revenue)}
          </p>
          <p className="mt-2.5 text-[0.875rem] text-white/70 max-sm:hidden">
            {formatIndian(added)} more {added === 1 ? 'student' : 'students'} × ₹{formatIndian(fee)}{' '}
            average annual fee
          </p>
        </div>
        <Link
          to={`/contact?${discuss.toString()}#enquiry`}
          className={buttonClass('accent', 'col-span-2 w-full lg:mt-auto')}
        >
          Discuss these numbers
        </Link>
      </div>
    </div>
  )
}

/** The "institutional diagnostic" band on the homepage. */
export function CalculatorSection() {
  return (
    <Section id="diagnostic" tone="mist">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <div>
          <p className="type-label text-leaf">Institutional diagnostic</p>
          <h2 className="type-heading mt-3 text-balance">Run the numbers on your own campus.</h2>
        </div>
        <p className="max-w-[26rem] text-body max-sm:hidden lg:pb-1">
          Move the sliders. See what a single EduGlobal admissions cycle could mean for your seats
          and your bottom line.
        </p>
      </header>
      <div className="mt-10">
        <CampusCalculator />
      </div>
    </Section>
  )
}
