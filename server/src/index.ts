import { createApp } from './app'
import { env } from './config/env'
import { bootstrapDatabase } from './db/bootstrap'
import { connectionHints, errorMessage } from './db/connectionError'
import { pool } from './db/pool'

async function assertDatabaseReachable(): Promise<void> {
  const connection = await pool.getConnection()
  try {
    await connection.ping()
  } finally {
    connection.release()
  }
}

async function start(): Promise<void> {
  // Checked at boot so a bad password or a missing database is reported once,
  // with an actionable message, instead of surfacing as a 500 on every request.
  try {
    await assertDatabaseReachable()
    console.log('[db] connected')
    await bootstrapDatabase()
  } catch (error: unknown) {
    console.error(`\n[server] cannot reach MySQL: ${errorMessage(error)}`)

    for (const hint of connectionHints(error)) {
      console.error(`  ${hint}`)
    }

    console.error('')
    process.exit(1)
  }

  const server = createApp().listen(env.PORT, env.HOST, () => {
    console.log(`[server] listening on http://${env.HOST}:${env.PORT}`)
  })

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`[server] port ${env.PORT} is already in use`)
    } else {
      console.error(`[server] ${errorMessage(error)}`)
    }
    process.exit(1)
  })

  const shutdown = (signal: NodeJS.Signals): void => {
    console.log(`\n[server] ${signal} received, shutting down`)

    // Hostinger restarts the process on every deploy; don't hang on open sockets.
    setTimeout(() => process.exit(1), 10_000).unref()

    server.close(() => {
      void pool.end().then(() => {
        process.exit(0)
      })
    })
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

void start()
