# Setup Instructions for SwitchUp Fitness Tracker

## Prerequisites
- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase account and project created

## Step 1: Install Dependencies
```bash
pnpm install
```

## Step 2: Firebase Setup

### Option A: Using Firebase Production (Recommended for Testing)

1. **Login to Firebase**
   ```bash
   firebase login
   ```

2. **Deploy Firestore Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

3. **Verify Firebase Configuration**
   - Check that `.env.local` in `apps/web/` has all Firebase credentials
   - The project ID should match your Firebase project: `switchup-e319d`

### Option B: Using Firebase Emulators (Local Development)

1. **Start Firebase Emulators**
   ```bash
   firebase emulators:start
   ```

2. **Update Firebase Configuration**
   Add this to your `apps/web/src/lib/firebase.ts` after the firebaseConfig:
   ```typescript
   // Connect to emulators in development
   if (import.meta.env.DEV) {
     connectAuthEmulator(auth, 'http://127.0.0.1:9099');
     connectFirestoreEmulator(db, '127.0.0.1', 8080);
   }
   ```

## Step 3: Start the Development Server

```bash
pnpm dev
```

The app will be available at: http://localhost:5173

## Step 4: Using the Application

### Navigation
- **Dashboard**: View your workout statistics and progress
  - Total workouts, duration, and calories
  - Weekly progress
  - Current streak
  - Top activities (with medals 🥇🥈🥉)

- **My Workouts**: Manage your workout entries
  - Click "+ Log Workout" to create a new workout
  - Click "Edit" on any workout card to modify it
  - Click "Delete" to remove a workout (with confirmation)

### Creating a Workout
1. Navigate to "My Workouts" page
2. Click "+ Log Workout" button
3. Fill in the form:
   - Select an activity (Cardio, Strength, or Flexibility categories)
   - Enter duration in minutes
   - Calories will auto-calculate based on activity and duration
   - Select date and time
   - Optionally add notes
4. Click "Log Workout" to save

### Viewing Dashboard
1. Navigate to "Dashboard" page
2. View your:
   - Total statistics (workouts, duration, calories, streak)
   - This week's progress
   - Top 3 activities with medal rankings
   - Motivational messages based on your progress

## Troubleshooting

### Workouts Not Saving?
1. **Check Browser Console**: Open DevTools (F12) and look for error messages
2. **Verify Authentication**: Make sure you're logged in (check header shows your email)
3. **Check Firestore Rules**: Ensure rules are deployed
   ```bash
   firebase deploy --only firestore:rules
   ```
4. **Verify Firebase Config**: Check `.env.local` has correct values

### Can't See "My Workouts" Page?
1. Check that you're logged in (if not, you'll be redirected to login)
2. Look for the "My Workouts" link in the navigation header
3. Manually navigate to: http://localhost:5173/workouts

### Changes Not Reflecting on Dashboard?
- The dashboard automatically fetches all workouts when the page loads
- Try refreshing the page (F5) to see latest data
- Check browser console for any error messages

## Recent Changes

### Removed "Sports" Category
The "sports" activity category has been completely removed from:
- Activity schema
- Predefined activities list (basketball, soccer, tennis, etc.)
- Workout form dropdown

Available categories are now:
- **Cardio**: Running, Cycling, Swimming, Walking, Jump Rope, Rowing, Elliptical
- **Strength**: Weight Training, Bodyweight Exercises, CrossFit, Powerlifting
- **Flexibility**: Yoga, Pilates, Stretching, Tai Chi

### Enhanced Dashboard
The dashboard now features:
- Modern lucide-react icons (Activity, Clock, Flame, TrendingUp, Award, Calendar)
- Gradient card backgrounds with unique colors
- Animated hover effects
- Medal-themed top activities section (🥇🥈🥉)
- Improved motivational messages with icons
- Responsive design for mobile, tablet, and desktop

### Improved Error Handling
- Success messages appear after create/update/delete operations
- Error messages show specific details if operations fail
- Console logging for debugging
- User-friendly error display with dismiss button

## Development Commands

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Run type checking
pnpm typecheck

# Run linting
pnpm lint

# Run tests
pnpm test

# Build for production
pnpm build

# Deploy to Firebase
firebase deploy
```

## Firebase Emulator UI
When running emulators, access the UI at: http://localhost:4000
- View Firestore data
- Inspect authentication users
- Monitor requests

## Support
If you encounter issues:
1. Check browser console for errors
2. Check Firebase console for quota/billing issues
3. Verify all environment variables are set
4. Try clearing browser cache and local storage
5. Restart the dev server
