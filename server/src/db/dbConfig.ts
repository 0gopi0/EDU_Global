import { z } from 'zod'
import '../config/dotenv'

// Kept separate from `env.ts` so that bootstrap scripts (`db/migrate.ts`,
// `db/seed.ts`) and the connection pool can read database settings without
// requiring the full application environment (JWT_SECRET and friends) to be set.
const schema = z.object({
  DB_HOST: z.string().min(1).default('127.0.0.1'),
  DB_PORT: z.coerce.number().int().min(1).max(65535).default(3306),
  DB_USER: z.string().min(1).default('root'),
  DB_PASSWORD: z.string().default(''),
  // Interpolated into `CREATE DATABASE`, which cannot be parameterized, so the
  // identifier is restricted to a character set that makes injection impossible.
  DB_NAME: z
    .string()
    .regex(/^[A-Za-z0-9_]+$/, 'may only contain letters, numbers and underscores')
    .default('edu_global'),
})

const parsed = schema.safeParse(process.env)

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - DB_${issue.path.join('.') || '(root)'}: ${issue.message}`)
    .join('\n')

  console.error(`\nInvalid database configuration in server/.env:\n${issues}\n`)
  process.exit(1)
}

export const dbConfig = {
  host: parsed.data.DB_HOST,
  port: parsed.data.DB_PORT,
  user: parsed.data.DB_USER,
  password: parsed.data.DB_PASSWORD,
  database: parsed.data.DB_NAME,
}
