import { compare } from 'bcryptjs'
import jwt, { type SignOptions } from 'jsonwebtoken'
import { env } from '../../config/env'
import { queryOne, type Row } from '../../db/pool'

interface UserRow extends Row {
  id: number
  email: string
  password_hash: string
  name: string
}

export interface SessionUser {
  id: number
  email: string
  name: string
}

export interface Session {
  token: string
  user: SessionUser
}

const SELECT_BY_EMAIL = `
  SELECT id, email, password_hash, name
  FROM users
  WHERE email = ?
`

/**
 * Verifies credentials and issues a token.
 *
 * Returns `null` for both "no such user" and "wrong password" so the caller
 * cannot be used to discover which email addresses exist.
 */
export async function signIn(email: string, password: string): Promise<Session | null> {
  const user = await queryOne<UserRow>(SELECT_BY_EMAIL, [email.trim().toLowerCase()])
  if (!user) return null

  const passwordMatches = await compare(password, user.password_hash)
  if (!passwordMatches) return null

  return { token: issueToken(user), user: toSessionUser(user) }
}

function issueToken(user: UserRow): string {
  return jwt.sign({ sub: String(user.id), email: user.email, name: user.name }, env.JWT_SECRET, {
    // @types/jsonwebtoken types `expiresIn` as a template-literal union of ms()
    // suffixes, which a plain `string` from the environment is not assignable
    // to. `env.ts` guarantees it is non-empty; jwt throws on a malformed value.
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  })
}

/** Returns the session user, or `null` if the token is missing, forged or expired. */
export function verifyToken(token: string): SessionUser | null {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET)
    if (typeof payload === 'string') return null

    const { sub, email, name } = payload
    if (typeof sub !== 'string' || typeof email !== 'string' || typeof name !== 'string') {
      return null
    }

    const id = Number(sub)
    if (!Number.isInteger(id)) return null

    return { id, email, name }
  } catch {
    return null
  }
}

function toSessionUser(user: UserRow): SessionUser {
  return { id: user.id, email: user.email, name: user.name }
}
