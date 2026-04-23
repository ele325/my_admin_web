import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase/admin'
import { deleteAlert } from '@/services/alert.service'
import { cookies } from 'next/headers'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ uid: string; alertId: string }> }
) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')?.value
    if (!session) throw new Error('No session')
    const decoded = await adminAuth.verifySessionCookie(session, true)
    if (!decoded.isAdmin) throw new Error('Not admin')
    
    const { uid, alertId } = await params
    await deleteAlert(uid, alertId)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
}
