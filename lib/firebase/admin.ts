import * as admin from 'firebase-admin'

function getPrivateKey(): string {
  const key = process.env.FIREBASE_PRIVATE_KEY
  if (!key) {
    throw new Error('FIREBASE_PRIVATE_KEY environment variable is not set')
  }
  // Handle both escaped newlines (from .env files) and actual newlines
  return key.replace(/\\n/g, '\n')
}

function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin.app()
  }

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL

  if (!projectId || !clientEmail) {
    throw new Error('Missing Firebase admin environment variables: FIREBASE_PROJECT_ID and FIREBASE_CLIENT_EMAIL are required')
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: getPrivateKey(),
    }),
  })
}

const app = initializeFirebaseAdmin()

export const adminDb = admin.firestore(app)
export const adminAuth = admin.auth(app)
