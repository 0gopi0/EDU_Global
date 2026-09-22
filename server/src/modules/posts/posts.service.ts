import { AppError } from '../../middleware/errorHandler'
import { execute, queryOne, queryRows, type Row, type SqlParam } from '../../db/pool'
import { slugify } from '../../utils/slug'
import { removeUpload } from '../uploads/uploads.service'

export type PostStatus = 'draft' | 'published'

export interface PostSummary {
  id: number
  title: string
  slug: string
  excerpt: string | null
  coverImagePath: string | null
  status: PostStatus
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface PostDetail extends PostSummary {
  contentMd: string
}

export interface Paginated<T> {
  items: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PostInput {
  title: string
  slug?: string | undefined
  excerpt?: string | null | undefined
  contentMd: string
  coverImagePath?: string | null | undefined
  status: PostStatus
}

export interface DashboardStats {
  total: number
  published: number
  draft: number
}

interface PostRow extends Row {
  id: number
  title: string
  slug: string
  excerpt: string | null
  cover_image_path: string | null
  status: PostStatus
  published_at: Date | null
  created_at: Date
  updated_at: Date
}

interface PostDetailRow extends PostRow {
  content_md: string
}

interface CountRow extends Row {
  total: number
}

interface CountsRow extends Row {
  total: number
  published: number
  draft: number
}

interface IdRow extends Row {
  id: number
}

/** Deliberately omits `content_md` so listing endpoints stay small. */
const SUMMARY_COLUMNS = `
  id, title, slug, excerpt, cover_image_path, status,
  published_at, created_at, updated_at
`

const SLUG_IN_USE = `
  SELECT id FROM posts
  WHERE slug = ? AND (? IS NULL OR id <> ?)
  LIMIT 1
`

function toSummary(row: PostRow): PostSummary {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    coverImagePath: row.cover_image_path,
    status: row.status,
    publishedAt: row.published_at ? row.published_at.toISOString() : null,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  }
}

function toDetail(row: PostDetailRow): PostDetail {
  return { ...toSummary(row), contentMd: row.content_md }
}

/** Stops user input from acting as a wildcard inside a LIKE pattern. */
function escapeLike(input: string): string {
  return input.replace(/[\\%_]/g, (char) => `\\${char}`)
}

function buildSearchClause(search: string | undefined, values: SqlParam[]): string | null {
  if (!search) return null

  const pattern = `%${escapeLike(search)}%`
  values.push(pattern, pattern)
  return '(title LIKE ? OR excerpt LIKE ?)'
}

/**
 * Resolves a collision by appending `-2`, `-3`, and so on, so a duplicate title
 * never surfaces as a raw duplicate-key database error.
 */
async function ensureUniqueSlug(base: string, excludeId?: number): Promise<string> {
  for (let suffix = 1; suffix <= 100; suffix += 1) {
    const candidate = suffix === 1 ? base : `${base}-${suffix}`
    const clash = await queryOne<IdRow>(SLUG_IN_USE, [candidate, excludeId ?? null, excludeId ?? null])
    if (!clash) return candidate
  }

  return `${base}-${Date.now()}`
}

function toPage<T>(items: T[], page: number, limit: number, total: number): Paginated<T> {
  return { items, page, limit, total, totalPages: Math.ceil(total / limit) }
}

// ---------------------------------------------------------------- public reads

export async function listPublished(params: {
  page: number
  limit: number
  search?: string | undefined
}): Promise<Paginated<PostSummary>> {
  const { page, limit, search } = params
  const values: SqlParam[] = []
  const conditions: string[] = ["status = 'published'"]

  const searchClause = buildSearchClause(search, values)
  if (searchClause) conditions.push(searchClause)

  const where = `WHERE ${conditions.join(' AND ')}`

  const countRow = await queryOne<CountRow>(
    `SELECT COUNT(*) AS total FROM posts ${where}`,
    values,
  )
  const total = countRow?.total ?? 0

  const rows = await queryRows<PostRow>(
    `SELECT ${SUMMARY_COLUMNS}
     FROM posts
     ${where}
     ORDER BY published_at DESC, id DESC
     LIMIT ? OFFSET ?`,
    [...values, limit, (page - 1) * limit],
  )

  return toPage(rows.map(toSummary), page, limit, total)
}

export async function getPublishedBySlug(slug: string): Promise<PostDetail | null> {
  const row = await queryOne<PostDetailRow>(
    `SELECT ${SUMMARY_COLUMNS}, content_md
     FROM posts
     WHERE slug = ? AND status = 'published'
     LIMIT 1`,
    [slug],
  )

  return row ? toDetail(row) : null
}

// ----------------------------------------------------------------- admin reads

export async function listForAdmin(params: {
  page: number
  limit: number
  search?: string | undefined
  status?: PostStatus | 'all' | undefined
}): Promise<Paginated<PostSummary>> {
  const { page, limit, search, status } = params
  const values: SqlParam[] = []
  const conditions: string[] = []

  if (status && status !== 'all') {
    conditions.push('status = ?')
    values.push(status)
  }

  const searchClause = buildSearchClause(search, values)
  if (searchClause) conditions.push(searchClause)

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  const countRow = await queryOne<CountRow>(
    `SELECT COUNT(*) AS total FROM posts ${where}`,
    values,
  )
  const total = countRow?.total ?? 0

  const rows = await queryRows<PostRow>(
    `SELECT ${SUMMARY_COLUMNS}
     FROM posts
     ${where}
     ORDER BY created_at DESC, id DESC
     LIMIT ? OFFSET ?`,
    [...values, limit, (page - 1) * limit],
  )

  return toPage(rows.map(toSummary), page, limit, total)
}

export async function getByIdForAdmin(id: number): Promise<PostDetail | null> {
  const row = await queryOne<PostDetailRow>(
    `SELECT ${SUMMARY_COLUMNS}, content_md FROM posts WHERE id = ? LIMIT 1`,
    [id],
  )

  return row ? toDetail(row) : null
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const row = await queryOne<CountsRow>(`
    SELECT
      (SELECT COUNT(*) FROM posts) AS total,
      (SELECT COUNT(*) FROM posts WHERE status = 'published') AS published,
      (SELECT COUNT(*) FROM posts WHERE status = 'draft') AS draft
  `)

  return {
    total: row?.total ?? 0,
    published: row?.published ?? 0,
    draft: row?.draft ?? 0,
  }
}

// ---------------------------------------------------------------- admin writes

export async function createPost(input: PostInput): Promise<PostDetail> {
  const slug = await ensureUniqueSlug(slugify(input.slug?.trim() || input.title) || 'post')

  const result = await execute(
    `INSERT INTO posts (title, slug, excerpt, content_md, cover_image_path, status, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      input.title.trim(),
      slug,
      input.excerpt?.trim() || null,
      input.contentMd,
      input.coverImagePath ?? null,
      input.status,
      input.status === 'published' ? new Date() : null,
    ],
  )

  const created = await getByIdForAdmin(result.insertId)
  if (!created) throw new Error(`Post ${result.insertId} was inserted but could not be read back.`)

  return created
}

export async function updatePost(id: number, input: PostInput): Promise<PostDetail> {
  const existing = await getByIdForAdmin(id)
  if (!existing) throw AppError.notFound('That post does not exist.')

  const slug = await ensureUniqueSlug(slugify(input.slug?.trim() || input.title) || 'post', id)

  // The publish date is set once and then left alone: editing a live post must
  // not reorder the blog, and unpublishing then republishing must not move it.
  let publishedAt = existing.publishedAt ? new Date(existing.publishedAt) : null
  if (!publishedAt && input.status === 'published') publishedAt = new Date()

  const coverImagePath = input.coverImagePath ?? null

  await execute(
    `UPDATE posts
     SET title = ?, slug = ?, excerpt = ?, content_md = ?,
         cover_image_path = ?, status = ?, published_at = ?
     WHERE id = ?`,
    [
      input.title.trim(),
      slug,
      input.excerpt?.trim() || null,
      input.contentMd,
      coverImagePath,
      input.status,
      publishedAt,
      id,
    ],
  )

  // Only once the row points at the new image is the previous file removed.
  if (existing.coverImagePath && existing.coverImagePath !== coverImagePath) {
    await removeUpload(existing.coverImagePath)
  }

  const updated = await getByIdForAdmin(id)
  if (!updated) throw new Error(`Post ${id} was updated but could not be read back.`)

  return updated
}

export async function setPostStatus(id: number, status: PostStatus): Promise<PostDetail> {
  const existing = await getByIdForAdmin(id)
  if (!existing) throw AppError.notFound('That post does not exist.')

  let publishedAt = existing.publishedAt ? new Date(existing.publishedAt) : null
  if (!publishedAt && status === 'published') publishedAt = new Date()

  await execute('UPDATE posts SET status = ?, published_at = ? WHERE id = ?', [
    status,
    publishedAt,
    id,
  ])

  const updated = await getByIdForAdmin(id)
  if (!updated) throw new Error(`Post ${id} was updated but could not be read back.`)

  return updated
}

export async function deletePost(id: number): Promise<void> {
  const existing = await getByIdForAdmin(id)
  if (!existing) throw AppError.notFound('That post does not exist.')

  await execute('DELETE FROM posts WHERE id = ?', [id])
  await removeUpload(existing.coverImagePath)
}
