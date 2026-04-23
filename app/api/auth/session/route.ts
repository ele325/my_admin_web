import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase/admin'

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json()
    const decoded = await adminAuth.verifyIdToken(idToken)

    // ✅ Vérifier si la collection "admin" est vide (premier utilisateur)
    const adminCollection = await adminDb.collection('admin').limit(1).get()

    if (adminCollection.empty) {
      // Premier utilisateur → créer son document dans "admin"
      await adminDb.collection('admin').doc(decoded.uid).set({
        uid: decoded.uid,
        email: decoded.email,
        createdAt: new Date(),
        role: 'admin',
      })
    } else {
      // Pas le premier → vérifier s'il est dans la collection "admin"
      const adminDoc = await adminDb.collection('admin').doc(decoded.uid).get()
      if (!adminDoc.exists) {
        return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
      }
    }

    const expiresIn = 60 * 60 * 24 * 7 * 1000
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn })

    const response = NextResponse.json({ success: true })
    response.cookies.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresIn / 1000,
      path: '/',
      sameSite: 'lax',
    })
    return response
 } catch (error) {
  console.error('Session creation error:', error)

  return NextResponse.json(
    {
      error: error instanceof Error ? error.message : 'Authentication failed'
    },
    { status: 401 }
  )
}
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('session')
  return response
}