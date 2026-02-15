# SwitchUp Fitness Tracker - Quick Reference Guide

## 🎯 What Has Been Created

### ✅ Completed Files & Packages

#### **1. Shared Package (`packages/shared/`)**

**Schemas (`packages/shared/src/schemas/`):**
- [workout.schema.ts](packages/shared/src/schemas/workout.schema.ts) - Workout validation schemas
- [user.schema.ts](packages/shared/src/schemas/user.schema.ts) - User profile schemas
- [activity.schema.ts](packages/shared/src/schemas/activity.schema.ts) - Activity schemas
- [auth.schema.ts](packages/shared/src/schemas/auth.schema.ts) - Authentication schemas
- [dashboard.schema.ts](packages/shared/src/schemas/dashboard.schema.ts) - Dashboard data schemas
- [index.ts](packages/shared/src/schemas/index.ts) - Schema exports

**Constants (`packages/shared/src/constants/`):**
- [activities.ts](packages/shared/src/constants/activities.ts) - 23 predefined activities
- [errors.ts](packages/shared/src/constants/errors.ts) - Error codes and messages
- [index.ts](packages/shared/src/constants/index.ts) - App-wide constants

**Utilities (`packages/shared/src/utils/`):**
- [date.utils.ts](packages/shared/src/utils/date.utils.ts) - Date manipulation functions
- [validation.utils.ts](packages/shared/src/utils/validation.utils.ts) - Validation helpers
- [index.ts](packages/shared/src/utils/index.ts) - Utility exports

**Types (`packages/shared/src/types/`):**
- [index.ts](packages/shared/src/types/index.ts) - TypeScript type exports

**Main:**
- [index.ts](packages/shared/src/index.ts) - Main package export
- [package.json](packages/shared/package.json) - Package configuration

---

#### **2. Seeding Package (`packages/seeding/`)**

**Seeders (`packages/seeding/src/seeders/`):**
- [activities.seeder.ts](packages/seeding/src/seeders/activities.seeder.ts) - Seed activities
- [users.seeder.ts](packages/seeding/src/seeders/users.seeder.ts) - Seed demo users

**Library (`packages/seeding/src/lib/`):**
- [firebase.ts](packages/seeding/src/lib/firebase.ts) - Firebase Admin initialization

**Fixtures (`packages/seeding/src/fixtures/`):**
- [activities.json](packages/seeding/src/fixtures/activities.json) - Activity data

**Main:**
- [index.ts](packages/seeding/src/index.ts) - Main seeding orchestrator
- [package.json](packages/seeding/package.json) - Package configuration
- [tsconfig.json](packages/seeding/tsconfig.json) - TypeScript configuration
- [.env.example](packages/seeding/.env.example) - Environment variables template

---

#### **3. Firebase Configuration (Root)**

- [firebase.json](firebase.json) - Firebase project configuration
- [firestore.rules](firestore.rules) - Firestore security rules
- [firestore.indexes.json](firestore.indexes.json) - Database indexes
- [storage.rules](storage.rules) - Storage security rules
- [.firebaserc](.firebaserc) - Firebase project ID

---

#### **4. Documentation (`docs/`)**

- [PROJECT_SETUP.md](docs/PROJECT_SETUP.md) - Complete setup guide
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - What's been implemented
- [README.md](README.md) - Project overview (updated)
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - This file

**Directories created:**
- `docs/guides/` - Step-by-step guides (empty, ready for content)
- `docs/adr/` - Architecture Decision Records (empty, ready for content)
- `docs/api/` - API documentation (empty, ready for content)

---

## 🚧 Files That Need to Be Created

### **Backend (apps/functions/src/)**

#### tRPC Setup:
```
apps/functions/src/
├── trpc/
│   ├── init.ts              # ❌ TODO: tRPC initialization
│   ├── context.ts           # ❌ TODO: Request context with Firebase Auth
│   ├── middleware.ts        # ❌ TODO: Authentication middleware
│   └── router/
│       ├── _app.ts          # ❌ TODO: Root router
│       ├── auth.ts          # ❌ TODO: Auth procedures
│       ├── workout.ts       # ❌ TODO: Workout CRUD
│       ├── activity.ts      # ❌ TODO: Activity list
│       └── dashboard.ts     # ❌ TODO: Dashboard stats
├── services/
│   ├── workoutService.ts    # ❌ TODO: Workout business logic
│   ├── activityService.ts   # ❌ TODO: Activity business logic
│   └── dashboardService.ts  # ❌ TODO: Analytics calculations
├── utils/
│   ├── errors.ts            # ❌ TODO: Error handling
│   └── validators.ts        # ❌ TODO: Runtime validation
└── index.ts                 # ❌ TODO: Cloud Function entry point
```

