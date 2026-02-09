# OfflineAcademy - Offline-First Learning Platform

## Project Overview

OfflineAcademy is a progressive web application designed for educational institutions in rural and low-connectivity regions. The platform enables continuous learning through offline-first architecture, local data caching, and efficient synchronization protocols.

### Problem Statement

Traditional digital learning platforms require:
- Continuous internet connectivity
- High bandwidth availability  
- Modern computing devices

These requirements create barriers in rural and low-bandwidth environments, resulting in:
- Prolonged loading times
- Content delivery failures
- Excessive data consumption
- Interrupted learning experiences

### Solution Architecture

OfflineAcademy implements a comprehensive offline-first strategy:

**Core Features:**
- Local-first data architecture with background synchronization
- Progressive enhancement for low-end devices
- Minimal bandwidth consumption through optimized assets
- Service Worker-based caching for offline availability

**Technical Implementation:**
- Content cached during initial access
- Full offline functionality for core learning materials
- Differential synchronization when connectivity is restored
- Text-optimized content delivery (no video streaming)

### Value Proposition

- **Accessibility:** Functions reliably in low-connectivity environments
- **Performance:** Optimized for low-end hardware
- **Reliability:** Maintains functionality during network outages
- **Scalability:** Efficient architecture for large-scale deployment
- **Educational Continuity:** Ensures uninterrupted learning in rural schools

---

## Technology Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5 (Strict Mode)
- **Styling:** Tailwind CSS v4
- **State Management:** React Context API
- **Form Handling:** React Hook Form + Zod
- **UI Components:** Custom component library

### Backend & Database
- **ORM:** Prisma 6
- **Database:** PostgreSQL (Neon Serverless)
- **API:** Next.js API Routes
- **Validation:** Zod Schema Validation

### Quality Assurance
- **Linting:** ESLint 9 (Flat Config)
- **Formatting:** Prettier 3
- **Git Hooks:** Husky + lint-staged
- **Type Safety:** TypeScript Strict Mode

---

## Architecture & Patterns

### Global State Management

Implemented using React Context API for authentication and UI state:

**AuthContext:**
- User session management
- LocalStorage persistence
- Loading state handling for hydration safety

**UIContext:**  
- Theme management (light/dark mode)
- Sidebar state control
- OS preference detection

**Implementation:**
```typescript
const { login, logout, isAuthenticated } = useAuth();
const { theme, toggleTheme } = useUI();
```

### Input Validation

Centralized schema validation using Zod:

**Schema Registry** (`src/lib/schemas.ts`):
- Defines validation rules for all forms
- Provides TypeScript type inference
- Ensures consistency across client and server

**API Layer:**
- Request validation before processing
- Standardized error responses with field-level detail
- Type-safe data handling

**Success Response:**
```json
{
  "success": true,
  "message": "Validation passed",
  "data": {"email": "student@kalvium.community"}
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {"field": "email", "message": "Invalid email address"},
    {"field": "password", "message": "Password must be at least 6 characters"}
  ]
}
```

---

## Database Management

### Migration Workflow

Version-controlled schema management using Prisma:

```bash
# Create migration
npx prisma migrate dev --name <description>

# Reset database (development only)
npx prisma migrate reset
```

### Seeding Strategy

Idempotent seed script using upsert operations:

**Benefits:**
- Safe for multiple executions
- No duplicate key errors
- Consistent development environment across team

**Implementation:**
```typescript
await prisma.user.upsert({
  where: { email: "user@example.com" },
  update: {},
  create: { email: "user@example.com", name: "User" }
});
```

**Verification:**
```bash
npx prisma studio
# Access database GUI at http://localhost:5555
```

---

## Performance & Data Integrity

### Atomic Transactions

Critical operations wrapped in database transactions:

**Use Case:** Lesson Completion with XP Award

```typescript
const result = await prisma.$transaction(async (tx) => {
  const progress = await tx.userProgress.upsert({...});
  const user = await tx.user.update({ 
    data: { xp: { increment: 10 } } 
  });
  return { progress, user };
});
```

