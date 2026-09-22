export function formatDate(iso: string | null): string {
  if (!iso) return '—'

  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(iso: string | null): string {
  if (!iso) return '—'

  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

/** Falls back to the opening words of the body when no excerpt was written. */
export function excerptOf(summary: { excerpt: string | null }, body?: string): string {
  if (summary.excerpt) return summary.excerpt
  if (!body) return ''

  const plain = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#*_>`[\]()!-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  return plain.length > 160 ? `${plain.slice(0, 157).trimEnd()}...` : plain
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`
}
