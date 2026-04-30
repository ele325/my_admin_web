import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase/admin'
import { updateZone, deleteZone } from '@/services/zone.service'
import { cookies } from 'next/headers'

// ✅ CORRECTION — verifyAdmin lit le rôle depuis Firestore
// au lieu de decoded.isAdmin qui est toujours undefined
async function verifyAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value

  if (!session) throw new Error('No session cookie')

  const decoded = await adminAuth.verifySessionCookie(session, true)

  // ✅ Chercher dans la collection 'admin' au lieu de 'users'
  const adminSnap = await adminDb.collection('admin').doc(decoded.uid).get()

  if (!adminSnap.exists) {
    throw new Error('Not admin')
  }

  return decoded
}
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string; zoneId: string }> }
) {
  try {
    await verifyAdmin()
    const { uid, zoneId } = await params
    const data = await request.json()

    console.log(`✅ PUT /api/users/${uid}/zones/${zoneId}`, data)

    await updateZone(uid, zoneId, data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ PUT zone error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unauthorized' },
      { status: 403 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ uid: string; zoneId: string }> }
) {
  try {
    await verifyAdmin()
    const { uid, zoneId } = await params

    console.log(`✅ DELETE /api/users/${uid}/zones/${zoneId}`)

    await deleteZone(uid, zoneId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ DELETE zone error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unauthorized' },
      { status: 403 }
    )
  }
}