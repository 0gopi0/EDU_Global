# EDU_Global

A fullstack blog with an admin panel. React + Vite on the front, Express 5 and MySQL on the
back, TypeScript throughout.

- **Public site** — home page, searchable blog listing, individual articles
- **Admin panel** — sign-in, dashboard, and full post management (create, edit, draft /
  publish, delete, cover image upload)
- **Editor** — Markdown with a split-pane live preview

---

## Requirements

| Tool | Version |
| --- | --- |
| Node.js | 20 or newer |
| MySQL | 8.0 or newer, running locally |

## Setup

**1. Install dependencies** (from the repository root — npm workspaces install both apps):

```bash
npm install
```

**2. Configure the environment.** Copy the example file and fill it in:

```bash
cp server/.env.example server/.env     # Windows: copy server\.env.example server\.env
```

At minimum set `DB_PASSWORD` to your MySQL password. Then generate a real session secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

and paste the result into `JWT_SECRET`.

**3. Create the database and tables:**

```bash
npm run db:migrate
```

This creates the `edu_global` database and the `users` and `posts` tables. It is safe to
re-run.

**4. Create the admin account:**

```bash
npm run seed
```

The credentials come from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `server/.env`. Re-running this
command resets that account's password.

**5. Start both servers:**

```bash
npm run dev
```

| | URL |
| --- | --- |
| Site | http://localhost:5173 |
| Admin panel | http://localhost:5173/admin |
| API | http://localhost:4000/api |

---

## Scripts

Run these from the repository root.

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the API and the Vite dev server together |
| `npm run build` | Type-checks and builds the client into `client/dist` |
| `npm start` | Runs the API in production mode, serving the built client from `dist/` |
| `npm run db:migrate` | Creates the database and tables |
| `npm run seed` | Creates or updates the admin account |
| `npm run typecheck` | Type-checks both workspaces |

---

## Project structure

```
├── client/                      React + Vite front end
│   ├── vite.config.ts           Proxies /api and /uploads to Express
│   └── src/
│       ├── router.tsx           Route table (data router)
│       ├── index.css            Tailwind v4 entry and @theme design tokens
│       ├── components/ui/       Button, Card, Badge, Form, Modal, Toast, ...
│       ├── contexts/            AuthContext
│       ├── layouts/             PublicLayout, AdminLayout
│       ├── lib/                 fetch wrapper, query client, formatting
│       └── pages/
│           ├── public/          Home, BlogList, BlogPost, NotFound
│           └── admin/           Login, Dashboard, PostList, PostEditor
│
└── server/                      Express + MySQL API
    ├── db/                      schema.sql, migrate.ts, seed.ts
    ├── uploads/                 Uploaded cover images (gitignored)
    └── src/
        ├── app.ts               Express app assembly
        ├── index.ts             Boot, database check, graceful shutdown
        ├── config/              Environment loading and validation
        ├── db/                  Connection pool and typed query helpers
        ├── middleware/          requireAuth, error handling, upload
        └── modules/             auth, posts, uploads, stats, health
```

### How the two servers fit together

In development the browser talks only to Vite on port 5173, and Vite proxies `/api` and
`/uploads` through to Express on port 4000. That keeps the API **same-origin**, which means
no CORS setup and no `sameSite=None` on the session cookie.

In production `npm start` runs Express alone, and it serves the built client from `dist/` — so it stays
same-origin there too.

---

## API

All responses are JSON. Errors use `{ "error": { "message": "...", "code": "..." } }`.
List endpoints return `{ items, page, limit, total, totalPages }`.

### Public

| Method | Path | Notes |
| --- | --- | --- |
| `GET` | `/api/health` | Liveness plus a database ping |
| `GET` | `/api/posts` | Published posts. Query: `page`, `limit`, `search` |
| `GET` | `/api/posts/:slug` | A single published post. Drafts return 404 |

### Auth

| Method | Path | Notes |
| --- | --- | --- |
| `POST` | `/api/auth/login` | `{ email, password }`. Sets the session cookie |
| `POST` | `/api/auth/logout` | Clears the session cookie |
| `GET` | `/api/auth/me` | Current user, or 401 |

### Admin — requires a session

| Method | Path | Notes |
| --- | --- | --- |
| `GET` | `/api/admin/posts` | Query: `page`, `limit`, `search`, `status` |
| `GET` | `/api/admin/posts/:id` | Includes the Markdown body |
| `POST` | `/api/admin/posts` | Create |
| `PUT` | `/api/admin/posts/:id` | Update |
| `PATCH` | `/api/admin/posts/:id/status` | `{ status: "draft" \| "published" }` |
| `DELETE` | `/api/admin/posts/:id` | Also deletes the cover image |
| `POST` | `/api/admin/uploads` | Multipart, field name `file`. Returns `{ path }` |
| `GET` | `/api/admin/stats` | Dashboard counts and recent posts |

