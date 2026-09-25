import { z } from 'zod'
import './dotenv'

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  // Hostinger injects PORT; never set it (or HOST) in the hPanel env panel.
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  HOST: z
    .string()
    .min(1)
    .default(() => (process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1')),
  JWT_SECRET: z.string().min(32, 'must be at least 32 characters long'),
  JWT_EXPIRES_IN: z.string().min(1).default('7d'),
  COOKIE_SECURE: z.enum(['true', 'false']).optional(),
  ADMIN_NAME: z.string().min(1).default('Admin'),
  ADMIN_EMAIL: z.email().optional(),
  ADMIN_PASSWORD: z.string().optional(),
  MAX_UPLOAD_MB: z.coerce.number().positive().max(50).default(5),
})

const parsed = schema.safeParse(process.env)

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
    .join('\n')

  console.error(`\nInvalid environment configuration (server/.env or host env vars):\n${issues}\n`)
  console.error('Copy server/.env.example to server/.env and fill in the values.\n')
  process.exit(1)
}

export const env = parsed.data

export const isProduction = env.NODE_ENV === 'production'

/**
 * Whether the session cookie is marked `Secure`. Browsers drop `Secure` cookies
 * sent over plain http, so this must stay off for local development.
 *
 * Deliberately explicit instead of derived from NODE_ENV: dotenv does not
 * override variables that already exist in the shell environment, so a stray
 * NODE_ENV=production (some shells and CI runners set it globally) would
 * otherwise silently break login on http://localhost.
 */
export const cookieSecure =
  env.COOKIE_SECURE === undefined ? isProduction : env.COOKIE_SECURE === 'true'

/** Upload size limit in bytes. */
export const maxUploadBytes = Math.floor(env.MAX_UPLOAD_MB * 1024 * 1024)
