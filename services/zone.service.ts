import { adminDb } from '@/lib/firebase/admin'
import type { Zone, Measure } from '@/types'

function toPlain<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}

export async function getZonesByUser(uid: string): Promise<Record<string, Zone>> {
  const snapshot = await adminDb
    .collection('users').doc(uid)
    .collection('zones').get()

  const zones: Record<string, Zone> = {}
  for (const doc of snapshot.docs) {
    zones[doc.id] = toPlain({ id: doc.id, ...doc.data() } as unknown as Zone)
  }
  return zones
}

export async function getZoneMeasures(uid: string, zoneId: string): Promise<Measure[]> {
  const snapshot = await adminDb
    .collection('users').doc(uid)
    .collection('zones').doc(zoneId)
    .collection('measures')
    .orderBy('timestamp', 'desc')
    .limit(24)
    .get()

  return toPlain(snapshot.docs.map(doc => doc.data()) as Measure[])
}

export async function updateZone(uid: string, zoneId: string, data: Partial<Zone>): Promise<void> {
  await adminDb.collection('users').doc(uid)
    .collection('zones').doc(zoneId).update(data)
}

export async function deleteZone(uid: string, zoneId: string): Promise<void> {
  await adminDb.collection('users').doc(uid)
    .collection('zones').doc(zoneId).delete()
}
