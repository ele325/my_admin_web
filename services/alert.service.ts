import { adminDb } from '@/lib/firebase/admin'
import type { Alert } from '@/types'

function toPlain<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}

export async function getAlertsByUser(uid: string): Promise<Record<string, Alert>> {
  const snapshot = await adminDb
    .collection('users').doc(uid)
    .collection('alerts').get()

  const alerts: Record<string, Alert> = {}
  for (const doc of snapshot.docs) {
    alerts[doc.id] = toPlain({ id: doc.id, ...doc.data() } as unknown as Alert)
  }
  return alerts
}

export async function deleteAlert(uid: string, alertId: string): Promise<void> {
  await adminDb.collection('users').doc(uid)
    .collection('alerts').doc(alertId).delete()
}