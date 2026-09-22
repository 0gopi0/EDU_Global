import fs from 'node:fs/promises'
import path from 'node:path'
import mysql from 'mysql2/promise'
import { serverRoot } from '../src/config/dotenv'
import { connectionHints, errorMessage } from '../src/db/connectionError'
import { dbConfig } from '../src/db/dbConfig'

const schemaPath = path.join(serverRoot, 'db', 'schema.sql')

async function migrate(): Promise<void> {
  const schema = await fs.readFile(schemaPath, 'utf8')

  // The database is created from a connection that does not select one yet.
  // `CREATE DATABASE` cannot be parameterized, which is why `dbConfig` restricts
  // DB_NAME to an alphanumeric identifier.
  const admin = await mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    multipleStatements: true,
  })

  try {
    await admin.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`` +
        ' CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',
    )
    console.log(`[migrate] database \`${dbConfig.database}\` ready`)
  } finally {
    await admin.end()
  }

  const db = await mysql.createConnection({ ...dbConfig, multipleStatements: true })

  try {
    await db.query(schema)
    console.log('[migrate] tables applied: users, posts')
    console.log('[migrate] done')
  } finally {
    await db.end()
  }
}

migrate().catch((error: unknown) => {
  console.error(`\n[migrate] failed: ${errorMessage(error)}`)

  for (const hint of connectionHints(error)) {
    console.error(`  ${hint}`)
  }

  console.error('')
  process.exit(1)
})
