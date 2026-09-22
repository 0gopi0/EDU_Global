/**
 * Client-side mirror of the server's slugify, used only for the live preview
 * under the title field. The server re-derives and de-duplicates the slug when
 * the post is saved, so it remains the authority.
 */
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200)
    .replace(/-+$/g, '')
}
