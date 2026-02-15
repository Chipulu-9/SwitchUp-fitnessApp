import { initializeApp as initializeAdminApp, cert, getApps, App } from 'firebase-admin/app';

let app: App | null = null;

/**
 * Initialize Firebase Admin SDK
 * Can work with emulator or production
 */
export function initializeApp(): App {
  if (app) {
    return app;
  }

  const existingApps = getApps();
  if (existingApps.length > 0) {
    app = existingApps[0]!;
    return app;
  }

  // Check if using emulator
  const useEmulator = process.env.FIRESTORE_EMULATOR_HOST || process.env.USE_EMULATOR === 'true';

  if (useEmulator) {
    console.log('🔧 Using Firebase Emulator');
    // For emulator, we don't need service account credentials
    app = initializeAdminApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'demo-project',
    });
  } else {
    console.log('🌐 Using Firebase Production');
    // For production, require service account
    const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    if (!serviceAccountPath) {
      throw new Error(
        'GOOGLE_APPLICATION_CREDENTIALS environment variable must be set for production use'
      );
    }

    const serviceAccount = require(serviceAccountPath);

    app = initializeAdminApp({
      credential: cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  }

  return app;
}
