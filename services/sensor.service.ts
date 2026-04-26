import { adminDb } from '@/lib/firebase/admin'

function toPlain<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}

export async function getAllSensorsData() {
  const usersSnap = await adminDb.collection('users').get()
  const result: {
    uid: string
    userName: string
    zones: {
      zoneId: string
      zoneData: Record<string, any>
      signals: Record<string, any>[]
    }[]
  }[] = []

  for (const userDoc of usersSnap.docs) {
    const user = userDoc.data()
    const zonesSnap = await adminDb.collection('users').doc(userDoc.id).collection('zones').get()
    const zones = []

    for (const zoneDoc of zonesSnap.docs) {
      const signalSnap = await adminDb
        .collection('users').doc(userDoc.id)
        .collection('zones').doc(zoneDoc.id)
        .collection('signal')
        .orderBy('timestamp', 'desc')
        .limit(10)
        .get()

      zones.push({
        zoneId: zoneDoc.id,
        zoneData: toPlain(zoneDoc.data()),
        signals: toPlain(signalSnap.docs.map(d => ({ id: d.id, ...d.data() }))),
      })
    }

    if (zones.length > 0) {
      result.push({ uid: userDoc.id, userName: user.fullName || user.email || userDoc.id, zones })
    }
  }

  return result
}
