/**
 * Turns a MySQL or socket error into actionable setup advice.
 *
 * The driver puts the diagnostic code on `error.code` (e.g.
 * `ER_ACCESS_DENIED_ERROR`); the message only contains the server's prose, so
 * matching on the message would never work.
 */
const HINTS: Record<string, string[]> = {
  ER_ACCESS_DENIED_ERROR: ['Check DB_USER and DB_PASSWORD in server/.env.'],
  ER_BAD_DB_ERROR: ['The database does not exist yet. Run: npm run db:migrate'],
  ER_DBACCESS_DENIED_ERROR: [
    'This MySQL user is not allowed to create the database.',
    'Create it manually, then run the migration again.',
  ],
  ER_NOT_SUPPORTED_AUTH_MODE: [
    'This MySQL user uses an authentication plugin the driver cannot negotiate.',
  ],
  ECONNREFUSED: ['Could not reach MySQL. Is the MySQL service running on this port?'],
  ENOTFOUND: ['DB_HOST in server/.env does not resolve.'],
  ETIMEDOUT: ['Timed out connecting to MySQL. Check DB_HOST, DB_PORT and any firewall.'],
}

export function connectionErrorCode(error: unknown): string {
  if (error !== null && typeof error === 'object' && 'code' in error) {
    return String((error as { code: unknown }).code)
  }
  return ''
}

export function connectionHints(error: unknown): string[] {
  return HINTS[connectionErrorCode(error)] ?? []
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
