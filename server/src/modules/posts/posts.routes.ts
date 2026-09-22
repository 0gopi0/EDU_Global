import { Router } from 'express'
import { z } from 'zod'
import { AppError } from '../../middleware/errorHandler'
import { requireAuth } from '../../middleware/requireAuth'
import {
  createPost,
  deletePost,
  getByIdForAdmin,
  getPublishedBySlug,
  listForAdmin,
  listPublished,
  setPostStatus,
  updatePost,
} from './posts.service'

const statusSchema = z.enum(['draft', 'published'])

const baseListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(9),
  search: z.string().trim().max(200).optional(),
})

const adminListQuerySchema = baseListQuerySchema.extend({
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(['draft', 'published', 'all']).default('all'),
})

const idParamSchema = z.object({
  id: z.coerce.number().int().positive('That post id is not valid.'),
})

// `.trim()` precedes `.min()` so a title of only whitespace is rejected rather
// than passing the length check and then being trimmed to nothing.
const postBodySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'A title is required.')
    .max(255, 'Titles are limited to 255 characters.'),
  slug: z.string().trim().max(255, 'Slugs are limited to 255 characters.').optional(),
  excerpt: z
    .string()
    .trim()
    .max(500, 'Excerpts are limited to 500 characters.')
    .nullish(),
  contentMd: z.string().min(1, 'The post body cannot be empty.'),
  coverImagePath: z.string().trim().max(500).nullish(),
  status: statusSchema,
})

// ------------------------------------------------------------------- public

export const publicPostsRouter = Router()

publicPostsRouter.get('/', async (req, res) => {
  const { page, limit, search } = baseListQuerySchema.parse(req.query)
  res.json(await listPublished({ page, limit, search }))
})

publicPostsRouter.get('/:slug', async (req, res) => {
  const slug = z.string().trim().min(1).parse(req.params.slug)

  const post = await getPublishedBySlug(slug)
  if (!post) throw AppError.notFound('That article does not exist.')

  res.json({ post })
})

// -------------------------------------------------------------------- admin

export const adminPostsRouter = Router()

adminPostsRouter.use(requireAuth)

adminPostsRouter.get('/', async (req, res) => {
  const { page, limit, search, status } = adminListQuerySchema.parse(req.query)
  res.json(await listForAdmin({ page, limit, search, status }))
})

adminPostsRouter.post('/', async (req, res) => {
  const input = postBodySchema.parse(req.body)
  res.status(201).json({ post: await createPost(input) })
})

adminPostsRouter.get('/:id', async (req, res) => {
  const { id } = idParamSchema.parse(req.params)

  const post = await getByIdForAdmin(id)
  if (!post) throw AppError.notFound('That post does not exist.')

  res.json({ post })
})

adminPostsRouter.put('/:id', async (req, res) => {
  const { id } = idParamSchema.parse(req.params)
  const input = postBodySchema.parse(req.body)

  res.json({ post: await updatePost(id, input) })
})

adminPostsRouter.patch('/:id/status', async (req, res) => {
  const { id } = idParamSchema.parse(req.params)
  const { status } = z.object({ status: statusSchema }).parse(req.body)

  res.json({ post: await setPostStatus(id, status) })
})

adminPostsRouter.delete('/:id', async (req, res) => {
  const { id } = idParamSchema.parse(req.params)

  await deletePost(id)
  res.status(204).end()
})
