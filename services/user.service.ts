import { adminDb } from '@/lib/firebase/admin'
import type { User } from '@/types'

function toPlain<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}

export async function getAllUsers(): Promise<User[]> {
  const snapshot = await adminDb.collection('users').get()
  return toPlain(snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User)))
}

export async function getUserById(uid: string): Promise<User | null> {
  const doc = await adminDb.collection('users').doc(uid).get()
  if (!doc.exists) return null
  return toPlain({ uid: doc.id, ...doc.data() } as User)
}

export async function createUser(data: Omit<User, 'uid'>): Promise<string> {
  const ref = await adminDb.collection('users').add(data)
  return ref.id
}

export async function updateUser(uid: string, data: Partial<User>): Promise<void> {
  await adminDb.collection('users').doc(uid).update(data)
}

export async function deleteUser(uid: string): Promise<void> {
  await adminDb.collection('users').doc(uid).delete()
}

export async function getAggregatedStats(): Promise<{
  totalUsers: number
  totalZones: number
  activeSensors: number
  totalAlerts: number
}> {
  const users = await getAllUsers()
  let totalZones = 0
  let activeSensors = 0
  let totalAlerts = 0

  for (const user of users) {
    const [zonesSnap, alertsSnap] = await Promise.all([
      adminDb.collection('users').doc(user.uid).collection('zones').get(),
      adminDb.collection('users').doc(user.uid).collection('alerts').get(),
    ])

    totalZones  += zonesSnap.size
    totalAlerts += alertsSnap.size

    for (const zoneDoc of zonesSnap.docs) {
      const sensorsSnap = await adminDb
        .collection('users').doc(user.uid)
        .collection('zones').doc(zoneDoc.id)
        .collection('sensors')
        .where('active', '==', true).get()
      activeSensors += sensorsSnap.size
    }
  }

  return { totalUsers: users.length, totalZones, activeSensors, totalAlerts }
}