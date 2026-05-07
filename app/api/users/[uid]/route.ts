import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth/verifyAdmin'
import { updateUser, deleteUser } from '@/services/user.service'

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
