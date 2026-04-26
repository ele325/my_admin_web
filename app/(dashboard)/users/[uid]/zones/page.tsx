import { getZonesByUser, getZoneMeasures } from '@/services/zone.service'
import { getUserById } from '@/services/user.service'
import { ZonesView } from '@/components/collections/ZonesView'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function ZonesPage({
  params,
}: {
  params: Promise<{ uid: string }>
}) {
  const { uid } = await params
  const user = await getUserById(uid)
  if (!user) notFound()

  const zones = await getZonesByUser(uid)

  const measuresMap: Record<string, any[]> = {}
  await Promise.all(
    Object.keys(zones).map(async (zoneId) => {
      measuresMap[zoneId] = await getZoneMeasures(uid, zoneId)
    })
  )

  return (
    <div style={{ padding: '32px', fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 13 }}>
        <Link href="/users" style={{ color: '#94a3b8', textDecoration: 'none' }}>Utilisateurs</Link>
        <span style={{ color: '#cbd5e1' }}>›</span>
        <Link href={`/users/${uid}`} style={{ color: '#94a3b8', textDecoration: 'none' }}>{user.fullName}</Link>
        <span style={{ color: '#cbd5e1' }}>›</span>
        <span style={{ color: '#0f172a', fontWeight: 500 }}>Zones</span>
      </div>

      <Link href={`/users/${uid}`} style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        fontSize: 13, color: '#64748b', textDecoration: 'none', marginBottom: 24,
      }}>
        <ChevronLeft size={14} /> Retour au profil
      </Link>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
          Zones de {user.fullName}
        </h1>
        <p style={{ fontSize: 13, color: '#94a3b8' }}>
          {Object.keys(zones).length} zone{Object.keys(zones).length !== 1 ? 's' : ''}
        </p>
      </div>

      <ZonesView uid={uid} zones={zones} measuresMap={measuresMap} />
    </div>
  )
}
