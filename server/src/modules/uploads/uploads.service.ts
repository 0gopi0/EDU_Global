import fs from 'node:fs/promises'
import path from 'node:path'
import { uploadsDir } from '../../config/dotenv'

/**
 * Maps a stored `/uploads/...` path back to an absolute file path.
 *
 * Returns `null` for anything that is not inside the uploads directory, so a
 * crafted path in a request body cannot be used to read or delete arbitrary
 * files.
 */
export function resolveUploadPath(urlPath: string): string | null {
  const prefix = '/uploads/'
  if (!urlPath.startsWith(prefix)) return null

  const root = path.resolve(uploadsDir)
  const absolute = path.resolve(root, urlPath.slice(prefix.length))

  if (absolute !== root && !absolute.startsWith(root + path.sep)) return null

  return absolute
}

/** Deletes a stored upload. Best effort: a missing file is not an error. */
export async function removeUpload(urlPath: string | null): Promise<void> {
  if (!urlPath) return

  const absolute = resolveUploadPath(urlPath)
  if (!absolute) return

  try {
    await fs.unlink(absolute)
  } catch {
    // The file was already gone, or the path is not a file. Either way the
    // database row is the source of truth and the caller should not fail.
  }
}
