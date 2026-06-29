# AGENTS.md — DataReactProfile

> Onboarding and operational guide for AI agents and developers working on the DataReactProfile CV management application.

---

## 1. Mission

Provide the **trilingual, multi-role CV data editor and PDF compiler**. The application is built with a Cloudflare Worker Hono backend, a SQLite D1 database (via Drizzle ORM), and a Vite React frontend backed by XState. It allows the admin to edit personal details, career experiences, skills, and awards, instantly rendering matching PDF previews in Harvard/DATA formats.

---

## 2. Repository Overview

| Field | Value |
|---|---|
| **Package** | `data-next-gen-profile` |
| **Private** | `true` |
| **Backend** | Hono running on Cloudflare Workers |
| **Frontend** | Vite + React + TypeScript + Tailwind |
| **Database** | Cloudflare D1 (SQLite) with Drizzle ORM |
| **State Machine** | XState v5 (`cvMachine.ts`) |

---

## 3. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Server Framework** | Hono | Backend endpoints & static assets server |
| **Database ORM** | Drizzle ORM | SQLite DB schemas and query model |
| **Client UI** | React 18, Tailwind CSS | Profile editor layout, input panels, previews |
| **Client State** | XState, `@xstate/react` | Unified CV data structure and transition engine |
| **PDF Renderer** | `@react-pdf/renderer` | Client-side Harvard & DATA PDF compilation |
| **Localizer** | `i18next`, `react-i18next` | English, Spanish, and French translation keys |
| **Testing** | Vitest | Integration test suites |

---

## 4. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                       DataReactProfile                      │
│                                                             │
│  Client (React)                  Server (Hono)              │
│  ┌────────────────────┐          ┌────────────────────────┐ │
│  │   cvMachine        │──HTTP───►│ API Endpoints          │ │
│  │  - CV memory state │  (600ms  │  - /api/cv             │ │
│  │                    │  debounced) - /api/cv/entry       │ │
│  │   BlobProvider     │          │                        │ │
│  │  - PDF compiler    │          │ Drizzle ORM & D1       │ │
│  │                    │          │  - Setup/Migrate       │ │
│  │   i18next          │          │  - Self-healing catch  │ │
│  └────────────────────┘          └────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Database Architecture
- **Column Naming Conventions**: All SQLite column names **must** use `snake_case`. Drizzle schema properties **must** use `camelCase` mapped explicitly:
  ```typescript
  export const experience = sqliteTable('DataReactProfile_Experience', {
      id: text('id').primaryKey(),
      companyName: text('company_name').notNull().default(''),
      sortOrder: integer('sort_order').notNull().default(0),
  });
  ```
- **Auto-Migration Pipeline**: The Hono server catches missing table/column errors, automatically executes queries in `MIGRATION_SQL` / `COLUMN_MIGRATIONS` inside `src/server/db/migrate.ts`, and redirects the client back to the requested endpoint.

### Client-side state & Writes
- **Debounced Updates**: To prevent SQLite lock conflicts, the client never writes to the database on every keystroke. It dispatches edits instantly to `cvMachine` for UI responsiveness, but queues database updates through `debouncedUpdateEntry` / `debouncedUpdateHeader` (`client/api.ts`) which triggers a single write call after a 600ms idle period.
- **Draggable PDF Preview**: The PDF preview width is tracked in `Home.tsx` (`previewWidth` state) and persisted in `localStorage`.

---

## 5. Repository Structure

```
DataReactProfile/
├── src/
│   ├── client/
│   │   ├── components/     # UI Editor components (Sections, Fields, PDFPanel)
│   │   ├── hooks/          # React hook abstractions
│   │   ├── pages/          # Home, Login view layout
│   │   ├── api.ts          # Axios client, debounce queue controllers
│   │   └── App.tsx         # Context providers wrapper
│   ├── lib/
│   │   ├── cvMachine.ts    # XState CV builder state logic
│   │   ├── i18n.ts         # i18next locales setup
│   │   └── *.test.ts       # Vitest spec suites
│   ├── server/
│   │   ├── db/
│   │   │   ├── schema.ts   # Drizzle schema definitions
│   │   │   ├── setup.sql   # Raw SQLite structures
│   │   │   └── migrate.ts  # Self-healing migration pipelines
│   │   └── index.ts        # Hono router and error-catcher middleware
│   └── locales/            # Localization dictionary files (en, es, fr)
├── wrangler.toml           # Wrangler Worker deployment settings
├── vite.config.ts          # Bundler setups
├── package.json            # Scripts & dependencies
└── tsconfig.json           # Compiler rules
```

---

## 6. Development Workflow

### Scripts

Use the following commands inside `DataReactProfile/`:

- **Run Local Dev Server (Local D1 emulator)**:
  ```bash
  pnpm run dev:local
  ```

- **Run Dev Server (Remote Cloud D1 database)**:
  ```bash
  pnpm run dev
  ```
  Uses KeePassXC credentials securely.

- **Export Remote D1 DB**:
  ```bash
  pnpm run db:backup
  ```

- **Deploy DB Schema**:
  ```bash
  pnpm run db:deploy
  ```
  Deploys schema definitions to the Cloud environment.

- **Run Tests**:
  ```bash
  pnpm test
  ```

---

## 7. Working Agreement

- **Drizzle Mapping**: Maintain exact mapping: `snake_case` in SQLite database, `camelCase` in Drizzle code.
- **Debounced network writes**: Do not bypass debounced API functions when writing data fields.
- **Auto-Migrate rules**: Append new migrations to `migrate.ts` arrays (`MIGRATION_SQL` or `COLUMN_MIGRATIONS`) rather than altering setup.sql scripts directly.

---

## 8. Security Guidelines

### KeePassXC Integration
- Secrets (tokens, access keys) are never stored in plaintext.
- Dev scripts use `keepassxc-cli` to prompt for master passwords on `/dev/tty` and extract tokens securely.
- Centralized helpers in `cloudflare.zsh` (`cf-run`, `cf-kp-get`) streamline credential loading.

---

## 9. Centralized Zsh Commands

Available from `cloudflare.zsh` and `github.zsh`:

| Command | Purpose |
|---|---|
| `cf-run <cmd>` | Loads CF credentials (TouchID/KeePass) then runs the command |
| `cf-kp-get <entry> <attr>` | Extracts a single KeePassXC attribute |
| `gitupload [message]` | `git add . && git commit -m <msg> && git push` |

Use `cf-run` instead of inline KeePassXC patterns:
```bash
zsh -ic 'cf-run deno run --allow-all ../scripts/sync-library.ts @datakit/react-core'
```

---

## 10. Testing Expectations

- Co-located testing uses Vitest.
- Run `pnpm test` to validate context structures, actions, and API endpoints before deploying.

---

## 10. Repository-Specific Rules

1. **Trilingual translation paths**: When adding text fields, supply translation keys for English (`en.json`), Spanish (`es.json`), and French (`fr.json`).
2. **BlobProvider scoping**: Keep the React-PDF `BlobProvider` scope elevated at the root of `Home.tsx` to optimize layout compilations.

---

## 11. Forbidden Actions

1. **Do NOT** bypass the debounce queue for client keystroke inputs.
2. **Do NOT** write Drizzle schema properties in `snake_case`.
3. **Do NOT** commit `.env` or `.dev.vars` files containing cloud tokens.