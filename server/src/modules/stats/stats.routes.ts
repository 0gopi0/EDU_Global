import { Router } from 'express'
import { requireAuth } from '../../middleware/requireAuth'
import { getDashboardStats, listForAdmin } from '../posts/posts.service'

export const statsRouter = Router()

statsRouter.use(requireAuth)

statsRouter.get('/', async (_req, res) => {
  const [counts, recent] = await Promise.all([
    getDashboardStats(),
    listForAdmin({ page: 1, limit: 5, status: 'all' }),
  ])

  res.json({ counts, recent: recent.items })
})
