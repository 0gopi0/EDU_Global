import bcrypt from 'bcryptjs'
import { env } from '../src/config/env'
import { execute, pool } from '../src/db/pool'

const BCRYPT_COST = 12

async function seed(): Promise<void> {
  const { ADMIN_EMAIL: email, ADMIN_PASSWORD: password, ADMIN_NAME: name } = env

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must both be set in server/.env')
  }
  if (password.length < 8) {
    throw new Error('ADMIN_PASSWORD must be at least 8 characters long')
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_COST)

  // Re-running updates the existing account rather than failing on the unique
  // email index, so this doubles as "reset the admin password".
  await execute(
    `INSERT INTO users (email, password_hash, name)
     VALUES (?, ?, ?) AS new
     ON DUPLICATE KEY UPDATE
       password_hash = new.password_hash,
       name = new.name`,
    [email, passwordHash, name],
  )

  console.log(`[seed] admin account ready: ${email}`)
}

seed()
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`\n[seed] failed: ${message}\n`)
    process.exitCode = 1
  })
  .finally(async () => {
    await pool.end()
  })
