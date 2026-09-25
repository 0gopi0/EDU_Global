import fs from 'node:fs/promises'
import path from 'node:path'
import bcrypt from 'bcryptjs'
import mysql from 'mysql2/promise'
import { serverRoot } from '../config/dotenv'
import { env } from '../config/env'
import { dbConfig } from './dbConfig'
import { execute, queryOne } from './pool'

/**
 * Runs on every boot so a deploy needs no SSH step: applies the (idempotent)
 * table definitions and, if ADMIN_EMAIL / ADMIN_PASSWORD are set, creates that
 * admin account when it does not exist yet. An existing account is never
 * touched here — `npm run db:seed` remains the way to reset its password.
 *
 * The database itself must already exist (on Hostinger it is created in
 * hPanel), unlike `db/migrate.ts`, which also creates it for local setups.
 */
export async function bootstrapDatabase(): Promise<void> {
  const schema = await fs.readFile(path.join(serverRoot, 'db', 'schema.sql'), 'utf8')
  const connection = await mysql.createConnection({ ...dbConfig, multipleStatements: true })

  try {
    await connection.query(schema)
  } finally {
    await connection.end()
  }
  console.log('[db] schema applied')

  const { ADMIN_EMAIL: email, ADMIN_PASSWORD: password, ADMIN_NAME: name } = env
  if (!email || !password) return

  if (password.length < 8) {
    console.warn('[db] ADMIN_PASSWORD is shorter than 8 characters; admin account not created')
    return
  }

  const existing = await queryOne('SELECT id FROM users WHERE email = ?', [email])
  if (existing) return

  await execute('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)', [
    email,
    await bcrypt.hash(password, 12),
    name,
  ])
  console.log(`[db] admin account created: ${email}`)
}
