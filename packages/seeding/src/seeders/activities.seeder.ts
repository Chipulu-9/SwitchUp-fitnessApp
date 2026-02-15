import { getFirestore } from 'firebase-admin/firestore';
import { PREDEFINED_ACTIVITIES } from '@repo/shared';
import { initializeApp } from '../lib/firebase';

/**
 * Seed predefined activities into Firestore
 */
export async function seedActivities() {
  console.log('🌱 Seeding activities...');

  const app = initializeApp();
  const db = getFirestore(app);

  const activitiesRef = db.collection('activities');

  let seededCount = 0;
  let skippedCount = 0;

  for (const activity of PREDEFINED_ACTIVITIES) {
    const activityRef = activitiesRef.doc(activity.id);
    const doc = await activityRef.get();

    if (doc.exists) {
      console.log(`  ⏭️  Skipping existing activity: ${activity.name}`);
      skippedCount++;
    } else {
      await activityRef.set({
        ...activity,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log(`  ✅ Created activity: ${activity.name}`);
      seededCount++;
    }
  }

  console.log(`\n✨ Seeded ${seededCount} activities (${skippedCount} already existed)`);

  return { seededCount, skippedCount };
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedActivities()
    .then(() => {
      console.log('\n🎉 Activity seeding complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error seeding activities:', error);
      process.exit(1);
    });
}
