import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase/admin'
import { updateUser, deleteUser } from '@/services/user.service'
import { cookies } from 'next/headers'

async function verifyAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  if (!session) throw new Error('No session')
  const decoded = await adminAuth.verifySessionCookie(session, true)
  if (!decoded.isAdmin) throw new Error('Not admin')
  return decoded
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    await verifyAdmin()
    const { uid } = await params
    const data = await request.json()
    await updateUser(uid, data)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    await verifyAdmin()
    const { uid } = await params
    await deleteUser(uid)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
}
