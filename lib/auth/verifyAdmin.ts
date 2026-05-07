import { adminAuth, adminDb } from '@/lib/firebase/admin'
import { cookies } from 'next/headers'

/**
 * Vérifie que la session courante correspond à un admin.
 * Convention projet: un admin a un doc dans la collection `admin/{uid}`.
 */
export async function verifyAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value

  if (!session) throw new Error('No session cookie')

  const decoded = await adminAuth.verifySessionCookie(session, true)
  const adminSnap = await adminDb.collection('admin').doc(decoded.uid).get()

  if (!adminSnap.exists) throw new Error('Not admin')

  return decoded
}

