import type { SessionUser } from '../modules/auth/auth.service'

declare global {
  namespace Express {
    interface Request {
      /** Populated by `requireAuth` on protected routes. */
      user?: SessionUser
    }
  }
}

export {}
