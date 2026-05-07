import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth/verifyAdmin'
import { deleteAlert } from '@/services/alert.service'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ uid: string; alertId: string }> }
) {
  try {
    await verifyAdmin()
    const { uid, alertId } = await params
    await deleteAlert(uid, alertId)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
}
