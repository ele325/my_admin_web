import { adminDb } from '@/lib/firebase/admin'

function toPlain<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}

export async function getAllZonesMeasures() {
  const usersSnap = await adminDb.collection('users').get()
  const result: {
    uid: string
    userName: string
    zones: {
      zoneId: string
      zoneData: Record<string, any>
      lastMeasure: Record<string, any> | null
      measures: Record<string, any>[]
    }[]
  }[] = []

  for (const userDoc of usersSnap.docs) {
    const user = userDoc.data()
    const zonesSnap = await adminDb.collection('users').doc(userDoc.id).collection('zones').get()
    const zones = []

    for (const zoneDoc of zonesSnap.docs) {
      const measuresSnap = await adminDb
        .collection('users').doc(userDoc.id)
        .collection('zones').doc(zoneDoc.id)
        .collection('measures')
        .orderBy('timestamp', 'desc')
        .limit(24)
        .get()

      const measures = toPlain(measuresSnap.docs.map(d => ({ id: d.id, ...d.data() })))

      zones.push({
        zoneId: zoneDoc.id,
        zoneData: toPlain(zoneDoc.data()),
        lastMeasure: measures[0] || null,
        measures,
      })
    }

    if (zones.length > 0) {
      result.push({ uid: userDoc.id, userName: user.fullName || user.email || userDoc.id, zones })
    }
  }

  return result
}
