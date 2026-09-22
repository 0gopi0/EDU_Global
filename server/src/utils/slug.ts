/**
 * Converts a title into a URL-safe slug.
 *
 * Non-Latin scripts (Chinese, Arabic, Cyrillic) transliterate to an empty
 * string, so callers must supply a fallback — see `posts.service.ts`.
 */
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    // Strip the combining diacritics that NFKD split off, so "Café" -> "cafe".
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200)
    // The slice above can land mid-separator, leaving a trailing hyphen.
    .replace(/-+$/g, '')
}
