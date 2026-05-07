import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, Leaf } from 'lucide-react'
import { adminDb } from '@/lib/firebase/admin'
import { getUserById } from '@/services/user.service'
import type { Zone } from '@/types'
import { ZonePlantPicker } from '@/components/zones/ZonePlantPicker'

function toPlain<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}

export default async function ZonePlantPage({
  params,
}: {
  params: Promise<{ uid: string; zoneId: string }>
}) {
  const { uid, zoneId } = await params

  const user = await getUserById(uid)
  if (!user) notFound()

  const zoneDoc = await adminDb.collection('users').doc(uid).collection('zones').doc(zoneId).get()
  if (!zoneDoc.exists) notFound()
  const plantDoc = await adminDb
    .collection('users').doc(uid)
    .collection('zones').doc(zoneId)
    .collection('plante').doc('current')
    .get()

  const zone = toPlain({
    id: zoneDoc.id,
    ...zoneDoc.data(),
    plant_type: plantDoc.data()?.plant_type || undefined,
    thresholds: plantDoc.data()?.thresholds || undefined,
  } as unknown as Zone)

  return (
    <div style={{ padding: '32px', fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 13 }}>
        <Link href="/users" style={{ color: '#94a3b8', textDecoration: 'none' }}>Utilisateurs</Link>
        <span style={{ color: '#cbd5e1' }}>›</span>
        <Link href={`/users/${uid}`} style={{ color: '#94a3b8', textDecoration: 'none' }}>{user.fullName}</Link>
        <span style={{ color: '#cbd5e1' }}>›</span>
        <Link href={`/users/${uid}/zones`} style={{ color: '#94a3b8', textDecoration: 'none' }}>Zones</Link>
        <span style={{ color: '#cbd5e1' }}>›</span>
        <span style={{ color: '#0f172a', fontWeight: 500 }}>Plante</span>
      </div>

      <Link href={`/users/${uid}/zones`} style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        fontSize: 13, color: '#64748b', textDecoration: 'none', marginBottom: 24,
      }}>
        <ChevronLeft size={14} /> Retour aux zones
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 14,
          background: 'linear-gradient(135deg, #16a34a, #3b82f6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Leaf size={22} color="white" />
        </div>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Choisir la plante — {zoneId}
          </h1>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
            Sélectionnez une plante et saisissez ses seuils optimaux (7 paramètres)
          </p>
        </div>
      </div>

      <ZonePlantPicker uid={uid} zoneId={zoneId} zone={zone} />
    </div>
  )
}

