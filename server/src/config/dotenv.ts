import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const here = path.dirname(fileURLToPath(import.meta.url))

/** Absolute path of the `server/` directory. This module lives in `server/src/config`. */
export const serverRoot = path.resolve(here, '..', '..')

/** Absolute path of the directory cover images are written to and served from. */
export const uploadsDir = path.join(serverRoot, 'uploads')

/** Absolute path of the built client, served by Express in production. */
export const clientDistDir = path.resolve(serverRoot, '..', 'client', 'dist')

// `quiet` suppresses the banner dotenv v17+ prints on every load.
dotenv.config({ path: path.join(serverRoot, '.env'), quiet: true })
