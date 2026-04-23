import { adminDb } from '@/lib/firebase/admin'
import type { Prediction } from '@/types'

function toPlain<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}

export async function getPredictionsByUser(uid: string): Promise<Record<string, Prediction>> {
  const snapshot = await adminDb
    .collection('users').doc(uid)
    .collection('predictions').get()

  const predictions: Record<string, Prediction> = {}
  for (const doc of snapshot.docs) {
    predictions[doc.id] = toPlain({ id: doc.id, ...doc.data() } as unknown as Prediction)
  }
  return predictions
}