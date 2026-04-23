import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase/admin'
import { updateConfig } from '@/services/config.service'
import { cookies } from 'next/headers'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')?.value
    if (!session) throw new Error('No session')
    const decoded = await adminAuth.verifySessionCookie(session, true)
    if (!decoded.isAdmin) throw new Error('Not admin')
    
    const { uid } = await params
    const data = await request.json()
    await updateConfig(uid, data)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
}