#### Package Configuration:
- `apps/functions/package.json` - ❌ TODO: Add tRPC dependencies
- `apps/functions/tsconfig.json` - ✅ Exists

---

### **Frontend (apps/web/src/)**

#### Core Setup:
```
apps/web/src/
├── lib/
│   ├── firebase.ts          # ❌ TODO: Firebase client initialization
│   ├── trpc.ts              # ❌ TODO: tRPC client setup
│   ├── queryClient.ts       # ❌ TODO: TanStack Query configuration
│   └── utils.ts             # ✅ Exists (Tailwind utils)
├── hooks/
│   ├── useAuth.ts           # ❌ TODO: Authentication hook
│   ├── useWorkouts.ts       # ❌ TODO: Workout management hook
│   └── useDashboard.ts      # ❌ TODO: Dashboard data hook
├── env.ts                   # ❌ TODO: T3 Env validation
```

#### Authentication Components:
```
apps/web/src/components/auth/
├── LoginForm.tsx            # ❌ TODO: Login form with validation
├── SignupForm.tsx           # ❌ TODO: Signup form with validation
├── AuthGuard.tsx            # ❌ TODO: Protected route wrapper
└── PasswordReset.tsx        # ❌ TODO: Password reset form
```

#### Workout Components:
```
apps/web/src/components/workout/
├── WorkoutForm.tsx          # ❌ TODO: Create/edit workout form
├── WorkoutCard.tsx          # ❌ TODO: Single workout display
├── WorkoutList.tsx          # ❌ TODO: List of workouts
├── ActivitySelector.tsx     # ❌ TODO: Dropdown for activity selection
└── WorkoutFilters.tsx       # ❌ TODO: Filter workouts by date/activity
```

#### Dashboard Components:
```
apps/web/src/components/dashboard/
├── Dashboard.tsx            # ❌ TODO: Main dashboard view
├── StatsCard.tsx            # ❌ TODO: Statistics display card
├── ProgressChart.tsx        # ❌ TODO: Weekly progress chart
├── ActivityBreakdown.tsx    # ❌ TODO: Activity distribution pie chart
└── WeeklySummary.tsx        # ❌ TODO: Week-by-week summary
```

#### Layout Components:
```
apps/web/src/components/layout/
├── Header.tsx               # ✅ Exists (needs updating)
├── Sidebar.tsx              # ❌ TODO: Navigation sidebar
├── Footer.tsx               # ❌ TODO: Footer component
└── MainLayout.tsx           # ❌ TODO: Main app layout wrapper
```

#### Pages:
```
apps/web/src/pages/
├── HomePage.tsx             # ❌ TODO: Landing/welcome page
├── DashboardPage.tsx        # ❌ TODO: Dashboard view
├── WorkoutsPage.tsx         # ❌ TODO: Workout management page
├── HistoryPage.tsx          # ❌ TODO: Workout history page
├── LoginPage.tsx            # ❌ TODO: Login page
├── SignupPage.tsx           # ❌ TODO: Signup page
├── ProfilePage.tsx          # ❌ TODO: User profile page
└── NotFoundPage.tsx         # ❌ TODO: 404 page
```

#### Configuration:
- `apps/web/.env.example` - ❌ TODO: Create with Firebase config
- `apps/web/.env.local` - ❌ TODO: Local environment variables
- `apps/web/tailwind.config.ts` - ✅ Exists (may need updating)
- `apps/web/vite.config.ts` - ✅ Exists (may need updating)

---

### **Testing**

#### Unit Tests (Vitest):
```
apps/web/tests/
├── unit/
│   ├── components/
│   │   ├── WorkoutForm.test.tsx       # ❌ TODO
│   │   ├── WorkoutCard.test.tsx       # ❌ TODO
│   │   └── ActivitySelector.test.tsx  # ❌ TODO
│   └── hooks/
│       ├── useAuth.test.ts            # ❌ TODO
│       └── useWorkouts.test.ts        # ❌ TODO
├── setup.ts                            # ❌ TODO: Test setup file
└── __mocks__/                          # ❌ TODO: Mock data
```

