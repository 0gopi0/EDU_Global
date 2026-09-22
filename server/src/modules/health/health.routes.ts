import { Router } from 'express'
import { pool } from '../../db/pool'

export const healthRouter = Router()

/** Liveness probe. Also proves the pool can reach MySQL, not just the process. */
healthRouter.get('/', async (_req, res) => {
  await pool.query('SELECT 1')
  res.json({ ok: true, database: 'up' })
})
