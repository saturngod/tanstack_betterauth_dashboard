# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TanStack Start Admin Dashboard - a full-stack React application using TanStack Start (React framework), Prisma ORM with MySQL, Better Auth for authentication, and shadcn/ui components with Tailwind CSS v4.

## Development Commands

```bash
# Start development server (runs on port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests (Vitest)
npm run test

# Database operations
npm run db:generate    # Generate Prisma client after schema changes
npm run db:push        # Push schema changes to database (dev only)
npm run db:migrate     # Run database migrations
npm run db:studio      # Open Prisma Studio (database GUI)
npm run db:seed        # Seed database

# Auth configuration
npm run auth:generate  # Generate Better Auth configurations
```

## Architecture

### Routing
- File-based routing via TanStack Router in `src/routes/`
- Layout routes use underscore prefix (e.g., `_dashboard.tsx`)
- Route tree is auto-generated in `routeTree.gen.ts`
- Use `Link` from `@tanstack/react-router` for SPA navigation

### Authentication
- Better Auth with email/password provider
- Two middleware functions in `src/lib/auth-middleware.ts`:
  - `authMiddleware` - protects routes requiring authentication (redirects to `/login`)
  - `guestMiddleware` - ensures unauthenticated state on login/register pages (redirects to `/dashboard` or `process.env.AFTER_LOGIN`)
- Session stored in cookies, managed via Prisma adapter
- Auth configuration in `src/lib/auth.ts` and `src/lib/auth-client.ts`

### Data Fetching
Two patterns:
1. **Route loaders** (server-side) - use `loader` in route definitions, access data via `route.useLoaderData()`
2. **TanStack Query** (client-side) - configured in `src/integrations/tanstack-query/root-provider.tsx`

### Path Aliases
- `@/*` maps to `./src/*` (configured in tsconfig.json)
- Use this for clean imports: `import { foo } from "@/lib/bar"`

### UI Components
- shadcn/ui components in `src/components/ui/`
- Add new components with: `pnpm dlx shadcn@latest add <component-name>`
- Radix UI primitives with Tailwind styling

### Route Protection Patterns
Protected dashboard routes are nested under `_dashboard.tsx`:
```
routes/
  __root.tsx          # Root layout with providers
  index.tsx           # Home page (/)
  login.tsx           # Login page
  register.tsx        # Register page
  _dashboard.tsx      # Protected layout (uses authMiddleware + beforeLoad)
  _dashboard/
    dashboard/
      index.tsx       # /dashboard
      account.tsx     # /dashboard/account
      users.tsx       # /dashboard/users
      settings.tsx    # /dashboard/settings
    api/auth/$        # Auth API endpoints
```

### Middleware Usage
All database and auth commands use `dotenv-cli` to load `.env.local`:
```bash
dotenv -e .env.local -- prisma generate
```
This is handled automatically by the npm scripts.

## Important Notes

- After modifying Prisma schema (`prisma/schema.prisma`), always run `npm run db:generate`
- The dev server must be running for `npm run db:studio` to access the database GUI
- Environment variables for database and auth are in `.env.local` (not in git)
- TanStack Router DevTools and React Query DevTools are enabled in development
