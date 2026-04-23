import { adminDb } from '@/lib/firebase/admin'
import type { Zone } from '@/types'

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