---

## Security notes

- **Passwords** are hashed with bcrypt at cost 12. `bcryptjs` is used instead of `bcrypt` to
  avoid native compilation on Windows.
- **Sessions** are a JWT in an `httpOnly` cookie, so no client script can read the token.
  The cookie is `sameSite: 'lax'` and only marked `secure` when `COOKIE_SECURE=true`.
- **Login** is rate limited to 10 attempts per 15 minutes per IP.
- **Every request body, query and param** is validated with Zod before it reaches the
  database.
- **All SQL is parameterized.** The only interpolated value is the database name, which is
  restricted to alphanumerics and underscores.
- **Uploads** are limited to JPEG/PNG/WebP/GIF up to `MAX_UPLOAD_MB`. The stored filename is
  random and its extension comes from a server-side allowlist, never from the uploaded
  filename.
- **Markdown is sanitized** with `rehype-sanitize` when rendered, so raw HTML in a post body
  is displayed as text rather than executed.

### Before deploying

1. Generate a fresh `JWT_SECRET`.
2. Set `NODE_ENV=production` and `COOKIE_SECURE=true`.
3. Serve over HTTPS.
4. Create a dedicated MySQL user rather than using `root`.

### Deploying to Hostinger (Node.js app, Express preset)

- **Application root:** the repo root. **Startup file:** `server.js`. **Node.js:** 20 or newer.
- `npm install` builds everything through `postinstall` (server → `server/dist`, client →
  root `dist/`). Build tools are regular dependencies because Hostinger skips devDependencies.
- On boot the server applies `db/schema.sql` and, if `ADMIN_EMAIL` / `ADMIN_PASSWORD` are set,
  creates that admin account if it doesn't exist yet. You don't need SSH, but the database itself
  must already exist (create it in hPanel → Databases).
- Set these in hPanel → Node.js app → Environment variables: `NODE_ENV=production`,
  `DB_HOST=127.0.0.1` (not `localhost`), `DB_PORT`, `DB_USER` and `DB_NAME` (use the full
  `u123456789_` prefixed names), `DB_PASSWORD`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
  **Do not set `PORT` or `HOST`**, because Hostinger injects them.
- After each deploy, check `https://yourdomain/api/health`. It returns
  `{"ok":true,"database":"up"}`.
- Uploaded cover images live in `server/uploads/`, which is not in git. Back it up before
  redeploying if your deploy wipes the app folder.

---

## Troubleshooting

**"I forgot the MySQL root password."**
Do not reinstall MySQL — that risks destroying existing databases. Reset the password instead,
from an **elevated** PowerShell (right-click Start → Terminal (Admin)):

```powershell
.\scripts\reset-mysql-root.ps1 -NewPassword 'YourStrongPassword!'
```

The script uses MySQL's documented `--init-file` recovery procedure. It changes the root
password only — the data directory is untouched, so every existing database is preserved. It
verifies the new password works before restarting the MySQL service, and restarts the service
even if something fails. Afterwards, put the same password in `server/.env` as `DB_PASSWORD`.

If PowerShell refuses to run the script, bypass the execution policy for that one invocation:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\reset-mysql-root.ps1 -NewPassword 'YourStrongPassword!'
```

**`npm install` finishes but `tsc` / `vite` / `tsx` are missing.**
Every build tool is a regular dependency, so this should not happen. Delete `node_modules` and
run `npm install` again.

**"Cannot reach MySQL: ER_ACCESS_DENIED_ERROR".**
`DB_USER` / `DB_PASSWORD` in `server/.env` are wrong. Note that MySQL `root` accounts often
require a password even though a bare `mysql -u root` may appear to work.

**"Cannot reach MySQL: ER_BAD_DB_ERROR".**
The database does not exist yet — run `npm run db:migrate`.

**Signing in appears to work but you are bounced straight back to the login screen.**
The browser is discarding the session cookie. Set `COOKIE_SECURE=false` in `server/.env`
(cookies marked `Secure` are dropped over plain `http://`).

**Cover images do not appear in development.**
The `/uploads` proxy in `client/vite.config.ts` is what forwards image requests to Express.
Make sure it is present and restart the dev server after changing it.

**"Invalid environment configuration" on startup.**
`server/.env` is missing or incomplete. The error lists exactly which values are wrong;
compare against `server/.env.example`.
