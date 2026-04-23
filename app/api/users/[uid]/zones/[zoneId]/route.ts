import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase/admin'
import { updateZone, deleteZone } from '@/services/zone.service'
import { cookies } from 'next/headers'

async function verifyAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  if (!session) throw new Error('No session')
  const decoded = await adminAuth.verifySessionCookie(session, true)
  if (!decoded.isAdmin) throw new Error('Not admin')
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string; zoneId: string }> }
) {
  try {
    await verifyAdmin()
    const { uid, zoneId } = await params
    const data = await request.json()
    await updateZone(uid, zoneId, data)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ uid: string; zoneId: string }> }
) {
  try {
    await verifyAdmin()
    const { uid, zoneId } = await params
    await deleteZone(uid, zoneId)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
}
