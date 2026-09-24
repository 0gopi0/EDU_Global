/**
 * Production startup file for hosts (e.g. Hostinger) that ask for a
 * `server.js` entry point.
 *
 * The app itself is TypeScript (`server/src/index.ts`) and is served in
 * production by Express (API + static `client/dist` + SPA fallback), so this
 * file only registers the tsx loader and hands off to it.
 *
 * Run: `node server.js` (from the repo root, after `npm install` + `npm run build`)
 */
process.env.NODE_ENV ??= 'production'

require('tsx/cjs')

module.exports = require('./server/src/index.ts')
