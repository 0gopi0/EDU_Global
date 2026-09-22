import mysql, { type Pool, type ResultSetHeader, type RowDataPacket } from 'mysql2/promise'
import { dbConfig } from './dbConfig'

/**
 * MySQL sessions default to the driver's local timezone. Dates therefore come
 * back as JS `Date` objects and are serialized to UTC ISO strings by
 * `JSON.stringify`, which keeps the API output unambiguous.
 */
export const pool: Pool = mysql.createPool({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4_unicode_ci',
  supportBigNumbers: true,
})

export type Row = RowDataPacket

/**
 * A value accepted as a `?` placeholder.
 *
 * Deliberately excludes `undefined`: mysql2 rejects it for prepared statements,
 * so columns that may be empty are written as `NULL` and passed as `null`.
 */
export type SqlParam = string | number | bigint | boolean | Date | Buffer | Uint8Array | null

/**
 * Runs a SELECT and returns its rows.
 *
 * Uses `query` rather than `execute`: `execute` sends `LIMIT ?` / `OFFSET ?` as
 * prepared-statement parameters, which MySQL rejects for those clauses. Both
 * methods escape parameters, so neither is injectable.
 */
export async function queryRows<T extends Row = Row>(
  sql: string,
  params: SqlParam[] = [],
): Promise<T[]> {
  const [rows] = await pool.query<T[]>(sql, params)
  return rows
}

/** Runs a SELECT that is expected to match at most one row. */
export async function queryOne<T extends Row = Row>(
  sql: string,
  params: SqlParam[] = [],
): Promise<T | null> {
  const rows = await queryRows<T>(sql, params)
  return rows[0] ?? null
}

/** Runs an INSERT / UPDATE / DELETE as a server-side prepared statement. */
export async function execute(sql: string, params: SqlParam[] = []): Promise<ResultSetHeader> {
  const [result] = await pool.execute<ResultSetHeader>(sql, params)
  return result
}
