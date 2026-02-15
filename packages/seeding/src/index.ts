import { seedActivities } from './seeders/activities.seeder';
import { seedUsers } from './seeders/users.seeder';

/**
 * Main seeding script
 * Runs all seeders in sequence
 */
async function seed() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Seed activities first (no dependencies)
    await seedActivities();

    console.log(''); // Empty line for spacing

    // Seed test users (optional, for development)
    if (process.env.SEED_USERS === 'true') {
      await seedUsers();
    } else {
      console.log('ℹ️  Skipping user seeding (set SEED_USERS=true to enable)');
    }

    console.log('\n✅ All seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding
seed();
