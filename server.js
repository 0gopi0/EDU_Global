/**
 * Production startup file for hosts (e.g. Hostinger) that ask for a
 * `server.js` entry point.
 *
 * The app compiles to `server/dist` via `npm run build -w server` (run
 * automatically by `postinstall`), and in production Express serves both the
 * API and the built client (plus the SPA fallback) from that single process.
 *
 * Run: `node server.js` (from the repo root, after `npm install`)
 */
process.env.NODE_ENV ??= 'production'

// Dynamic import so NODE_ENV is set before the app's config modules evaluate
// (static imports are hoisted above this file's own statements).
await import('./server/dist/index.js')
