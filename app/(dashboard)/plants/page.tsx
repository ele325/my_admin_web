import { PlantsView } from '@/components/collections/PlantsView'
import { getAllZonesMeasures } from '@/services/monitoring.service'
import { getAllUsers } from '@/services/user.service'

export default async function PlantsPage({
  searchParams,
}: {
  searchParams: Promise<{ uid?: string; zoneId?: string }>
}) {
  const sp = await searchParams
  const data = await getAllZonesMeasures()
  const users = await getAllUsers()
  const zones = data.flatMap((u) =>
    u.zones.map((z) => ({
      uid: u.uid,
      userName: u.userName,
      zoneId: z.zoneId,
      plant_type: z.zoneData?.plant_type || '',
      thresholds: z.zoneData?.thresholds || null,
    }))
  )
  const initialEditKey = sp.uid && sp.zoneId ? `${sp.uid}:${sp.zoneId}` : null

  return (
    <div style={{
      padding: '32px',
      fontFamily: 'DM Sans, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh',
    }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 24,
          fontWeight: 700,
          color: '#0f172a',
          marginBottom: 4,
        }}>
          🌱 Gestion des Plantes
        </h1>
        <p style={{ fontSize: 13, color: '#94a3b8' }}>
          Créez et configurez les plantes avec leurs seuils optimaux
        </p>
      </div>
      <PlantsView
        zones={zones}
        users={users.map((u) => ({
          uid: u.uid,
          userName: u.fullName || u.email || u.uid,
        }))}
        initialEditKey={initialEditKey}
      />
    </div>
  )
}

