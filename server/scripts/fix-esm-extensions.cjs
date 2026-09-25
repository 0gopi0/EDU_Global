/**
 * Post-build step: append `.js` to extensionless relative imports in the
 * compiled `dist/` output, which Node's ESM loader requires
 * (`./app` -> `./app.js`). Bare package imports (`express`, `zod`) and
 * specifiers that already carry an extension are left untouched.
 *
 * Run automatically via the `postbuild` npm script.
 */
const fs = require('node:fs')
const path = require('node:path')

const distDir = path.join(__dirname, '..', 'dist')
// Matches `from './x'`, `import './x'` (side-effect) and `export ... from './x'`.
const pattern = /((?:from|import)\s*['"])(\.\.?\/[^'"]+)(['"])/g

function* jsFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* jsFiles(full)
    else if (entry.isFile() && entry.name.endsWith('.js')) yield full
  }
}

function hasExtension(specifier) {
  return /\.(js|mjs|cjs|json|node)$/.test(specifier)
}

let changed = 0
for (const file of jsFiles(distDir)) {
  const dir = path.dirname(file)
  const before = fs.readFileSync(file, 'utf8')
  const after = before.replace(pattern, (match, prefix, specifier, quote) => {
    if (hasExtension(specifier)) return match
    // `./auth.service` looks extensioned but isn't a file — only append
    // `.js` when `<specifier>.js` actually exists on disk next to the importer.
    const target = path.resolve(dir, `${specifier}.js`)
    return fs.existsSync(target) ? `${prefix}${specifier}.js${quote}` : match
  })
  if (after !== before) {
    fs.writeFileSync(file, after)
    changed += 1
  }
}

console.log(`[build] fixed ESM extensions in ${changed} file(s)`)
