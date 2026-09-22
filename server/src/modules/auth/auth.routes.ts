import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import { AppError } from '../../middleware/errorHandler'
import { requireAuth } from '../../middleware/requireAuth'
import { signIn } from './auth.service'
import { SESSION_COOKIE, sessionCookieOptions } from './sessionCookie'

const loginSchema = z.object({
  email: z.email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
})

// The only endpoint worth brute-forcing, so it is the only one rate limited.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      message: 'Too many sign-in attempts. Please wait a few minutes and try again.',
      code: 'RATE_LIMITED',
    },
  },
})

export const authRouter = Router()

authRouter.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = loginSchema.parse(req.body)

  const session = await signIn(email, password)
  if (!session) {
    throw AppError.unauthorized('Email or password is incorrect.')
  }

  res.cookie(SESSION_COOKIE, session.token, sessionCookieOptions)
  res.json({ user: session.user })
})

authRouter.post('/logout', (_req, res) => {
  // Browsers ignore `maxAge` when clearing, so it is passed without one.
  const { maxAge: _maxAge, ...clearOptions } = sessionCookieOptions
  res.clearCookie(SESSION_COOKIE, clearOptions)
  res.status(204).end()
})

/** Lets the client restore auth state after a page refresh. */
authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user })
})
