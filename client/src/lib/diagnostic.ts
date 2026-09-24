/** Median first-cycle enrollment uplift across the EduGlobal partner network. */
const UPLIFT = 1.34

const indian = new Intl.NumberFormat('en-IN')

/** Groups digits the Indian way: 12,34,567. */
export function formatIndian(value: number): string {
  return indian.format(value)
}

/** Indian short scale: lakhs below a crore, then crores. */
export function formatRupees(amount: number): string {
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(2)} Cr`
  if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(1)} L`
  return `₹${indian.format(amount)}`
}

/**
 * What one EduGlobal admissions cycle could mean for a campus. Enrollment is
 * capped at capacity, before and after the uplift; fill rates are whole
 * percentages.
 */
export function projectCampus(seats: number, enrolled: number, fee: number) {
  const current = Math.min(enrolled, seats)
  const projected = Math.min(seats, Math.round(current * UPLIFT))
  const added = projected - current

  return {
    current,
    projected,
    added,
    fillToday: Math.round((current / seats) * 100),
    fillProjected: Math.round((projected / seats) * 100),
    revenue: added * fee,
  }
}
