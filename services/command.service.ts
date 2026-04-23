import { adminDb } from '@/lib/firebase/admin'
import type { Command } from '@/types'

function toPlain<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}

export async function getCommandsByUser(uid: string): Promise<Record<string, Command>> {
  const snapshot = await adminDb
    .collection('users').doc(uid)
    .collection('commands').get()

  const commands: Record<string, Command> = {}
  for (const doc of snapshot.docs) {
    commands[doc.id] = toPlain({ id: doc.id, ...doc.data() } as unknown as Command)

  }
  return commands
}

export async function updateCommand(uid: string, commandId: string, data: Partial<Command>): Promise<void> {
  await adminDb.collection('users').doc(uid)
    .collection('commands').doc(commandId).update(data)
}