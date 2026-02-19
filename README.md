# Inventory App

A mobile-first, offline-first Progressive Web App (PWA) for inventory and sales management, designed for small stores (1-5 users).

## Features

- **Products** — Full CRUD with transactional stock management
- **Sales** — Cart-based sale creation with automatic stock deduction
- **Consignments** — Deliver products to customers, track returns
- **Dashboard** — Real-time metrics (total products, low stock alerts, recent sales, open consignments)
- **Offline-first** — Works 100% offline using IndexedDB; syncs automatically when online
- **Bilingual** — English and Spanish with auto-detection and manual toggle
- **Installable PWA** — Add to home screen, service worker caching

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | TailwindCSS |
| Local DB | Dexie (IndexedDB) |
| State | Zustand |
| Forms | React Hook Form + Zod |
| i18n | i18next |
| Backend | Supabase (Postgres + Auth) |
| PWA | vite-plugin-pwa (Workbox) |

## Architecture

### Offline-First Design

The app follows a strict offline-first architecture:

1. **UI reads/writes only from IndexedDB** (via Dexie) — never directly from Supabase
2. **Supabase is used exclusively for synchronization** — the app works fully without network
3. **All stock updates are transactional** — `product.stock` update + `inventory_movement` insert happen inside a single Dexie transaction
4. **Soft deletes** — records are marked `deleted = true`, never physically removed

### Sync Engine

The synchronization engine runs bidirectionally:

**Push phase:**
- Scans all tables for records where `synced = false`
- Upserts them to Supabase
- On success, marks `synced = true` and updates `updated_at`

**Pull phase:**
- Fetches records from Supabase where `updated_at > lastSync`
- Merges into IndexedDB using a last-write-wins strategy

**Triggers:**
- On app startup
- When the browser goes back online (`online` event)
- Every 60 seconds while online

The `lastSync` timestamp is stored in `localStorage`.

### Data Model

Every entity includes synchronization metadata:

| Field | Description |
|-------|-----------|
| `id` | UUID generated client-side |
| `created_at` | ISO timestamp |
| `updated_at` | ISO timestamp |
| `synced` | Whether the record has been pushed to Supabase |
| `deleted` | Soft delete flag |

**Entities:** Products, Inventory Movements, Sales, Sale Items, Consignments, Consignment Items.

### Stock Management

Stock is stored as a field on `products.stock`. Every modification:

1. Runs inside a Dexie transaction
2. Updates `product.stock`
3. Inserts a corresponding `inventory_movement` record
4. Marks both records as `synced = false`

Movement types: `IN`, `OUT`, `ADJUSTMENT`, `CONSIGNMENT_OUT`, `CONSIGNMENT_RETURN`.

## Project Structure

```
src/
  app/              # App component, layout, routing
  core/
    db/             # Dexie schema, types, database initialization
    sync/           # Sync engine (push, pull, orchestration)
    supabase/       # Supabase client configuration
  features/
    products/       # Product CRUD, stock adjustments
    sales/          # Sale creation, history
    consignments/   # Consignment delivery and returns
    inventory/      # Inventory movement types
    dashboard/      # Dashboard metrics
    settings/       # Language toggle, manual sync
  components/       # Shared UI components (PageHeader, EmptyState, etc.)
  hooks/            # Custom React hooks
  stores/           # Zustand stores (UI state, sync status)
  i18n/             # i18next config + locale files (en, es)
  utils/            # Utility functions (currency formatting)
```

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Setup

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd inventory
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. Set up Supabase database:
   - Create a new Supabase project
   - Run the migration file at `supabase/migrations/00001_initial_schema.sql` in the SQL editor
   - This creates all tables with Row Level Security policies scoped by `organization_id`

5. Start development server:
   ```bash
   npm run dev
   ```

6. Build for production:
   ```bash
   npm run build
   ```

7. Preview production build:
   ```bash
   npm run preview
   ```

### Available Scripts

| Command | Description |
|---------|-----------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

## PWA

The app is configured as an installable PWA with:

- **Auto-update** — new versions are applied automatically
- **Offline fallback** — all app routes work offline via `navigateFallback`
- **Runtime caching** — Supabase API responses cached with NetworkFirst strategy; images cached with CacheFirst strategy
- **Precaching** — all JS, CSS, HTML, and static assets are precached

To install: visit the app in Chrome/Edge and use the "Install" prompt, or "Add to Home Screen" on mobile.

## Internationalization

- Two languages: English (`en`) and Spanish (`es`)
- Language is auto-detected from browser settings
- Users can manually switch via Settings
- Selection is persisted in `localStorage`
- All UI strings use `t()` from i18next — no hardcoded text

Translation files: `src/i18n/locales/{en,es}/common.json`

## Deployment

The app is configured for deployment on **Vercel**:

1. Connect your repository to Vercel
2. Set environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
3. Deploy — Vite's build output is automatically detected

## Environment Variables

| Variable | Description |
|----------|-----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous/public API key |

## License

Private — all rights reserved.