**Guarantees:**
- All-or-nothing execution
- Data consistency across tables
- Automatic rollback on failure

### Query Optimization

**Indexing Strategy:**
- `@@index([userId])` on UserProgress for dashboard queries
- `@@index([email])` on User for authentication lookups
- `@@index([lessonId])` for lesson analytics

**Field Selection:**
```typescript
// Optimized: Select only required fields
await prisma.user.findMany({
  select: { id: true, name: true, _count: { select: { progress: true } } }
});

// Avoid: Over-fetching with include
await prisma.user.findMany({ include: { progress: { include: { lesson: true } } } });
```

**Performance Impact:**
- Reduces data transfer by approximately 80%
- Converts O(n) full table scans to O(log n) B-tree lookups
- Critical for scalability with thousands of users

---

## Form Handling

### React Hook Form Integration

Migrated from manual state management to React Hook Form:

**Generic Input Component:**
```typescript
interface FormInputProps<T extends FieldValues> {
  name: Path<T>; // Type-safe field names from Zod schema
  register: UseFormRegister<T>;
  error?: FieldError;
}
```

**Validation Flow:**
1. Schema defined in `lib/schemas.ts` using Zod
2. `zodResolver` connects schema to React Hook Form
3. Instant client-side validation feedback

**Benefits:**
- **Type Safety:** Compile-time field name validation
- **Performance:** Selective re-rendering (only changed fields)
- **User Experience:** Immediate error feedback
- **Consistency:** Single source of truth for validation rules

---

## UX Resilience

### Loading States

Next.js Suspense integration with skeleton loaders:

**Implementation** (`loading.tsx`):
```tsx
<div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
```

**Benefits:**
- Immediate visual feedback during data fetching
- Prevents content layout shift
- Reduces perceived wait time

### Error Boundaries

Graceful degradation for server failures:

**Implementation** (`error.tsx`):
```tsx
<button onClick={() => reset()}>Try Again</button>
```

**Features:**
- Catches server-side errors without app crash
- Retry mechanism without browser refresh
- Error logging for observability (console in dev, Sentry in production)

**Production Impact:**
- No blank screens during network issues
- User retains control during failures
- Maintains trust through transparent error handling

---

## Centralized Error Handling

### Overview

OfflineAcademy uses a centralized error handling strategy to ensure consistency, security, and observability across the application. By funneling all API errors through a single handler, we maintain a uniform response format and prevent sensitive internal data from leaking to production users.

**Key Benefits:**
- **Consistency:** Every error follows a uniform response format.
- **Security:** Sensitive stack traces are hidden in production.
- **Observability:** Structured JSON logs make debugging and monitoring easier in CloudWatch or Azure Monitor.

### Implementation Details

#### 1. Structured Logger (`src/lib/logger.ts`)
The logger provides JSON-formatted outputs that are easily searchable in cloud environments.

```typescript
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(JSON.stringify({ level: "info", message, meta, timestamp: new Date() }));
  },
  error: (message: string, meta?: any) => {
    console.error(JSON.stringify({ level: "error", message, meta, timestamp: new Date() }));
  },
};
```

#### 2. Centralized Error Handler (`src/lib/errorHandler.ts`)
The `handleError` function classifies and formats errors based on the environment.

```typescript
export function handleError(error: any, context: string) {
  const isProd = process.env.NODE_ENV === "production";

  const errorResponse = {
    success: false,
    message: isProd
      ? "Something went wrong. Please try again later."
      : error.message || "Unknown error",
    ...(isProd ? {} : { stack: error.stack }),
  };

  logger.error(`Error in ${context}`, {
    message: error.message,
    stack: isProd ? "REDACTED" : error.stack,
  });

  return NextResponse.json(errorResponse, { status: 500 });
}
```

#### 3. API Integration Example
Using the handler in routes ensures that even unexpected crashes are caught gracefully.

```typescript
export async function GET() {
  try {
    throw new Error("Database connection failed!");
  } catch (error) {
    return handleError(error, "GET /api/users");
  }
}
```

### Development vs Production Behavior

