import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase/admin'

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json()

    if (!idToken) {
      return NextResponse.json(
        { error: 'idToken manquant' },
        { status: 400 }
      )
    }

    const decoded = await adminAuth.verifyIdToken(idToken)

    const userRef = adminDb.collection('users').doc(decoded.uid)
    const userSnap = await userRef.get()

    if (!userSnap.exists) {
      await userRef.set({
        uid: decoded.uid,
        email: decoded.email ?? null,
        fullName: decoded.name ?? '',
        role: 'user',
        emailVerified: decoded.email_verified ?? false,
        createdAt: new Date(),
      })
    }

    const expiresIn = 60 * 60 * 24 * 7 * 1000

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    })

    const response = NextResponse.json({
      success: true,
      uid: decoded.uid,
    })

    response.cookies.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: expiresIn / 1000,
    })

    return response
  } catch (error) {
    console.error('Session creation error:', error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Authentication failed',
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