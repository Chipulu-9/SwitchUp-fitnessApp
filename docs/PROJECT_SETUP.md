# SwitchUp - Fitness Tracker Application
## Complete Implementation Guide

This document provides step-by-step instructions for implementing the SwitchUp fitness tracking application based on the Technical Design Document.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Phase 1: Initial Setup](#phase-1-initial-setup)
4. [Phase 2: Backend Implementation](#phase-2-backend-implementation)
5. [Phase 3: Frontend Implementation](#phase-3-frontend-implementation)
6. [Phase 4: Testing](#phase-4-testing)
7. [Phase 5: Deployment](#phase-5-deployment)
8. [Development Workflow](#development-workflow)

---

## Prerequisites

### Required Software
- **Node.js**: >= 20.x
- **pnpm**: >= 8.x
- **Firebase CLI**: Latest version
- **Git**: Latest version

### Firebase Setup
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Enable Firebase Hosting
5. Enable Cloud Functions

### Installation

```bash
# Install Node.js (if not installed)
# Download from https://nodejs.org/

# Install pnpm globally
npm install -g pnpm

# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login
```

---

## Project Structure

The project follows a PNPM monorepo structure:

```
pnpm-mono-repo-template/
├── apps/
│   ├── web/              # React frontend application
│   └── functions/        # Firebase Cloud Functions (tRPC backend)
├── packages/
│   ├── shared/           # Shared Zod schemas, types, constants
│   ├── seeding/          # Database seeding scripts
│   ├── ui/               # Shared UI components
│   ├── config/           # Shared configurations
│   ├── eslint-config/    # ESLint configurations
│   └── typescript-config/ # TypeScript configurations
├── docs/                 # Documentation
├── firebase.json         # Firebase configuration
├── firestore.rules       # Firestore security rules
├── firestore.indexes.json # Firestore indexes
└── .github/              # CI/CD workflows
```

---

## Phase 1: Initial Setup

### Step 1.1: Clone and Install Dependencies

```bash
# Clone the repository
cd pnpm-mono-repo-template

# Install all dependencies
pnpm install
```

### Step 1.2: Configure Firebase

```bash
# Initialize Firebase (if not already done)
firebase init

# Select the following features:
# - Firestore
# - Functions
# - Hosting
# - Emulators (Auth, Firestore, Functions, Hosting)

# Update .firebaserc with your project ID
# Edit the file and replace "your-project-id" with your actual Firebase project ID
```

### Step 1.3: Setup Environment Variables

**For Web App (`apps/web/.env.local`):**

```bash
# Copy example file
cp apps/web/.env.example apps/web/.env.local

# Edit and add your Firebase config
```

```env
# Firebase Config (get from Firebase Console > Project Settings)
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id

# API Endpoint (local development)
VITE_API_URL=http://localhost:5001/your-project-id/us-central1/trpc
```

**For Seeding (`packages/seeding/.env`):**

```bash
# Copy example file
cp packages/seeding/.env.example packages/seeding/.env

# Edit for emulator use
```

```env
FIREBASE_PROJECT_ID=your-project-id
USE_EMULATOR=true
FIRESTORE_EMULATOR_HOST=localhost:8080
SEED_USERS=true
```

---

## Phase 2: Backend Implementation

### Step 2.1: Install Backend Dependencies

```bash
# Navigate to functions directory
cd apps/functions

# Install dependencies specific to functions
pnpm add @trpc/server firebase-admin firebase-functions zod
pnpm add -D @types/node typescript

# Return to root
cd ../..
```

### Step 2.2: Create tRPC Backend Structure

The backend implementation requires creating the following structure in `apps/functions/src/`:

```
apps/functions/src/
├── trpc/
│   ├── init.ts              # tRPC initialization
│   ├── context.ts           # Request context
│   ├── middleware.ts        # Auth middleware
│   └── router/
│       ├── _app.ts          # Root router
│       ├── auth.ts          # Auth procedures
│       ├── workout.ts       # Workout CRUD
│       ├── activity.ts      # Activity procedures
│       └── dashboard.ts     # Dashboard stats
├── services/
│   ├── workoutService.ts
│   └── dashboardService.ts
└── index.ts                 # Cloud Function entry
```

**Key Files to Create:**

1. **apps/functions/src/trpc/init.ts**
2. **apps/functions/src/trpc/context.ts**
3. **apps/functions/src/trpc/middleware.ts**
4. **apps/functions/src/trpc/router/_app.ts**
5. **apps/functions/src/trpc/router/workout.ts**
6. **apps/functions/src/index.ts**

### Step 2.3: Start Firebase Emulators

```bash
# Start all emulators
firebase emulators:start

# In another terminal, seed the database
pnpm --filter @repo/seeding seed
```

---

## Phase 3: Frontend Implementation

### Step 3.1: Install Frontend Dependencies

```bash
cd apps/web

# Core dependencies
pnpm add react react-dom react-router-dom
pnpm add @trpc/client @trpc/react-query @tanstack/react-query
pnpm add firebase zod
pnpm add @hookform/resolvers react-hook-form
pnpm add @t3-oss/env-core

# UI dependencies
pnpm add tailwindcss postcss autoprefixer
pnpm add class-variance-authority clsx tailwind-merge
pnpm add lucide-react

# Dev dependencies
pnpm add -D @vitejs/plugin-react vite
pnpm add -D @types/react @types/react-dom
pnpm add -D vitest @testing-library/react @testing-library/jest-dom
pnpm add -D playwright @playwright/test

cd ../..
```

### Step 3.2: Setup Tailwind CSS

```bash
cd apps/web
npx tailwindcss init -p
cd ../..
```

### Step 3.3: Install shadcn/ui Components

```bash
cd apps/web

# Initialize shadcn/ui
npx shadcn-ui@latest init

# Add required components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add form
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add toast

cd ../..
```

### Step 3.4: Create Core Frontend Structure

```
apps/web/src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── AuthGuard.tsx
│   ├── workout/
│   │   ├── WorkoutForm.tsx
│   │   ├── WorkoutCard.tsx
│   │   ├── WorkoutList.tsx
│   │   └── ActivitySelector.tsx
│   ├── dashboard/
│   │   ├── Dashboard.tsx
│   │   ├── StatsCard.tsx
│   │   └── ProgressChart.tsx
│   └── layout/
│       ├── Header.tsx
│       └── MainLayout.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── DashboardPage.tsx
│   ├── WorkoutsPage.tsx
│   └── LoginPage.tsx
├── lib/
│   ├── firebase.ts
│   ├── trpc.ts
│   └── queryClient.ts
├── hooks/
│   └── useAuth.ts
├── env.ts
├── App.tsx
└── main.tsx
```

---

## Phase 4: Testing

### Step 4.1: Unit Tests (Vitest)

```bash
# Run unit tests
pnpm test

# Run with coverage
pnpm test:coverage

# Watch mode
pnpm test:watch
```

### Step 4.2: E2E Tests (Playwright)

```bash
# Install Playwright browsers
pnpm exec playwright install

# Run E2E tests
pnpm --filter web e2e

# Run in UI mode
pnpm exec playwright test --ui
```

---

## Phase 5: Deployment

### Step 5.1: Build for Production

```bash
# Build all packages
pnpm build

# Verify builds
ls -la apps/web/dist
ls -la apps/functions/dist
```

### Step 5.2: Deploy to Firebase

```bash
# Deploy everything
firebase deploy

# Deploy specific targets
firebase deploy --only hosting      # Frontend only
firebase deploy --only functions   # Backend only
firebase deploy --only firestore    # Database rules only
```

---

## Development Workflow

### Daily Development

```bash
# 1. Start emulators
firebase emulators:start

# 2. In another terminal, start dev servers
pnpm dev

# 3. Access the app
# - Frontend: http://localhost:5173
# - Emulator UI: http://localhost:4000
```

### Common Commands

```bash
# Install dependencies
pnpm install

# Run linting
pnpm lint

# Fix linting issues
pnpm lint:fix

# Type checking
pnpm typecheck

# Format code
pnpm format

# Run all checks (pre-push)
pnpm precheck

# Seed database
pnpm --filter @repo/seeding seed
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: your feature description"

# Push and create PR
git push origin feature/your-feature-name
```

---

## Next Steps

After completing the setup:

1. **Review the TDD**: Read through `Technical Design Doc Template.pdf`
2. **Implement Authentication**: Start with login/signup flows
3. **Build Workout Management**: Implement CRUD operations
4. **Create Dashboard**: Build analytics and visualizations
5. **Write Tests**: Add unit and E2E tests
6. **Deploy**: Push to production

---

## Troubleshooting

### Common Issues

**Emulator Connection Issues:**
```bash
# Clear emulator data
firebase emulators:start --export-on-exit=./emulator-data --import=./emulator-data

# Reset ports if already in use
firebase emulators:start --only firestore --port=8081
```

**Build Errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Clear Turbo cache
pnpm exec turbo daemon clean
```

**Type Errors:**
```bash
# Regenerate types
pnpm typecheck

# Check shared package
cd packages/shared && pnpm typecheck
```

---

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [shadcn/ui](https://ui.shadcn.com/)
- [Turborepo](https://turbo.build/repo/docs)

---

## Support

For issues or questions:
1. Check the documentation in `docs/`
2. Review the TDD
3. Check Firebase Console for errors
4. Review emulator logs
