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
    const zoneRef = adminDb.collection('users').doc(uid).collection('zones').doc(doc.id)
    const plantDoc = await zoneRef.collection('plante').doc('current').get()
    const plantData = plantDoc.exists ? plantDoc.data() : {}
    zones[doc.id] = toPlain({
      id: doc.id,
      ...doc.data(),
      plant_type: plantData?.plant_type || undefined,
      thresholds: plantData?.thresholds || undefined,
    } as unknown as Zone)
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
  const zoneRef = adminDb.collection('users').doc(uid).collection('zones').doc(zoneId)
  const hasPlantType = Object.prototype.hasOwnProperty.call(data, 'plant_type')
  const hasThresholds = Object.prototype.hasOwnProperty.call(data, 'thresholds')

  if (hasPlantType || hasThresholds) {
    const plantRef = zoneRef.collection('plante').doc('current')
    const nextPlantType = (data as any).plant_type
    const nextThresholds = (data as any).thresholds

    if (!nextPlantType) {
      await plantRef.delete().catch(() => undefined)
    } else {
      await plantRef.set(
        {
          plant_type: nextPlantType,
          thresholds: nextThresholds ?? null,
          updatedAt: new Date(),
        },
        { merge: true }
      )
    }
  }

  const zoneUpdate: any = { ...data }
  delete zoneUpdate.plant_type
  delete zoneUpdate.thresholds

  if (Object.keys(zoneUpdate).length > 0) {
    await zoneRef.update(zoneUpdate)
  }
}

export async function deleteZone(uid: string, zoneId: string): Promise<void> {
  await adminDb.collection('users').doc(uid)
    .collection('zones').doc(zoneId).delete()
}