| Feature | Development Mode | Production Mode |
|---------|------------------|-----------------|
| **Message** | Full error message (e.g., "DB Timeout") | Generic safe message ("Something went wrong") |
| **Stack Trace** | Sent in JSON response | Completely hidden/removed |
| **Logging** | Full details in console | Detailed internal logs, redacted stack traces |

### Evidence & Reflection

#### Logs (Console Output)
```json
{
  "level": "error",
  "message": "Error in GET /api/error-test",
  "meta": {
    "message": "Database connection failed!",
    "stack": "REDACTED"
  },
  "timestamp": "2025-10-29T16:45:00Z"
}
```

#### Reflection
- **Debugging Efficiency:** Structured logs allow developers to filter errors by context or severity in production logs without needing to replicate the environment.
- **User Trust:** By redacting sensitive data (like database paths or internal logic) in production, we protect the system against information disclosure attacks and provide a professional, polished experience even when things go wrong.
- **Extensibility:** The handler can be easily extended to handle specific error types (e.g., `ValidationError`, `AuthError`) by checking the error's instance or status code.

---

## Development Workflow

### Quality Assurance Pipeline

**Pre-commit Checks:**
```bash
npx lint-staged  # Runs ESLint + Prettier on staged files
```

---

## Testing (Jest + React Testing Library)

This project uses **Jest** and **React Testing Library (RTL)** for unit + integration tests, including **integration testing for Next.js API route handlers**.

### Install

From `offline-academy/`:

```bash
npm install
```

### Run tests

```bash
npm test
```

### Run tests with coverage (required)

```bash
npm run test:coverage
```

### Coverage thresholds (quality gate)

Coverage is enforced at **80% minimum** (branches/functions/lines/statements) via `offline-academy/jest.config.js`. CI will fail if coverage drops below the threshold.

### What we test

- **Unit tests**: small logic utilities + isolated UI components
- **Integration tests (API routes)**: call Next.js route handlers directly and validate behavior while mocking external dependencies (DB/auth)

Examples added in `offline-academy/__tests__/`:
- `Button.test.tsx` (RTL component test)
- `format.test.ts` (logic test)
- `api-enroll.test.ts`, `api-me.test.ts`, `api-progress.test.ts` (API route integration tests)

### CI Integration

GitHub Actions runs coverage in `offline-academy/.github/workflows/ci.yml`:

- `npm run test:coverage`

This keeps deployments safe by preventing regressions.

### Reflection

- **Why unit tests matter**: they catch bugs early, speed up iteration, and prevent regressions during feature changes.
- **Current gaps**: we’re strong on unit + API integration tests; adding **E2E** (Playwright/Cypress) would validate full user journeys (signup → enroll → complete lesson) in the browser.
- **Reliability impact**: coverage thresholds + CI checks enforce a consistent quality bar, making releases safer and easier to maintain.

**Configuration:**
- TypeScript Strict Mode enabled
- ESLint 9 Flat Config with React rules
- Prettier for consistent code formatting
- Husky for automated git hooks

### Reproducibility

All contributors use identical tooling:
- Node.js version specified in `.nvmrc` (if present)
- Dependency versions locked in `package-lock.json`
- Editor config standardization (ESLint + Prettier integration)

---

## Project Structure

```
offline-academy/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # Reusable UI components
│   ├── context/          # Global state (Auth, UI)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities, schemas, database client
│   └── middleware.ts     # Request interceptors
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── seed.ts           # Idempotent seed data
│   └── migrations/       # Version-controlled migrations
└── public/               # Static assets
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database (or Neon serverless account)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd offline-academy

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL

# Run database migrations
npx prisma migrate dev

# Seed initial data
npx prisma db seed

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev         # Start development server (port 3000)
npm run build       # Create production build
npm run start       # Start production server
npm run lint        # Run ESLint
npx prisma studio   # Open database GUI
```

---

## Contributing

1. Follow existing code style (enforced by ESLint/Prettier)
2. Write type-safe code (no `any` types)
3. Include tests for new features
4. Update documentation for API changes

---

## License

MIT License - See LICENSE file for details
