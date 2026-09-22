import type { CookieOptions } from 'express'
import { cookieSecure } from '../../config/env'

export const SESSION_COOKIE = 'edu_session'

/**
 * The cookie is `httpOnly` so no client script can read the token, and
 * `sameSite: 'lax'` is enough because the Vite dev proxy makes the API
 * same-origin. `secure` is off over http so the browser does not discard it.
 *
 * `maxAge` must stay in step with `JWT_EXPIRES_IN` in the environment.
 */
export const sessionCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: cookieSecure,
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}
