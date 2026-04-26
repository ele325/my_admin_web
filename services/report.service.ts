import { adminDb } from '@/lib/firebase/admin'

function toPlain<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}

export async function getAllReportsData() {
  const usersSnap = await adminDb.collection('users').get()
  const result = []

  for (const userDoc of usersSnap.docs) {
    const data = userDoc.data()
    const zonesSnap = await adminDb.collection('users').doc(userDoc.id).collection('zones').get()
    const alertsSnap = await adminDb.collection('users').doc(userDoc.id).collection('alerts').get()

    let avgHealth = 0
    let avgHumidity = 0
    if (zonesSnap.size > 0) {
      zonesSnap.docs.forEach(z => {
        avgHealth   += z.data().sante    || 0
        avgHumidity += z.data().humidity || 0
      })
      avgHealth   = Math.round((avgHealth   / zonesSnap.size) * 10) / 10
      avgHumidity = Math.round((avgHumidity / zonesSnap.size) * 10) / 10
    }

    result.push(toPlain({
      uid:          userDoc.id,
      fullName:     data.fullName  || data.email || userDoc.id,
      email:        data.email     || '',
      plan:         data.subscription?.plan || 'free',
      billing:      data.billing   || [],
      settings:     data.settings  || {},
      zonesCount:   zonesSnap.size,
      alertsCount:  alertsSnap.size,
      avgHealth,
      avgHumidity,
      subscriptionUpdatedAt: data.subscription?.updatedAt || null,
    }))
  }

  return result
}
