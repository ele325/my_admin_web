import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth/verifyAdmin'
import { updateConfig } from '@/services/config.service'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    await verifyAdmin()
    const { uid } = await params
    const data = await request.json()
    await updateConfig(uid, data)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
}
