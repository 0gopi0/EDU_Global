import type { RequestHandler } from 'express'
import { AppError } from './errorHandler'
import { SESSION_COOKIE } from '../modules/auth/sessionCookie'
import { verifyToken } from '../modules/auth/auth.service'

/** Rejects the request unless it carries a valid session cookie. */
export const requireAuth: RequestHandler = (req, _res, next) => {
  const token: unknown = req.cookies?.[SESSION_COOKIE]

  if (typeof token !== 'string') {
    next(AppError.unauthorized())
    return
  }

  const user = verifyToken(token)
  if (!user) {
    next(AppError.unauthorized('Your session has expired. Please sign in again.', 'SESSION_EXPIRED'))
    return
  }

  req.user = user
  next()
}
