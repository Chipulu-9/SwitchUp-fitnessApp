import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from '../lib/firebase';

/**
 * Test users to seed (for development only)
 */
const TEST_USERS = [
  {
    email: 'demo@fitness-tracker.com',
    password: 'password123',
    displayName: 'Demo User',
    preferences: {
      weeklyGoal: 5,
      defaultView: 'dashboard' as const,
      calorieGoal: 500,
      theme: 'light' as const,
    },
  },
  {
    email: 'john.doe@example.com',
    password: 'password123',
    displayName: 'John Doe',
    preferences: {
      weeklyGoal: 3,
      defaultView: 'workouts' as const,
      theme: 'dark' as const,
    },
  },
];

/**
 * Seed test users (development only)
 */
export async function seedUsers() {
  console.log('🌱 Seeding test users...');

  const app = initializeApp();
  const auth = getAuth(app);
  const db = getFirestore(app);

  let seededCount = 0;
  let skippedCount = 0;

  for (const userData of TEST_USERS) {
    try {
      // Check if user already exists
      let user;
      try {
        user = await auth.getUserByEmail(userData.email);
        console.log(`  ⏭️  Skipping existing user: ${userData.email}`);
        skippedCount++;
        continue;
      } catch (error: any) {
        if (error.code !== 'auth/user-not-found') {
          throw error;
        }
      }

      // Create auth user
      user = await auth.createUser({
        email: userData.email,
        password: userData.password,
        displayName: userData.displayName,
      });

      // Create user document in Firestore
      await db.collection('users').doc(user.uid).set({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        role: 'user',
        preferences: userData.preferences,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      console.log(`  ✅ Created user: ${userData.email}`);
      seededCount++;
    } catch (error) {
      console.error(`  ❌ Error creating user ${userData.email}:`, error);
    }
  }

  console.log(`\n✨ Seeded ${seededCount} users (${skippedCount} already existed)`);

  return { seededCount, skippedCount };
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedUsers()
    .then(() => {
      console.log('\n🎉 User seeding complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error seeding users:', error);
      process.exit(1);
    });
}