#### E2E Tests (Playwright):
```
apps/web/tests/e2e/
├── auth.spec.ts             # ❌ TODO: Auth flow tests
├── workouts.spec.ts         # ❌ TODO: Workout CRUD tests
└── dashboard.spec.ts        # ❌ TODO: Dashboard tests
```

#### Configuration:
- `apps/web/vitest.config.ts` - ❌ TODO: Vitest configuration
- `apps/web/playwright.config.ts` - ❌ TODO: Playwright configuration

---

### **Storybook**

```
apps/web/.storybook/
├── main.ts                  # ❌ TODO: Storybook configuration
├── preview.ts               # ❌ TODO: Global decorators
└── theme.ts                 # ❌ TODO: Theme configuration

apps/web/src/components/**/*.stories.tsx  # ❌ TODO: Component stories
```

---

### **CI/CD (`.github/workflows/`)**

- `ci.yml` - ✅ Exists (may need updating for Firebase)
- `deploy-firebase.yml` - ❌ TODO: Firebase deployment workflow
- `deploy-preview.yml` - ❌ TODO: Preview channel deployment
- `deploy-prod.yml` - ❌ TODO: Production deployment
- `release.yml` - ✅ Exists

---

## 📝 Environment Variables Needed

### **apps/web/.env.local**
```env
# Get these from Firebase Console > Project Settings > General
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Local development
VITE_API_URL=http://localhost:5001/{PROJECT_ID}/us-central1/trpc
```

### **packages/seeding/.env**
```env
FIREBASE_PROJECT_ID=your-project-id
USE_EMULATOR=true
FIRESTORE_EMULATOR_HOST=localhost:8080
SEED_USERS=true
```

### **Root .env** (for CI/CD)
```env
FIREBASE_TOKEN=your-ci-token
```

---

## 🎯 Quick Start Checklist

### Initial Setup
- [ ] Update `.firebaserc` with your Firebase project ID
- [ ] Copy `apps/web/.env.example` to `apps/web/.env.local` and fill in values
- [ ] Copy `packages/seeding/.env.example` to `packages/seeding/.env`
- [ ] Run `pnpm install` to install all dependencies
- [ ] Run `firebase login` to authenticate

### Backend Setup
- [ ] Install backend dependencies: `cd apps/functions && pnpm add @trpc/server firebase-admin firebase-functions`
- [ ] Create tRPC router structure (see files above)
- [ ] Implement authentication middleware
- [ ] Create workout CRUD procedures
- [ ] Create dashboard procedures

### Frontend Setup
- [ ] Install frontend dependencies: `cd apps/web && pnpm add @trpc/client @trpc/react-query @tanstack/react-query firebase react-hook-form @hookform/resolvers`
- [ ] Create Firebase client configuration
- [ ] Create tRPC client configuration
- [ ] Install shadcn/ui components
- [ ] Create authentication components
- [ ] Create workout management components
- [ ] Create dashboard components

### Testing Setup
- [ ] Configure Vitest
- [ ] Configure Playwright
- [ ] Write unit tests for components
- [ ] Write E2E tests for critical flows

### Development Workflow
- [ ] Start Firebase emulators: `firebase emulators:start`
- [ ] Seed database: `pnpm --filter @repo/seeding seed`
- [ ] Start dev servers: `pnpm dev`
- [ ] Access app at http://localhost:5173

---

## 🔗 Important Links

- **Setup Guide**: [docs/PROJECT_SETUP.md](docs/PROJECT_SETUP.md)
- **Implementation Summary**: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
- **Firebase Console**: https://console.firebase.google.com
- **shadcn/ui Components**: https://ui.shadcn.com
- **tRPC Docs**: https://trpc.io/docs

---

## 💡 Tips

1. **Start with Backend**: Implement tRPC routers first so frontend has API to consume
2. **Use Emulators**: Develop locally with Firebase emulators to avoid costs
3. **Seed Database**: Run seeding script after starting emulators
4. **Test Early**: Write tests as you build components
5. **Type Safety**: Let TypeScript guide you - schemas are already defined

---

**Last Updated**: 2026-02-11
