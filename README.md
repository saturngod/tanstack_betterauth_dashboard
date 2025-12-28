# TanStack Start Admin Dashboard

A full-stack React admin dashboard built with TanStack Start, Prisma ORM, Better Auth, and shadcn/ui components.

## Tech Stack

- **Framework**: TanStack Start (React-based full-stack framework)
- **Database**: MySQL with Prisma ORM (using Prisma MariaDB adapter)
- **Authentication**: Better Auth with email/password provider
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS v4
- **State Management**: TanStack Query for client-side data fetching
- **Routing**: TanStack Router with file-based routing
- **Build Tool**: Vite with Nitro for SSR

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MySQL database server running locally or remotely

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Update .env.local with your database credentials
```

### Environment Variables (.env.local)

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database Connection (MySQL)
DATABASE_URL="mysql://root:password@localhost:3306/your_database"
DATABASE_HOST="localhost"
DATABASE_PORT=3306
DATABASE_USER="root"
DATABASE_PASSWORD="your_password"
DATABASE_NAME="your_database_name"

# App Configuration
AFTER_LOGIN="/dashboard"  # Where to redirect after successful login
```

These variables are used by:
- **Prisma**: To connect to your MySQL database
- **Better Auth**: To store user sessions and manage authentication

### Database Setup

This project uses **Prisma ORM** with MySQL. The database schema is defined in `prisma/schema.prisma`.

#### Database Models

- **User**: Stores user information (id, name, email, password)
- **Session**: Stores active user sessions for authentication
- **Account**: Stores OAuth provider credentials (for future OAuth integrations)
- **Verification**: Stores email verification tokens

#### Database Commands

```bash
# Generate Prisma client (run after schema changes)
npm run db:generate

# Push schema changes to database (development only - no migrations)
npm run db:push

# Run database migrations (production)
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio

# Seed database with initial data
npm run db:seed
```

**How it works:**
1. `npm run db:generate` - Reads `prisma/schema.prisma` and generates the Prisma client in `src/generated/prisma/`
2. `npm run db:push` - Pushes your schema directly to the database without creating a migration file (use in development)
3. `npm run db:migrate` - Creates a migration file and applies it to the database (use in production)
4. `npm run db:studio` - Opens a visual database browser at `http://localhost:5555`

**Important**: All database commands use `dotenv-cli` to load variables from `.env.local` automatically.

### Authentication Setup

This project uses **Better Auth** for user authentication with email/password provider.

#### How Better Auth Works

**Server-side** (`src/lib/auth.ts`):
- Configures Better Auth with Prisma adapter
- Sets up email/password authentication
- Uses Prisma MariaDB adapter for better MySQL support

```typescript
export const auth = betterAuth({
    database: prismaAdapter(prisma, { provider: "mysql" }),
    emailAndPassword: { enabled: true },
    plugins: [tanstackStartCookies()]
});
```

**Client-side** (`src/lib/auth-client.ts`):
- Creates auth client for React components
- Provides methods for sign in, sign up, sign out

#### Authentication Flow

1. **Registration** (`src/routes/register.tsx`):
   - User fills out registration form (name, email, password)
   - Client calls `authClient.signUp.email()`
   - Better Auth hashes password and creates user in database
   - Session is created and stored in cookies
   - User redirects to `/dashboard`

2. **Login** (`src/routes/login.tsx`):
   - User enters email and password
   - Client calls `authClient.signIn.email()`
   - Better Auth verifies credentials
   - Session is created and stored in cookies
   - User redirects to `/dashboard`

3. **Protected Routes**:
   - Middleware checks for valid session
   - Unauthenticated users redirected to `/login`
   - Authenticated users accessing login/register redirected to `/dashboard`

#### Auth Middleware

Two middleware functions protect routes (`src/lib/auth-middleware.ts`):

- **`authMiddleware`**: Ensures user is authenticated (used on dashboard routes)
- **`guestMiddleware`**: Ensures user is NOT authenticated (used on login/register pages)

#### Auth Configuration

After modifying auth settings, regenerate the auth configuration:

```bash
npm run auth:generate
```

## Folder Structure

```
admin-dashboard/
├── prisma/
│   └── schema.prisma          # Database schema definition
├── src/
│   ├── components/
│   │   ├── dashboard-layout.tsx    # Main dashboard layout wrapper
│   │   ├── ui/                     # shadcn/ui components
│   │   └── app-sidebar.tsx         # Sidebar navigation
│   ├── generated/
│   │   └── prisma/                 # Auto-generated Prisma client
│   ├── integrations/
│   │   └── tanstack-query/         # TanStack Query setup
│   ├── lib/
│   │   ├── auth.ts                 # Better Auth server configuration
│   │   ├── auth-client.ts          # Better Auth client configuration
│   │   └── auth-middleware.ts      # Auth middleware functions
│   ├── routes/
│   │   ├── __root.tsx              # Root layout with providers
│   │   ├── index.tsx               # Home page (/)
│   │   ├── login.tsx               # Login page (/login)
│   │   ├── register.tsx            # Register page (/register)
│   │   ├── _dashboard.tsx          # Protected layout wrapper
│   │   └── _dashboard/
│   │       ├── dashboard/
│   │       │   ├── index.tsx       # Dashboard home (/dashboard)
│   │       │   ├── account.tsx     # Account settings (/dashboard/account)
│   │       │   ├── users.tsx       # Users page (/dashboard/users)
│   │       │   └── settings.tsx    # Settings page (/dashboard/settings)
│   │       └── api/auth/$          # Auth API endpoints
│   └── styles.css                  # Global styles with Tailwind
├── .env.local                      # Environment variables (not in git)
├── .env.example                    # Example environment variables
├── package.json
└── vite.config.ts
```

### Routing Pattern

This project uses **file-based routing** via TanStack Router:

- **Layout routes** (prefix with `_`): Wrap child routes with shared UI
  - `_dashboard.tsx`: Protected layout with sidebar navigation
- **File routes**: Automatically become URL paths
  - `index.tsx` → `/`
  - `login.tsx` → `/login`
  - `_dashboard/dashboard/index.tsx` → `/dashboard`

**Protected Routes Pattern**:
```
_dashboard.tsx (protected layout)
  └── _dashboard/
       └── dashboard/
            ├── index.tsx
            ├── users.tsx
            └── settings.tsx
```

All routes under `_dashboard.tsx` require authentication.

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
```

## Adding UI Components

This project uses shadcn/ui components. Add new components with:

```bash
pnpm dlx shadcn@latest add <component-name>
```

For example:
```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add input
```

Components are added to `src/components/ui/` and can be imported with:

```typescript
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
```

## Common Development Tasks

### Adding a New Protected Route

1. Create a new file in `src/routes/_dashboard/dashboard/` (e.g., `products.tsx`)
2. Export the route:
```typescript
export const Route = createFileRoute("/_dashboard/dashboard/products")({
  component: ProductsPage,
});
```
3. The route is automatically protected by `_dashboard.tsx`

### Modifying Database Schema

1. Edit `prisma/schema.prisma`
2. Run `npm run db:generate` to regenerate Prisma client
3. Run `npm run db:push` (dev) or `npm run db:migrate` (prod) to update database

### Adding Authentication to a Route

Protected routes automatically inherit authentication from `_dashboard.tsx`. For public routes that need optional auth, use the `getSession` helper from `_dashboard.tsx`.

## License

MIT
