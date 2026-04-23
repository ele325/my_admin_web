import { adminDb } from '@/lib/firebase/admin'
import type { Config } from '@/types'

function toPlain<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}

export async function getConfigByUser(uid: string): Promise<Config | null> {
  // config est un champ dans le document user, pas une sous-collection
  const doc = await adminDb.collection('users').doc(uid).get()
  const config = doc.data()?.config || null
  return config ? toPlain(config as Config) : null
}

export async function updateConfig(uid: string, data: Partial<Config>): Promise<void> {
  await adminDb.collection('users').doc(uid).update({ config: data })
}